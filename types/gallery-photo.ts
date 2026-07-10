export interface GalleryPhotoPerson {
  id: number
  guest: number | null
  companion: number | null
  display_name: string
  confidence: number
  source: string
  metadata: Record<string, any>
  created_at: string
}

export interface GalleryPhoto {
  id: number
  uploaded_by_guest: number | null
  uploaded_by_companion: number | null
  uploaded_by_name: string
  uploaded_by_guest_name: string
  uploaded_by_companion_name: string | null
  cloudinary_public_id: string
  cloudinary_secure_url: string
  thumbnail_url: string
  width: number
  height: number
  file_size: number
  original_filename: string
  caption: string
  message: string
  source: string
  status: 'pending' | 'approved' | 'rejected'
  approved_at: string | null
  rejected_reason: string
  is_public: boolean
  is_featured: boolean
  is_album_candidate: boolean
  sort_order: number
  ai_status: 'pending' | 'completed' | 'failed'
  ai_moderation_result: 'pending' | 'approved' | 'rejected'
  ai_moderation_reason: string
  ai_analysis: Record<string, any>
  ai_album_score: number
  ai_quality_score: number
  ai_emotion_score: number
  ai_fun_score: number
  taken_at: string | null
  uploaded_at: string
  metadata: Record<string, any>
  people: GalleryPhotoPerson[]
}

export interface PhotoUploadRequest {
  file: File
  uploaded_by_guest?: number
  uploaded_by_companion?: number
  uploaded_by_name?: string
  caption?: string
  message?: string
  source?: string
  status?: 'pending' | 'approved' | 'rejected'
}

export interface PhotoUploadResponse {
  id: number
  uploaded_by_guest: number | null
  uploaded_by_companion: number | null
  uploaded_by_name: string
  uploaded_by_guest_name: string
  uploaded_by_companion_name: string | null
  cloudinary_public_id: string
  cloudinary_secure_url: string
  thumbnail_url: string
  width: number
  height: number
  file_size: number
  original_filename: string
  caption: string
  message: string
  source: string
  status: 'pending' | 'approved' | 'rejected'
  approved_at: string | null
  rejected_reason: string
  is_public: boolean
  is_featured: boolean
  is_album_candidate: boolean
  sort_order: number
  ai_status: 'pending' | 'completed' | 'failed'
  ai_moderation_result: 'pending' | 'approved' | 'rejected'
  ai_moderation_reason: string
  ai_analysis: Record<string, any>
  ai_album_score: number
  ai_quality_score: number
  ai_emotion_score: number
  ai_fun_score: number
  taken_at: string | null
  uploaded_at: string
  metadata: Record<string, any>
  people: GalleryPhotoPerson[]
}
