export interface Guest {
  id: number
  full_name: string
  email?: string
  phone?: string
  rsvp_status?: 'pending' | 'confirmed' | 'declined'
  rsvp_message?: string | null
  plus_one?: boolean
  plus_one_name?: string
  table_number?: number | null
  table?: number | null // Alias para compatibilidad con virtual-salon
  nickname?: string // Para virtual-salon
  notes?: string
}

export interface RsvpRequest {
  status: 'confirmed' | 'declined'
  plus_one?: boolean
  plus_one_name?: string
  notes?: string
}

export interface RsvpResponse {
  id: number
  status: string
  message: string
}
