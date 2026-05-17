import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/supabase/types'
import { notifyPendingPhoto } from '@/lib/notifications/notifyPendingPhoto'

type ModerationResult = {
  approved: boolean
  confidence: number
  reason: string
  flags: string[]
}

type ApiResponse = {
  photo: {
    id: string
    guest_name: string
    image_url: string
    public_id: string | null
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
  }
  moderation: ModerationResult
}

const moderationSchema = {
  name: 'photo_moderation',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      approved: { type: 'boolean' },
      confidence: { type: 'number', minimum: 0, maximum: 1 },
      reason: { type: 'string' },
      flags: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['approved', 'confidence', 'reason', 'flags'],
  },
  strict: true,
} as const

function parseModerationResult(raw: string): ModerationResult | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const obj = parsed as Record<string, unknown>
    const approved = obj.approved
    const confidence = obj.confidence
    const reason = obj.reason
    const flags = obj.flags

    if (typeof approved !== 'boolean') return null
    if (typeof confidence !== 'number' || Number.isNaN(confidence)) return null
    if (typeof reason !== 'string') return null
    if (!Array.isArray(flags) || flags.some((f) => typeof f !== 'string')) return null

    return {
      approved,
      confidence: Math.max(0, Math.min(1, confidence)),
      reason,
      flags,
    }
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  try {
    const moderationEnabledRaw = process.env.PHOTO_MODERATION_ENABLED
    const moderationEnabled = moderationEnabledRaw == null
      ? true
      : ['1', 'true', 'yes', 'on'].includes(moderationEnabledRaw.toLowerCase())

    const apiKey = process.env.OPENAI_API_KEY
    if (moderationEnabled && !apiKey) {
      return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Missing Supabase env (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)' }, { status: 500 })
    }

    const body: unknown = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    const obj = body as Record<string, unknown>
    const imageUrl = typeof obj.imageUrl === 'string' ? obj.imageUrl.trim() : ''
    const publicId = typeof obj.publicId === 'string' ? obj.publicId.trim() : ''
    const guestName = typeof obj.guestName === 'string' ? obj.guestName.trim() : ''

    if (!guestName) {
      return NextResponse.json({ error: 'Invalid guestName' }, { status: 400 })
    }

    if (!imageUrl || (!imageUrl.startsWith('https://') && !imageUrl.startsWith('http://'))) {
      return NextResponse.json({ error: 'Invalid imageUrl' }, { status: 400 })
    }

    if (!publicId) {
      return NextResponse.json({ error: 'Invalid publicId' }, { status: 400 })
    }

    let moderation: ModerationResult | null = null

    if (!moderationEnabled) {
      moderation = {
        approved: true,
        confidence: 0.5,
        reason: 'Moderation disabled by PHOTO_MODERATION_ENABLED=false. Sent to manual review.',
        flags: ['moderation_disabled'],
      }
    } else {
      const openai = new OpenAI({ apiKey })

      const systemPrompt = `You are moderating photos uploaded to a private family website for a 15th birthday party ("Quinceañera / XV").

Your task is to analyze the uploaded image and determine if it is appropriate to automatically appear in the public party gallery shown to guests and families during the event.

This is not a generic social media moderation task.
Be reasonable and contextual for a family teenage birthday party.

Approve images that contain:
- normal selfies
- smiling people
- group photos
- family moments
- normal dancing
- decorations
- food
- cake
- party atmosphere
- funny but harmless moments
- normal teenage party behavior

Reject images that contain:
- explicit nudity
- sexual content
- vulgar exposure
- intimate acts inappropriate for minors
- violence
- weapons
- drugs
- obvious alcohol abuse
- bullying
- humiliation
- severe offensive gestures
- offensive visible text
- obscene behavior
- dangerous situations
- anything inappropriate for a family event with teenagers

If uncertain, do not approve automatically.
Return lower confidence and explain the concern.

Return ONLY valid JSON in this exact format:
{
  "approved": true,
  "confidence": 0.95,
  "reason": "Normal group selfie at the party",
  "flags": []
}`

      const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        instructions: systemPrompt,
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: 'Analyze this image for the quinceañera family gallery.' },
              { type: 'input_image', image_url: imageUrl, detail: 'low' },
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: moderationSchema.name,
            schema: moderationSchema.schema,
            strict: moderationSchema.strict,
          },
        },
        max_output_tokens: 250,
      })

      const rawText = response.output_text
      const parsed = rawText ? parseModerationResult(rawText) : null

      moderation = parsed
        ? parsed
        : {
            approved: true,
            confidence: 0.5,
            reason: 'OpenAI returned invalid JSON. Sent to manual review.',
            flags: ['invalid_json'],
          }
    }

    if (!moderation) {
      return NextResponse.json({ error: 'Moderation unavailable' }, { status: 500 })
    }

    const decisionStatus: 'approved' | 'pending' | 'rejected' =
      moderationEnabled
        ? moderation.approved
          ? moderation.confidence >= 0.85
            ? 'approved'
            : 'pending'
          : 'rejected'
        : 'pending'

    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

    const insertPayloadBase = {
      guest_name: guestName,
      image_url: imageUrl,
      public_id: publicId,
    }

    const insertPayloadWithModeration = {
      ...insertPayloadBase,
      status: decisionStatus,
      moderation_reason: moderation.reason,
      moderation_confidence: moderation.confidence,
      moderation_flags: moderation.flags,
    }

    let data:
      | {
          id: string
          guest_name: string
          image_url: string
          public_id: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
      | null = null
    let error: { message?: string } | null = null

    {
      const result = await supabase
        .from('photos')
        .insert(insertPayloadWithModeration)
        .select('id, guest_name, image_url, public_id, status, created_at')
        .single()

      data = result.data
      error = result.error ? { message: result.error.message } : null
    }

    if (error?.message && /moderation_|column/i.test(error.message)) {
      const fallback = await supabase
        .from('photos')
        .insert({
          ...insertPayloadBase,
          status: decisionStatus,
        })
        .select('id, guest_name, image_url, public_id, status, created_at')
        .single()

      data = fallback.data
      error = fallback.error ? { message: fallback.error.message } : null
    }

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? 'Error saving photo' }, { status: 500 })
    }

    if (decisionStatus === 'pending') {
      await notifyPendingPhoto({
        photoId: data.id,
        guestName: data.guest_name,
        imageUrl: data.image_url,
        moderationReason: moderation.reason,
        moderationConfidence: moderation.confidence,
        moderationFlags: moderation.flags,
      })
    }

    return NextResponse.json(
      {
        photo: data,
        moderation,
      } satisfies ApiResponse,
      { status: 200 },
    )
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
