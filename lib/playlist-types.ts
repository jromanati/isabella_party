export type SpotifyTrackResult = {
  spotifyTrackId: string
  title: string
  artist: string
  albumImageUrl: string | null
  spotifyUrl: string | null
}

export type SongRequestStatus = 'pending' | 'playing' | 'played' | 'rejected'

export type SongRequest = {
  id: string
  guest_name: string
  raw_song: string
  song_title: string | null
  artist_name: string | null
  album_image_url: string | null
  spotify_track_id: string | null
  spotify_url: string | null
  status: SongRequestStatus
  created_at: string
  played_at: string | null
}
