import { getSupabaseClient } from '@/lib/supabase/client'
import type { GalleryPhoto, PhotoUploadRequest, PhotoUploadResponse } from '@/types/gallery-photo'
import type { ApiResponse } from '@/lib/api'

export class SupabaseGalleryService {
  private static supabase = getSupabaseClient()

  /**
   * Subir foto a Cloudinary y registrar en Supabase
   */
  static async uploadPhoto(request: PhotoUploadRequest): Promise<ApiResponse<PhotoUploadResponse>> {
    try {
      // Step 1: Subir a Cloudinary
      const cloudinaryData = await this.uploadToCloudinary(request.file)
      
      if (!cloudinaryData.secure_url) {
        throw new Error('Error subiendo foto a Cloudinary')
      }

      // Step 2: Registrar en Supabase con tipado explícito
      const photoData: any = {
        cloudinary_public_id: cloudinaryData.public_id,
        cloudinary_secure_url: cloudinaryData.secure_url,
        thumbnail_url: cloudinaryData.secure_url.replace('/upload/', '/upload/c_fill,w_400,h_300/'),
        uploaded_by_guest: request.uploaded_by_guest || null,
        uploaded_by_companion: request.uploaded_by_companion || null,
        uploaded_by_name: request.uploaded_by_name || '',
        caption: request.caption || '',
        message: request.message || '',
        source: request.source || 'guest_upload',
        status: request.status || 'pending',
        is_public: true,
        is_featured: false,
        is_album_candidate: false,
        sort_order: 0,
        ai_status: 'pending',
        ai_moderation_result: 'pending',
        ai_moderation_reason: '',
        ai_analysis: {},
        ai_album_score: 0,
        ai_quality_score: 0,
        ai_emotion_score: 0,
        ai_fun_score: 0,
        taken_at: null,
        metadata: {},
        people: []
      }

      const { data, error } = await this.supabase
        .from('photos')
        .insert({
          guest_name: photoData.uploaded_by_name,
          image_url: photoData.cloudinary_secure_url,
          public_id: photoData.cloudinary_public_id,
          status: photoData.status,
        })
        .select()
        .single() as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error guardando foto en base de datos')
      }

      // Crear respuesta usando datos reales de la tabla 'photos'
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const thumbnailUrl = cloudName && data.public_id
        ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_400/${data.public_id}`
        : data.image_url

      const response: PhotoUploadResponse = {
        id: data.id,
        uploaded_by_guest: null,
        uploaded_by_companion: null,
        uploaded_by_name: data.guest_name,
        uploaded_by_guest_name: data.guest_name,
        uploaded_by_companion_name: null,
        cloudinary_public_id: data.public_id || '',
        cloudinary_secure_url: data.image_url,
        thumbnail_url: thumbnailUrl,
        width: 800,
        height: 600,
        file_size: 0,
        original_filename: 'photo.jpg',
        caption: '',
        message: '',
        source: 'guest_upload',
        status: data.status,
        approved_at: null,
        rejected_reason: '',
        is_public: true,
        is_featured: false,
        is_album_candidate: false,
        sort_order: 0,
        ai_status: 'pending',
        ai_moderation_result: 'pending',
        ai_moderation_reason: '',
        ai_analysis: {},
        ai_album_score: 0,
        ai_quality_score: 0,
        ai_emotion_score: 0,
        ai_fun_score: 0,
        taken_at: null,
        uploaded_at: data.created_at,
        metadata: {},
        people: []
      }

      return {
        success: true,
        data: response
      }

    } catch (error) {
      console.error('SupabaseGalleryService.uploadPhoto error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido subiendo foto'
      }
    }
  }

  /**
   * Obtener fotos desde Supabase
   */
  static async getPhotos(limit: number = 50, offset: number = 0): Promise<ApiResponse<GalleryPhoto[]>> {
    try {
      const { data, error } = await this.supabase
        .from('photos')
        .select('id, guest_name, image_url, public_id, status, created_at')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1) as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error cargando fotos')
      }

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const photos: GalleryPhoto[] = data.map((item: any) => {
        const thumbnailUrl = cloudName && item.public_id
          ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_400/${item.public_id}`
          : item.image_url

        return {
          id: item.id,
          uploaded_by_guest: null,
          uploaded_by_companion: null,
          uploaded_by_name: item.guest_name,
          uploaded_by_guest_name: item.guest_name,
          uploaded_by_companion_name: null,
          cloudinary_public_id: item.public_id || '',
          cloudinary_secure_url: item.image_url,
          thumbnail_url: thumbnailUrl,
          width: 800,
          height: 600,
          file_size: 0,
          original_filename: 'photo.jpg',
          caption: '',
          message: '',
          source: 'guest_upload',
          status: item.status,
          approved_at: null,
          rejected_reason: '',
          is_public: true,
          is_featured: false,
          is_album_candidate: false,
          sort_order: 0,
          ai_status: 'pending',
          ai_moderation_result: 'pending',
          ai_moderation_reason: '',
          ai_analysis: {},
          ai_album_score: 0,
          ai_quality_score: 0,
          ai_emotion_score: 0,
          ai_fun_score: 0,
          taken_at: null,
          uploaded_at: item.created_at,
          metadata: {},
          people: []
        }
      })

      return {
        success: true,
        data: photos
      }

    } catch (error) {
      console.error('SupabaseGalleryService.getPhotos error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando fotos'
      }
    }
  }

  /**
   * Obtener foto por ID desde Supabase
   */
  static async getPhotoById(id: string): Promise<ApiResponse<GalleryPhoto>> {
    try {
      const { data, error } = await this.supabase
        .from('photos')
        .select('id, guest_name, image_url, public_id, status, created_at')
        .eq('id', id)
        .single() as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Foto no encontrada')
      }

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const thumbnailUrl = cloudName && data.public_id
        ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_400/${data.public_id}`
        : data.image_url

      const photo: GalleryPhoto = {
        id: data.id,
        uploaded_by_guest: null,
        uploaded_by_companion: null,
        uploaded_by_name: data.guest_name,
        uploaded_by_guest_name: data.guest_name,
        uploaded_by_companion_name: null,
        cloudinary_public_id: data.public_id || '',
        cloudinary_secure_url: data.image_url,
        thumbnail_url: thumbnailUrl,
        width: 800,
        height: 600,
        file_size: 0,
        original_filename: 'photo.jpg',
        caption: '',
        message: '',
        source: 'guest_upload',
        status: data.status,
        approved_at: null,
        rejected_reason: '',
        is_public: true,
        is_featured: false,
        is_album_candidate: false,
        sort_order: 0,
        ai_status: 'pending',
        ai_moderation_result: 'pending',
        ai_moderation_reason: '',
        ai_analysis: {},
        ai_album_score: 0,
        ai_quality_score: 0,
        ai_emotion_score: 0,
        ai_fun_score: 0,
        taken_at: null,
        uploaded_at: data.created_at,
        metadata: {},
        people: []
      }

      return {
        success: true,
        data: photo
      }

    } catch (error) {
      console.error('SupabaseGalleryService.getPhotoById error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando foto'
      }
    }
  }

  /**
   * Subir archivo a Cloudinary directamente
   */
  private static async uploadToCloudinary(file: File): Promise<any> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      throw new Error('Configuración de Cloudinary no encontrada')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'isabella-party/gallery')

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `HTTP ${response.status}`)
    }

    return response.json()
  }
}
