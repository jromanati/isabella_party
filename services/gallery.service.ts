import { apiClient, type ApiResponse } from '@/lib/api'
import type { GalleryPhoto, PhotoUploadRequest, PhotoUploadResponse } from '@/types/gallery-photo'

export class GalleryService {
  static async uploadPhoto(request: PhotoUploadRequest): Promise<ApiResponse<PhotoUploadResponse>> {
    const formData = new FormData()
    
    // Add file (required) 
    formData.append('file', request.file)
    
    // Add optional fields
    if (request.uploaded_by_guest) {
      formData.append('uploaded_by_guest', request.uploaded_by_guest.toString())
    }
    if (request.uploaded_by_companion) {
      formData.append('uploaded_by_companion', request.uploaded_by_companion.toString())
    }
    if (request.uploaded_by_name) {
      formData.append('uploaded_by_name', request.uploaded_by_name)
    }
    if (request.caption) {
      formData.append('caption', request.caption)
    }
    if (request.message) {
      formData.append('message', request.message)
    }
    if (request.source) {
      formData.append('source', request.source)
    } else {
      formData.append('source', 'guest_upload')
    }
    if (request.status) {
      formData.append('status', request.status)
    }

    // Necesitamos añadir un método para FormData en apiClient o usar fetch directamente
    const response = await fetch(`${apiClient['baseUrl']}eventhub/gallery-photos/upload/`, {
      method: 'POST',
      body: formData,
      headers: {
        // No incluir Content-Type, el browser lo establece automáticamente para FormData
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error || errorData.detail || `HTTP ${response.status}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  }

  static async getPhotos(): Promise<ApiResponse<GalleryPhoto[]>> {
    return apiClient.get<GalleryPhoto[]>('eventhub/gallery-photos/')
  }

  static async getPhotoById(id: number): Promise<ApiResponse<GalleryPhoto>> {
    return apiClient.get<GalleryPhoto>(`eventhub/gallery-photos/${id}/`)
  }
}
