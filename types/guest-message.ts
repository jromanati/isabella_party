export interface GuestMessage {
  id: number
  guest: number | null
  companion: number | null
  guest_name: string | null
  companion_name: string | null
  author_name: string
  author_type: 'guest' | 'companion' | 'anonymous' | 'admin'
  recipient_type: 'celebrant' | 'couple' | 'family' | 'friends' | 'all'
  title: string
  message: string
  message_type: 'text'
  status: 'pending' | 'approved' | 'rejected' | 'hidden'
  is_public: boolean
  is_featured: boolean
  used_in_album: boolean
  rejection_reason: string
  approved_at: string | null
  approved_by: number | null
  media_urls: string[]
  tags: string[]
  ai_status: 'pending' | 'processing' | 'completed' | 'failed'
  ai_moderation_result: 'pending' | 'approved' | 'rejected' | 'flagged'
  ai_moderation_reason: string
  ai_analysis: Record<string, any>
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface GuestMessageCreate {
  guest?: number
  companion?: number
  recipient_type: GuestMessage['recipient_type']
  message_type: GuestMessage['message_type']
  author_name?: string
  author_type?: GuestMessage['author_type']
  title: string
  message: string
  is_public?: boolean
  is_featured?: boolean
  used_in_album?: boolean
  media_urls?: string[]
  tags?: string[]
  metadata?: Record<string, any>
}

export interface GuestMessageUpdate {
  title?: string
  message?: string
  is_public?: boolean
  is_featured?: boolean
  used_in_album?: boolean
  media_urls?: string[]
  tags?: string[]
  metadata?: Record<string, any>
}

export interface GuestMessageListParams {
  status?: GuestMessage['status']
  recipient_type?: GuestMessage['recipient_type']
  message_type?: GuestMessage['message_type']
  is_public?: boolean
  is_featured?: boolean
  search?: string
}

export interface PublicGuestMessage {
  id: number
  guest_name: string | null
  companion_name: string | null
  author_name: string
  author_type: GuestMessage['author_type']
  recipient_type: GuestMessage['recipient_type']
  title: string
  message: string
  message_type: GuestMessage['message_type']
  is_featured: boolean
  created_at: string
}
