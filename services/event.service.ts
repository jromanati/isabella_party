import { apiClient, type ApiResponse } from '@/lib/api'
import type { EventProfile } from '@/types/event'

export class EventService {
  static async getEventProfile(): Promise<ApiResponse<EventProfile>> {
    return apiClient.get<EventProfile>('eventhub/event-profile/')
  }
}
