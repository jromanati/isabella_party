export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      guests: {
        Row: {
          id: string
          full_name: string
          normalized_name: string
          phone: string | null
          email: string | null
          table_number: number | null
          companion_count: number
          rsvp_status: string
          rsvp_message: string | null
          confirmed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          normalized_name: string
          phone?: string | null
          email?: string | null
          table_number?: number | null
          companion_count?: number
          rsvp_status?: string
          rsvp_message?: string | null
          confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          normalized_name?: string
          phone?: string | null
          email?: string | null
          table_number?: number | null
          companion_count?: number
          rsvp_status?: string
          rsvp_message?: string | null
          confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          id: string
          guest_name: string
          image_url: string
          public_id: string | null
          status: 'pending' | 'approved' | 'rejected'
          moderation_reason: string | null
          moderation_confidence: number | null
          moderation_flags: Json
          created_at: string
        }
        Insert: {
          id?: string
          guest_name: string
          image_url: string
          public_id?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          moderation_reason?: string | null
          moderation_confidence?: number | null
          moderation_flags?: Json
          created_at?: string
        }
        Update: {
          id?: string
          guest_name?: string
          image_url?: string
          public_id?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          moderation_reason?: string | null
          moderation_confidence?: number | null
          moderation_flags?: Json
          created_at?: string
        }
        Relationships: []
      }
      gallery_settings: {
        Row: {
          id: number
          uploads_enabled: boolean
          updated_at: string
        }
        Insert: {
          id?: number
          uploads_enabled?: boolean
          updated_at?: string
        }
        Update: {
          id?: number
          uploads_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
