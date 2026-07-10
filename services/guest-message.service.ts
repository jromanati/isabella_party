import { apiClient, type ApiResponse } from '@/lib/api'
import type { 
  GuestMessage, 
  GuestMessageCreate, 
  GuestMessageUpdate, 
  GuestMessageListParams,
  PublicGuestMessage 
} from '@/types/guest-message'

export class GuestMessageService {
  // CRUD operations
  static async createGuestMessage(message: GuestMessageCreate): Promise<ApiResponse<GuestMessage>> {
    return apiClient.post<GuestMessage>('eventhub/guest-messages/', message)
  }

  static async getGuestMessages(params?: GuestMessageListParams): Promise<ApiResponse<GuestMessage[]>> {
    const searchParams = new URLSearchParams()
    
    if (params?.status) searchParams.append('status', params.status)
    if (params?.recipient_type) searchParams.append('recipient_type', params.recipient_type)
    if (params?.message_type) searchParams.append('message_type', params.message_type)
    if (params?.is_public !== undefined) searchParams.append('is_public', params.is_public.toString())
    if (params?.is_featured !== undefined) searchParams.append('is_featured', params.is_featured.toString())
    if (params?.search) searchParams.append('search', params.search)

    const query = searchParams.toString()
    const endpoint = `eventhub/guest-messages/${query ? `?${query}` : ''}`
    
    return apiClient.get<GuestMessage[]>(endpoint)
  }

  static async getGuestMessageById(id: number): Promise<ApiResponse<GuestMessage>> {
    return apiClient.get<GuestMessage>(`eventhub/guest-messages/${id}/`)
  }

  static async updateGuestMessage(id: number, message: GuestMessageUpdate): Promise<ApiResponse<GuestMessage>> {
    return apiClient.put<GuestMessage>(`eventhub/guest-messages/${id}/`, message)
  }

  static async deleteGuestMessage(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`eventhub/guest-messages/${id}/`)
  }

  // Public endpoints (if needed)
  static async getPublicMessages(params?: Pick<GuestMessageListParams, 'search' | 'is_featured'>): Promise<ApiResponse<PublicGuestMessage[]>> {
    const searchParams = new URLSearchParams()
    
    if (params?.search) searchParams.append('search', params.search)
    if (params?.is_featured !== undefined) searchParams.append('is_featured', params.is_featured.toString())

    const query = searchParams.toString()
    const endpoint = `eventhub/guest-messages/public/${query ? `?${query}` : ''}`
    
    return apiClient.get<PublicGuestMessage[]>(endpoint)
  }

  // Helper methods for common operations
  static async getPendingMessages(): Promise<ApiResponse<GuestMessage[]>> {
    return this.getGuestMessages({ status: 'pending' })
  }

  static async getApprovedPublicMessages(): Promise<ApiResponse<GuestMessage[]>> {
    return this.getGuestMessages({ status: 'approved', is_public: true })
  }

  static async getFeaturedMessages(): Promise<ApiResponse<GuestMessage[]>> {
    return this.getGuestMessages({ is_featured: true })
  }

  static async getMessagesByRecipient(recipientType: GuestMessage['recipient_type']): Promise<ApiResponse<GuestMessage[]>> {
    return this.getGuestMessages({ recipient_type: recipientType })
  }

  static async getMessagesByType(messageType: GuestMessage['message_type']): Promise<ApiResponse<GuestMessage[]>> {
    return this.getGuestMessages({ message_type: messageType })
  }
}
