import { GuestService } from './guest.service'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { Guest, RsvpRequest, RsvpResponse } from '@/types/guest'
import type { ApiResponse } from '@/lib/api'

/**
 * Servicio adaptador que usa Supabase directamente
 */
export class GuestAdapter {
  /**
   * Siempre usa Supabase
   */
  private static getService() {
    console.log('🔧 GuestAdapter: Usando Supabase (forzado)')
    return 'supabase'
  }

  /**
   * Obtener invitados usando el servicio configurado
   */
  static async getGuests(): Promise<ApiResponse<Guest[]>> {
    try {
      console.log('📥 GuestAdapter: Cargando invitados')
      
      // Usar Supabase directamente
      return await this.getGuestsFromSupabase()
      
    } catch (error) {
      console.error('🚨 GuestAdapter: Error crítico en getGuests:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando invitados'
      }
    }
  }

  /**
   * Obtener invitados desde Supabase (tabla guests)
   */
  private static async getGuestsFromSupabase(): Promise<ApiResponse<Guest[]>> {
    try {
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase
        .from('guests')
        .select('id, full_name, email, phone, rsvp_status, table_number')
        .order('full_name', { ascending: true }) as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error cargando invitados desde Supabase')
      }

      // Mapear datos de Supabase al formato Guest
      const guests: Guest[] = (data || []).map((item: any) => ({
        id: item.id,
        full_name: item.full_name,
        email: item.email || '',
        phone: item.phone || '',
        rsvp_status: item.rsvp_status || 'pending',
        plus_one: false, // Campo no existe en Supabase, valor por defecto
        plus_one_name: '', // Campo no existe en Supabase, valor por defecto
        table_number: item.table_number || null,
        table: item.table_number || null, // Alias para compatibilidad con virtual-salon
        nickname: item.full_name.split(' ')[0] || '', // Usar primer nombre como nickname
        notes: '' // Campo no existe en Supabase, valor por defecto
      }))

      return {
        success: true,
        data: guests
      }

    } catch (error) {
      console.error('GuestAdapter.getGuestsFromSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando invitados desde Supabase'
      }
    }
  }

  /**
   * Actualizar RSVP usando el servicio configurado
   */
  static async updateRsvp(guestId: number, payload: RsvpRequest): Promise<ApiResponse<RsvpResponse>> {
    try {
      console.log(`📝 GuestAdapter: Actualizando RSVP para invitado ${guestId}`)
      
      // Usar Supabase directamente
      return await this.updateRsvpInSupabase(guestId, payload)
      
    } catch (error) {
      console.error('🚨 GuestAdapter: Error crítico en updateRsvp:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido actualizando RSVP'
      }
    }
  }

  /**
   * Actualizar RSVP en Supabase
   */
  private static async updateRsvpInSupabase(guestId: number, payload: RsvpRequest): Promise<ApiResponse<RsvpResponse>> {
    try {
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase
        .from('guests')
        .update({
          rsvp_status: payload.status
        })
        .eq('id', guestId)
        .select()
        .single() as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error actualizando RSVP en Supabase')
      }

      return {
        success: true,
        data: {
          id: data.id,
          status: data.rsvp_status,
          message: 'RSVP actualizado exitosamente'
        } as RsvpResponse
      }

    } catch (error) {
      console.error('GuestAdapter.updateRsvpInSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido actualizando RSVP en Supabase'
      }
    }
  }

  /**
   * Obtener configuración actual
   */
  static getConfig() {
    return {
      useBackendAPI: false,
      useSupabase: true,
      currentService: 'Supabase (forzado)'
    }
  }

  /**
   * Verificar disponibilidad de servicios
   */
  static async checkServices(): Promise<{ api: boolean; supabase: boolean }> {
    const results = { api: false, supabase: false }
    
    // Solo probar Supabase (forzado)
    try {
      const supabaseTest = await this.getGuestsFromSupabase()
      results.supabase = supabaseTest.success
    } catch (error) {
      console.error('Supabase check failed:', error)
      results.supabase = false
    }
    
    console.log('🔍 GuestAdapter: Service availability:', results)
    return results
  }
}
