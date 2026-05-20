import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/supabase/types'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Missing Supabase env (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)' },
        { status: 500 },
      )
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase
      .from('song_requests')
      .select('*')
      .order('created_at', { ascending: true })

    if (error || !data) {
      return NextResponse.json({ error: 'Failed to fetch song requests' }, { status: 500 })
    }

    const weight = (status: Database['public']['Tables']['song_requests']['Row']['status']) => {
      if (status === 'playing') return 0
      if (status === 'pending') return 1
      if (status === 'played') return 2
      return 3
    }

    const sorted = [...data].sort((a, b) => {
      const w = weight(a.status) - weight(b.status)
      if (w !== 0) return w

      if (a.status === 'played' && b.status === 'played') {
        const aTime = a.played_at ?? a.created_at
        const bTime = b.played_at ?? b.created_at
        return bTime.localeCompare(aTime)
      }

      if (a.status === 'pending' && b.status === 'pending') {
        return a.created_at.localeCompare(b.created_at)
      }

      return a.created_at.localeCompare(b.created_at)
    })

    const nowPlaying = sorted.find((s) => s.status === 'playing') ?? null

    return NextResponse.json({ songRequests: sorted, nowPlaying })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
