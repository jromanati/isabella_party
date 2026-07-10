import { apiClient, type ApiResponse } from '@/lib/api'
import type { Guest, RsvpRequest, RsvpResponse } from '@/types/guest'

export class GuestService {
  static async getGuests(): Promise<ApiResponse<Guest[]>> {
    return apiClient.get<Guest[]>('eventhub/guests-public/')
  }

  static async updateRsvp(guestId: number, payload: RsvpRequest): Promise<ApiResponse<RsvpResponse>> {
    return apiClient.post<RsvpResponse>(`eventhub/guests-public/${guestId}/rsvp/`, payload)
  }
}
