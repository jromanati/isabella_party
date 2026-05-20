type SpotifyTokenCache = {
  accessToken: string
  expiresAtMs: number
}

let tokenCache: SpotifyTokenCache | null = null

function requiredEnv(name: 'SPOTIFY_CLIENT_ID' | 'SPOTIFY_CLIENT_SECRET') {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

async function getSpotifyAccessToken(): Promise<string> {
  const now = Date.now()
  if (tokenCache && tokenCache.expiresAtMs > now + 5_000) {
    return tokenCache.accessToken
  }

  const clientId = requiredEnv('SPOTIFY_CLIENT_ID')
  const clientSecret = requiredEnv('SPOTIFY_CLIENT_SECRET')

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Spotify token request failed: ${res.status}`)
  }

  const data: unknown = await res.json()
  if (!data || typeof data !== 'object') throw new Error('Spotify token response invalid')

  const obj = data as Record<string, unknown>
  const accessToken = typeof obj.access_token === 'string' ? obj.access_token : ''
  const expiresIn = typeof obj.expires_in === 'number' ? obj.expires_in : 0

  if (!accessToken || !expiresIn) {
    throw new Error('Spotify token response missing fields')
  }

  tokenCache = {
    accessToken,
    expiresAtMs: Date.now() + expiresIn * 1000,
  }

  return accessToken
}

export type SpotifyTrackResult = {
  spotifyTrackId: string
  title: string
  artist: string
  albumImageUrl: string | null
  spotifyUrl: string | null
}

function normalizeSpotifyTrack(item: Record<string, unknown>): SpotifyTrackResult | null {
  const id = typeof item.id === 'string' ? item.id : ''
  const name = typeof item.name === 'string' ? item.name : ''

  const artistsRaw = item.artists
  const artists = Array.isArray(artistsRaw)
    ? artistsRaw
        .map((a) => (a && typeof a === 'object' ? (a as Record<string, unknown>).name : null))
        .filter((n): n is string => typeof n === 'string' && n.trim().length > 0)
    : []

  const artist = artists[0] ?? ''

  const externalUrls = item.external_urls
  const spotifyUrl = externalUrls && typeof externalUrls === 'object'
    ? (externalUrls as Record<string, unknown>).spotify
    : null

  const spotifyUrlStr = typeof spotifyUrl === 'string' ? spotifyUrl : null

  const album = item.album
  const imagesRaw = album && typeof album === 'object'
    ? (album as Record<string, unknown>).images
    : null

  const images = Array.isArray(imagesRaw) ? imagesRaw : []
  const firstImage = images[0]
  const albumImageUrl = firstImage && typeof firstImage === 'object'
    ? (firstImage as Record<string, unknown>).url
    : null

  const albumImageUrlStr = typeof albumImageUrl === 'string' ? albumImageUrl : null

  if (!id || !name || !artist) return null

  return {
    spotifyTrackId: id,
    title: name,
    artist,
    albumImageUrl: albumImageUrlStr,
    spotifyUrl: spotifyUrlStr,
  }
}

export async function searchSpotifyTrack(query: string): Promise<SpotifyTrackResult[]> {
  try {
    const q = query.trim()
    if (!q) return []

    const accessToken = await getSpotifyAccessToken()

    const url = new URL('https://api.spotify.com/v1/search')
    url.searchParams.set('q', q)
    url.searchParams.set('type', 'track')
    url.searchParams.set('limit', '5')

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return []
    }

    const data: unknown = await res.json()
    if (!data || typeof data !== 'object') return []

    const tracksObj = (data as Record<string, unknown>).tracks
    if (!tracksObj || typeof tracksObj !== 'object') return []

    const items = (tracksObj as Record<string, unknown>).items
    if (!Array.isArray(items)) return []

    return items
      .filter((t): t is Record<string, unknown> => !!t && typeof t === 'object')
      .map(normalizeSpotifyTrack)
      .filter((t): t is SpotifyTrackResult => t != null)
  } catch {
    return []
  }
}
