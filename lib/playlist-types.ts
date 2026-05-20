export type ITunesSongResult = {
  title: string
  artist: string
  albumImageUrl: string | null
  previewUrl: string | null
}

export type SongRequestStatus = 'pending' | 'playing' | 'played' | 'rejected'

export type SongRequest = {
  id: string
  guest_name: string
  raw_song: string
  song_title: string | null
  artist_name: string | null
  album_image_url: string | null
  preview_url: string | null
  status: SongRequestStatus
  created_at: string
  played_at: string | null
}
