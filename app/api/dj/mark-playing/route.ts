import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/supabase/types'

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

    const obj = body as Record<string, unknown>
    const songRequestId = typeof obj.songRequestId === 'string' ? obj.songRequestId.trim() : ''

    if (!songRequestId) {
      return NextResponse.json({ error: 'Invalid songRequestId' }, { status: 400 })
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

    const nowIso = new Date().toISOString()

    await supabase
      .from('song_requests')
      .update({ status: 'played', played_at: nowIso })
      .eq('status', 'playing')

    const { data: playing, error: updateError } = await supabase
      .from('song_requests')
      .update({ status: 'playing', played_at: null })
      .eq('id', songRequestId)
      .select('*')
      .single()

    if (updateError || !playing) {
      return NextResponse.json({ error: 'Failed to mark as playing' }, { status: 500 })
    }

    return NextResponse.json({ nowPlaying: playing })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
