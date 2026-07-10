export interface EventProfile {
  id: number
  title: string
  description: string
  date: string
  start_time: string
  end_time: string
  location_name: string
  location_address: string
  celebrant_name: string
  public_token: string
  status: string
  settings: Record<string, any>
  gallery_enabled: boolean
  playlist_enabled: boolean
  guest_messages_enabled: boolean
  memory_album_enabled: boolean
  photo_uploads_enabled: boolean
  public_gallery_enabled: boolean
  photo_ai_enabled: boolean
  message_ai_enabled: boolean
  auto_approve_photos: boolean
  auto_approve_messages: boolean
  created_at: string
  updated_at: string
}
