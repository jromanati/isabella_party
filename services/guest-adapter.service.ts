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
        .select('id, full_name, email, phone, rsvp_status, rsvp_message, table_number')
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
        rsvp_message: item.rsvp_message || null,
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
        .eq('id', String(guestId))
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
   * Crear invitado usando Supabase
   */
  static async createGuest(data: { full_name: string; table: number | null; email?: string }): Promise<ApiResponse<Guest>> {
    try {
      console.log('➕ GuestAdapter: Creando invitado')
      
      const supabase = getSupabaseClient()
      
      const { data: created, error } = await supabase
        .from('guests')
        .insert({
          full_name: data.full_name,
          normalized_name: data.full_name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
          table_number: data.table,
          email: data.email || null,
          rsvp_status: 'pending'
        })
        .select()
        .single() as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error creando invitado en Supabase')
      }

      const guest: Guest = {
        id: created.id,
        full_name: created.full_name,
        email: created.email || '',
        phone: created.phone || '',
        rsvp_status: created.rsvp_status || 'pending',
        plus_one: false,
        plus_one_name: '',
        table_number: created.table_number || null,
        table: created.table_number || null,
        nickname: created.full_name.split(' ')[0] || '',
        notes: ''
      }

      return {
        success: true,
        data: guest
      }

    } catch (error) {
      console.error('GuestAdapter.createGuest error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido creando invitado'
      }
    }
  }

  /**
   * Actualizar invitado usando Supabase
   */
  static async updateGuest(id: number, data: { full_name: string; table: number | null; rsvp_status?: string; email?: string; rsvp_message?: string | null }): Promise<ApiResponse<Guest>> {
    try {
      console.log(`✏️ GuestAdapter: Actualizando invitado ${id}`)
      
      const supabase = getSupabaseClient()
      
      const updateData: any = {
        full_name: data.full_name,
        table_number: data.table
      }
      
      if (data.rsvp_status) {
        updateData.rsvp_status = data.rsvp_status
      }
      
      if (data.email !== undefined) {
        updateData.email = data.email || null
      }
      
      if (data.rsvp_message !== undefined) {
        updateData.rsvp_message = data.rsvp_message || null
      }
      
      const { data: updated, error } = await supabase
        .from('guests')
        .update(updateData)
        .eq('id', String(id))
        .select()
        .single() as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error actualizando invitado en Supabase')
      }

      const guest: Guest = {
        id: updated.id,
        full_name: updated.full_name,
        email: updated.email || '',
        phone: updated.phone || '',
        rsvp_status: updated.rsvp_status || 'pending',
        plus_one: false,
        plus_one_name: '',
        table_number: updated.table_number || null,
        table: updated.table_number || null,
        nickname: updated.full_name.split(' ')[0] || '',
        notes: ''
      }

      return {
        success: true,
        data: guest
      }

    } catch (error) {
      console.error('GuestAdapter.updateGuest error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido actualizando invitado'
      }
    }
  }

  /**
   * Eliminar invitado usando Supabase
   */
  static async deleteGuest(id: number): Promise<ApiResponse<void>> {
    try {
      console.log(`🗑️ GuestAdapter: Eliminando invitado ${id}`)
      
      const supabase = getSupabaseClient()
      
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', String(id)) as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error eliminando invitado en Supabase')
      }

      return {
        success: true,
        data: undefined
      }

    } catch (error) {
      console.error('GuestAdapter.deleteGuest error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido eliminando invitado'
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
