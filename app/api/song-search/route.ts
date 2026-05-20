import { NextResponse } from 'next/server'

import { searchSpotifyTrack } from '@/lib/spotify'

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    const obj = body as Record<string, unknown>
    const query = typeof obj.query === 'string' ? obj.query.trim() : ''

    if (!query) {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
    }

    const results = await searchSpotifyTrack(query)
    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ results: [] })
  }
}
