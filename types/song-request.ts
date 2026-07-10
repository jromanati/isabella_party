export interface SongRequest {
  id: number
  guest: number | null
  companion: number | null
  guest_name: string
  source: 'guest' | 'companion' | 'anonymous' | 'admin'
  raw_song: string
  song_title: string
  artist_name: string
  album_name: string
  album_image_url: string
  preview_url: string
  external_url: string
  provider: 'spotify' | 'apple' | 'youtube' | 'manual'
  provider_track_id: string
  status: 'pending' | 'approved' | 'rejected' | 'playing' | 'played' | 'hidden'
  rejection_reason: string
  played_at: string | null
  sort_order: number
  is_featured: boolean
  notes: string
  ai_status: 'pending' | 'completed' | 'failed'
  ai_analysis: Record<string, any>
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface SongRequestCreate {
  guest?: number
  companion?: number
  guest_name?: string
  source?: 'guest' | 'companion' | 'anonymous' | 'admin'
  raw_song: string
  song_title: string
  artist_name: string
  album_name: string
  album_image_url: string
  preview_url: string
  external_url: string
  provider: 'spotify' | 'apple' | 'youtube' | 'manual'
  provider_track_id: string
  sort_order?: number
  is_featured?: boolean
  notes?: string
}

export interface SongRequestUpdate {
  song_title?: string
  artist_name?: string
  album_name?: string
  album_image_url?: string
  preview_url?: string
  external_url?: string
  sort_order?: number
  is_featured?: boolean
  notes?: string
}

export interface SongRequestReject {
  reason: string
}

export interface SongRequestFeature {
  featured: boolean
}

export interface SongRequestListParams {
  status?: SongRequest['status']
  source?: SongRequest['source']
  is_featured?: boolean
  search?: string
}

export interface PublicSongRequest {
  id: number
  status: SongRequest['status']
  is_featured: boolean
  sort_order: number
  raw_song: string
  song_title: string
  artist_name: string
  album_name: string
  album_image_url: string
  preview_url: string
  external_url: string
  provider: SongRequest['provider']
  provider_track_id: string
  notes: string
  guest_name: string
  created_at: string
}
