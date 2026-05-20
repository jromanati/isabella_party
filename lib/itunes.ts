export type ITunesSongResult = {
  title: string
  artist: string
  albumImageUrl: string | null
  previewUrl: string | null
}

function upgradeArtwork(url: string): string {
  return url.replace(/100x100(bb\.[a-zA-Z0-9]+)$/, '600x600$1')
}

export async function searchITunesSongs(query: string): Promise<ITunesSongResult[]> {
  try {
    const term = query.trim()
    if (!term) return []

    const url = new URL('https://itunes.apple.com/search')
    url.searchParams.set('term', term)
    url.searchParams.set('entity', 'song')
    url.searchParams.set('limit', '5')

    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (!res.ok) return []

    const data: unknown = await res.json()
    if (!data || typeof data !== 'object') return []

    const resultsRaw = (data as Record<string, unknown>).results
    if (!Array.isArray(resultsRaw)) return []

    const normalized: ITunesSongResult[] = []

    for (const item of resultsRaw) {
      if (!item || typeof item !== 'object') continue
      const obj = item as Record<string, unknown>

      const title = typeof obj.trackName === 'string' ? obj.trackName.trim() : ''
      const artist = typeof obj.artistName === 'string' ? obj.artistName.trim() : ''
      const artworkUrl100 = typeof obj.artworkUrl100 === 'string' ? obj.artworkUrl100.trim() : ''
      const previewUrl = typeof obj.previewUrl === 'string' ? obj.previewUrl.trim() : ''

      if (!title || !artist) continue

      normalized.push({
        title,
        artist,
        albumImageUrl: artworkUrl100 ? upgradeArtwork(artworkUrl100) : null,
        previewUrl: previewUrl || null,
      })
    }

    return normalized
  } catch {
    return []
  }
}
