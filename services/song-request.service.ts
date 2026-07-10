import { apiClient, type ApiResponse } from '@/lib/api'
import type { 
  SongRequest, 
  SongRequestCreate, 
  SongRequestUpdate, 
  SongRequestReject, 
  SongRequestFeature, 
  SongRequestListParams,
  PublicSongRequest 
} from '@/types/song-request'

export class SongRequestService {
  // CRUD operations
  static async createSongRequest(request: SongRequestCreate): Promise<ApiResponse<SongRequest>> {
    return apiClient.post<SongRequest>('eventhub/song-requests/', request)
  }

  static async getSongRequests(params?: SongRequestListParams): Promise<ApiResponse<SongRequest[]>> {
    const searchParams = new URLSearchParams()
    
    if (params?.status) searchParams.append('status', params.status)
    if (params?.source) searchParams.append('source', params.source)
    if (params?.is_featured !== undefined) searchParams.append('is_featured', params.is_featured.toString())
    if (params?.search) searchParams.append('search', params.search)

    const query = searchParams.toString()
    const endpoint = `eventhub/song-requests/${query ? `?${query}` : ''}`
    
    return apiClient.get<SongRequest[]>(endpoint)
  }

  static async getSongRequestById(id: number): Promise<ApiResponse<SongRequest>> {
    return apiClient.get<SongRequest>(`eventhub/song-requests/${id}/`)
  }

  static async updateSongRequest(id: number, request: SongRequestUpdate): Promise<ApiResponse<SongRequest>> {
    return apiClient.put<SongRequest>(`eventhub/song-requests/${id}/`, request)
  }

  static async deleteSongRequest(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`eventhub/song-requests/${id}/`)
  }

  // Status actions
  static async approveSongRequest(id: number): Promise<ApiResponse<SongRequest>> {
    return apiClient.post<SongRequest>(`eventhub/song-requests/${id}/approve/`)
  }

  static async rejectSongRequest(id: number, request: SongRequestReject): Promise<ApiResponse<SongRequest>> {
    return apiClient.post<SongRequest>(`eventhub/song-requests/${id}/reject/`, request)
  }

  static async markAsPlaying(id: number): Promise<ApiResponse<SongRequest>> {
    return apiClient.post<SongRequest>(`eventhub/song-requests/${id}/playing/`)
  }

  static async markAsPlayed(id: number): Promise<ApiResponse<SongRequest>> {
    return apiClient.post<SongRequest>(`eventhub/song-requests/${id}/played/`)
  }

  static async hideSongRequest(id: number): Promise<ApiResponse<SongRequest>> {
    return apiClient.post<SongRequest>(`eventhub/song-requests/${id}/hide/`)
  }

  // Featured actions
  static async featureSongRequest(id: number, request: SongRequestFeature): Promise<ApiResponse<SongRequest>> {
    return apiClient.post<SongRequest>(`eventhub/song-requests/${id}/feature/`, request)
  }

  // Public endpoints
  static async getPublicPlaylist(): Promise<ApiResponse<PublicSongRequest[]>> {
    return apiClient.get<PublicSongRequest[]>('eventhub/song-requests/public/')
  }

  static async getNowPlaying(): Promise<ApiResponse<SongRequest | null>> {
    return apiClient.get<SongRequest | null>('eventhub/song-requests/now-playing/')
  }
}
