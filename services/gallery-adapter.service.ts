import { GalleryService } from './gallery.service'
import { SupabaseGalleryService } from './supabase-gallery.service'
import type { GalleryPhoto, PhotoUploadRequest, PhotoUploadResponse } from '@/types/gallery-photo'
import type { ApiResponse } from '@/lib/api'
import { getSupabaseClient } from '@/lib/supabase/client'

/**
 * Configuración del sistema
 */
const USE_BACKEND_API = process.env.NEXT_PUBLIC_USE_BACKEND_API === 'true'
const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true'

/**
 * Servicio adaptador que elige dinámicamente entre Backend API y Supabase
 * según la configuración de variables de entorno
 */
export class GalleryAdapter {
  /**
   * Determina qué servicio usar basado en la configuración
   */
  private static getService() {
    if (USE_BACKEND_API) {
      console.log('🔧 GalleryAdapter: Usando Backend API')
      return GalleryService
    } else if (USE_SUPABASE) {
      console.log('🔧 GalleryAdapter: Usando Supabase')
      return SupabaseGalleryService
    } else {
      // Por defecto usar Backend API
      console.log('🔧 GalleryAdapter: Usando Backend API (default)')
      return GalleryService
    }
  }

  /**
   * Subir foto usando el servicio configurado
   */
  static async uploadPhoto(request: PhotoUploadRequest): Promise<ApiResponse<PhotoUploadResponse>> {
    const service = this.getService()
    
    try {
      console.log('📤 GalleryAdapter: Iniciando subida de foto')
      const result = await service.uploadPhoto(request)
      
      if (result.success) {
        console.log('✅ GalleryAdapter: Foto subida exitosamente')
      } else {
        console.error('❌ GalleryAdapter: Error subiendo foto:', result.error)
        
        // Si el servicio principal falla y estamos usando API, intentar fallback a Supabase
        if (USE_BACKEND_API && !USE_SUPABASE) {
          console.log('🔄 GalleryAdapter: Intentando fallback a Supabase')
          try {
            const fallbackResult = await SupabaseGalleryService.uploadPhoto(request)
            if (fallbackResult.success) {
              console.log('✅ GalleryAdapter: Fallback a Supabase exitoso')
              return fallbackResult
            }
          } catch (fallbackError) {
            console.error('❌ GalleryAdapter: Fallback a Supabase falló:', fallbackError)
          }
        }
      }
      
      return result
    } catch (error) {
      console.error('🚨 GalleryAdapter: Error crítico en uploadPhoto:', error)
      
      // Intentar fallback si el error es del servicio principal
      if (USE_BACKEND_API && !USE_SUPABASE) {
        console.log('🔄 GalleryAdapter: Intentando fallback a Supabase (error catch)')
        try {
          const fallbackResult = await SupabaseGalleryService.uploadPhoto(request)
          if (fallbackResult.success) {
            console.log('✅ GalleryAdapter: Fallback a Supabase exitoso (catch)')
            return fallbackResult
          }
        } catch (fallbackError) {
          console.error('❌ GalleryAdapter: Fallback a Supabase falló (catch):', fallbackError)
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido subiendo foto'
      }
    }
  }

  /**
   * Obtener fotos usando el servicio configurado
   */
  static async getPhotos(limit?: number, offset?: number): Promise<ApiResponse<GalleryPhoto[]>> {
    const service = this.getService()
    
    try {
      console.log('📥 GalleryAdapter: Cargando fotos')
      const result = await service.getPhotos(limit, offset)
      
      if (result.success) {
        console.log(`✅ GalleryAdapter: ${result.data?.length || 0} fotos cargadas`)
      } else {
        console.error('❌ GalleryAdapter: Error cargando fotos:', result.error)
        
        // Si el servicio principal falla y estamos usando API, intentar fallback a Supabase
        if (USE_BACKEND_API && !USE_SUPABASE) {
          console.log('🔄 GalleryAdapter: Intentando fallback a Supabase para getPhotos')
          try {
            const fallbackResult = await SupabaseGalleryService.getPhotos(limit, offset)
            if (fallbackResult.success) {
              console.log('✅ GalleryAdapter: Fallback a Supabase exitoso para getPhotos')
              return fallbackResult
            }
          } catch (fallbackError) {
            console.error('❌ GalleryAdapter: Fallback a Supabase falló para getPhotos:', fallbackError)
          }
        }
      }
      
      return result
    } catch (error) {
      console.error('🚨 GalleryAdapter: Error crítico en getPhotos:', error)
      
      // Intentar fallback si el error es del servicio principal
      if (USE_BACKEND_API && !USE_SUPABASE) {
        console.log('🔄 GalleryAdapter: Intentando fallback a Supabase (error catch) para getPhotos')
        try {
          const fallbackResult = await SupabaseGalleryService.getPhotos(limit, offset)
          if (fallbackResult.success) {
            console.log('✅ GalleryAdapter: Fallback a Supabase exitoso (catch) para getPhotos')
            return fallbackResult
          }
        } catch (fallbackError) {
          console.error('❌ GalleryAdapter: Fallback a Supabase falló (catch) para getPhotos:', fallbackError)
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando fotos'
      }
    }
  }

  /**
   * Actualizar status de foto usando el servicio configurado
   */
  static async updatePhotoStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<ApiResponse<GalleryPhoto>> {
    const service = this.getService()
    
    try {
      console.log(`📝 GalleryAdapter: Actualizando status de foto ID: ${id} a ${status}`)
      
      if (service === 'api') {
        // Usar Backend API - GalleryService debería tener un método de actualización
        // Por ahora, implementamos solo para Supabase
        console.log('⚠️ GalleryAdapter: Actualización vía API no implementada, usando fallback a Supabase')
        return await this.updatePhotoStatusInSupabase(id, status)
      } else {
        // Usar Supabase directamente
        return await this.updatePhotoStatusInSupabase(id, status)
      }
      
    } catch (error) {
      console.error('🚨 GalleryAdapter: Error crítico en updatePhotoStatus:', error)
      
      // Intentar fallback si el error es del servicio principal
      if (service === 'api' && !USE_SUPABASE) {
        console.log('🔄 GalleryAdapter: Intentando fallback a Supabase (error catch)')
        try {
          const fallbackResult = await this.updatePhotoStatusInSupabase(id, status)
          if (fallbackResult.success) {
            console.log('✅ GalleryAdapter: Fallback a Supabase exitoso (catch)')
            return fallbackResult
          }
        } catch (fallbackError) {
          console.error('❌ GalleryAdapter: Fallback a Supabase falló (catch):', fallbackError)
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido actualizando status de foto'
      }
    }
  }

  /**
   * Obtener foto por ID usando el servicio configurado
   */
  static async getPhotoById(id: string): Promise<ApiResponse<GalleryPhoto>> {
    const service = this.getService()
    
    try {
      console.log(`🔍 GalleryAdapter: Buscando foto ID: ${id}`)
      const result = await service.getPhotoById(id)
      
      if (result.success) {
        console.log('✅ GalleryAdapter: Foto encontrada')
      } else {
        console.error('❌ GalleryAdapter: Error buscando foto:', result.error)
        
        // Si el servicio principal falla y estamos usando API, intentar fallback a Supabase
        if (USE_BACKEND_API && !USE_SUPABASE) {
          console.log('🔄 GalleryAdapter: Intentando fallback a Supabase para getPhotoById')
          try {
            const fallbackResult = await SupabaseGalleryService.getPhotoById(id)
            if (fallbackResult.success) {
              console.log('✅ GalleryAdapter: Fallback a Supabase exitoso para getPhotoById')
              return fallbackResult
            }
          } catch (fallbackError) {
            console.error('❌ GalleryAdapter: Fallback a Supabase falló para getPhotoById:', fallbackError)
          }
        }
      }
      
      return result
    } catch (error) {
      console.error('🚨 GalleryAdapter: Error crítico en getPhotoById:', error)
      
      // Intentar fallback si el error es del servicio principal
      if (USE_BACKEND_API && !USE_SUPABASE) {
        console.log('🔄 GalleryAdapter: Intentando fallback a Supabase (error catch) para getPhotoById')
        try {
          const fallbackResult = await SupabaseGalleryService.getPhotoById(id)
          if (fallbackResult.success) {
            console.log('✅ GalleryAdapter: Fallback a Supabase exitoso (catch) para getPhotoById')
            return fallbackResult
          }
        } catch (fallbackError) {
          console.error('❌ GalleryAdapter: Fallback a Supabase falló (catch) para getPhotoById:', fallbackError)
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido buscando foto'
      }
    }
  }

  /**
   * Obtener configuración actual
   */
  static getConfig() {
    return {
      useBackendAPI: USE_BACKEND_API,
      useSupabase: USE_SUPABASE,
      currentService: USE_BACKEND_API ? 'Backend API' : USE_SUPABASE ? 'Supabase' : 'Backend API (default)'
    }
  }

  /**
   * Verificar disponibilidad de servicios
   */
  static async checkServices(): Promise<{ backend: boolean; supabase: boolean }> {
    const results = { backend: false, supabase: false }
    
    // Probar Backend API
    try {
      const backendTest = await GalleryService.getPhotos(1, 0)
      results.backend = backendTest.success
    } catch (error) {
      console.error('Backend API check failed:', error)
      results.backend = false
    }
    
    // Probar Supabase
    try {
      const supabaseTest = await SupabaseGalleryService.getPhotos(1, 0)
      results.supabase = supabaseTest.success
    } catch (error) {
      console.error('Supabase check failed:', error)
      results.supabase = false
    }
    
    console.log('🔍 GalleryAdapter: Service availability:', results)
    return results
  }

  /**
   * Método legacy para compatibilidad con el sistema original
   * Usa el formato antiguo: guestName (string) en lugar de Guest object
   */
  static async uploadPhotoLegacy(
    guestName: string,
    file: File,
    initialStatus?: 'approved' | 'pending'
  ): Promise<{ status: 'approved' | 'pending' | 'rejected' }> {
    try {
      console.log('📤 GalleryAdapter: Subida legacy con nombre:', guestName)
      
      // Si estamos en modo backend, usar el nuevo sistema
      if (USE_BACKEND_API) {
        // Crear un Guest object simulado para compatibilidad
        const mockGuest = {
          id: 0, // ID temporal
          full_name: guestName,
        }
        
        const uploadRequest = {
          file,
          uploaded_by_guest: 0,
          uploaded_by_name: guestName,
          source: 'guest_upload',
          status: initialStatus || 'pending',
        }
        
        const response = await GalleryAdapter.uploadPhoto(uploadRequest)
        if (!response.success) {
          throw new Error(response.error || 'Error subiendo foto')
        }
        
        return { status: response.data.status }
      }
      
      // Si estamos en modo Supabase, usar el flujo original
      return await this.uploadPhotoOriginalSupabase(guestName, file, initialStatus)
      
    } catch (error) {
      console.error('🚨 GalleryAdapter: Error en uploadPhotoLegacy:', error)
      throw error
    }
  }

  /**
   * Flujo original de subida a Supabase (compatible con el sistema antiguo)
   */
  private static async uploadPhotoOriginalSupabase(
    guestName: string,
    file: File,
    initialStatus?: 'approved' | 'pending'
  ): Promise<{ status: 'approved' | 'pending' | 'rejected' }> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      throw new Error('Faltan variables de Cloudinary')
    }

    // Step 1: Subir a Cloudinary
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    const body = await res.json().catch(() => null)
    if (!res.ok) {
      throw new Error('Error subiendo a Cloudinary')
    }

    const { secure_url, public_id } = body as {
      secure_url?: string
      public_id?: string
    }

    if (!secure_url || !public_id) {
      throw new Error('Cloudinary no devolvió datos válidos')
    }

    // Step 2: Analizar con OpenAI si no se especifica status
    let finalStatus = initialStatus || 'pending'
    if (!initialStatus) {
      try {
        const analysis = await import('@/services/openai.service').then(m => m.OpenAIService.analyzePhoto(file))
        finalStatus = analysis.isValid ? 'approved' : 'pending'
      } catch (error) {
        console.warn('⚠️ No se pudo analizar con OpenAI, usando pending')
        finalStatus = 'pending'
      }
    }

    // Step 3: Guardar en tabla original 'photos' de Supabase
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('photos')
      .insert({
        guest_name: guestName,
        image_url: secure_url,
        public_id: public_id,
        status: finalStatus,
      })
      .select()
      .single() as any

    if (error) {
      console.error('Error guardando en Supabase:', error)
      throw new Error('Error guardando foto en base de datos')
    }

    console.log('✅ GalleryAdapter: Subida legacy completada')
    return { status: finalStatus }
  }

  /**
   * Cargar fotos usando el formato legacy (tabla 'photos' original)
   */
  static async getPhotosLegacy(): Promise<ApiResponse<any[]>> {
    try {
      console.log('📥 GalleryAdapter: Cargando fotos legacy')
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase
        .from('photos')
        .select('id, guest_name, image_url, public_id, status, created_at')
        .order('created_at', { ascending: false }) as any

      if (error) {
        console.error('Error cargando fotos legacy:', error)
        throw new Error(error.message || 'Error cargando fotos')
      }

      const mapped = (data || []).map((r: any) => {
        const thumbnailUrl = cloudName && r.public_id
          ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_400/${r.public_id}`
          : r.image_url

        return {
          id: r.id,
          guestName: r.guest_name,
          url: r.image_url,
          thumbnailUrl,
          status: r.status,
          uploadedAt: r.created_at,
        }
      })

      return {
        success: true,
        data: mapped
      }

    } catch (error) {
      console.error('🚨 GalleryAdapter: Error en getPhotosLegacy:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando fotos'
      }
    }
  }

  /**
   * Actualizar status de foto en Supabase
   */
  private static async updatePhotoStatusInSupabase(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<ApiResponse<GalleryPhoto>> {
    try {
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase
        .from('photos')
        .update({ status })
        .eq('id', id)
        .select()
        .single() as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error actualizando status de foto en Supabase')
      }

      // Mapear a formato GalleryPhoto
      const photo: GalleryPhoto = {
        id: data.id,
        uploaded_by_guest: null,
        uploaded_by_companion: null,
        uploaded_by_name: data.guest_name || '',
        uploaded_by_guest_name: data.guest_name || '',
        uploaded_by_companion_name: null,
        cloudinary_public_id: data.public_id || '',
        cloudinary_secure_url: data.image_url || '',
        thumbnail_url: data.image_url || '',
        width: 800, // Valor por defecto
        height: 600, // Valor por defecto
        file_size: 0, // Valor por defecto
        original_filename: '',
        caption: '',
        message: '',
        source: 'upload',
        status: data.status || 'pending',
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
        uploaded_at: data.created_at || new Date().toISOString(),
        metadata: {},
        people: []
      }

      return {
        success: true,
        data: photo
      }

    } catch (error) {
      console.error('GalleryAdapter.updatePhotoStatusInSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido actualizando status de foto en Supabase'
      }
    }
  }
}
