import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/supabase/types'
import type { ITunesSongResult } from '@/lib/itunes'

type RequestBody = {
  guestName: string
  rawSong: string
  selectedTrack?: ITunesSongResult
}

function isITunesSongResult(value: unknown): value is ITunesSongResult {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>

  return (
    typeof obj.title === 'string' &&
    typeof obj.artist === 'string' &&
    (obj.albumImageUrl == null || typeof obj.albumImageUrl === 'string') &&
    (obj.previewUrl == null || typeof obj.previewUrl === 'string')
  )
}

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Missing Supabase env (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)' },
        { status: 500 },
      )
    }

    const body: unknown = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    const obj = body as Partial<RequestBody> & Record<string, unknown>
    const guestName = typeof obj.guestName === 'string' ? obj.guestName.trim() : ''
    const rawSong = typeof obj.rawSong === 'string' ? obj.rawSong.trim() : ''

    if (!guestName) {
      return NextResponse.json({ error: 'Invalid guestName' }, { status: 400 })
    }

    if (!rawSong) {
      return NextResponse.json({ error: 'Invalid rawSong' }, { status: 400 })
    }

    const selectedTrack = isITunesSongResult(obj.selectedTrack) ? obj.selectedTrack : null

    const insertPayload: Database['public']['Tables']['song_requests']['Insert'] = selectedTrack
      ? {
          guest_name: guestName,
          raw_song: rawSong,
          song_title: selectedTrack.title,
          artist_name: selectedTrack.artist,
          album_image_url: selectedTrack.albumImageUrl,
          preview_url: selectedTrack.previewUrl,
          status: 'pending',
        }
      : {
          guest_name: guestName,
          raw_song: rawSong,
          song_title: rawSong,
          artist_name: null,
          album_image_url: null,
          preview_url: null,
          status: 'pending',
        }

    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase
      .from('song_requests')
      .insert(insertPayload)
      .select('*')
      .single()

    if (error || !data) {
      const errorObj = error as unknown as { code?: string; message?: string; details?: string; hint?: string } | null
      return NextResponse.json(
        {
          error: 'Failed to create song request',
          supabase: {
            code: errorObj?.code ?? null,
            message: errorObj?.message ?? null,
            details: errorObj?.details ?? null,
            hint: errorObj?.hint ?? null,
          },
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ songRequest: data })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
