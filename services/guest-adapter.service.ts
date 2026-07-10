import { GuestService } from './guest.service'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { Guest, RsvpRequest, RsvpResponse } from '@/types/guest'
import type { ApiResponse } from '@/lib/api'

/**
 * Configuración del sistema
 */
const USE_BACKEND_API = process.env.NEXT_PUBLIC_USE_BACKEND_API === 'true'
const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true'

/**
 * Servicio adaptador que elige dinámicamente entre Backend API y Supabase
 * para la gestión de invitados según la configuración de variables de entorno
 */
export class GuestAdapter {
  /**
   * Determina qué servicio usar basado en la configuración
   */
  private static getService() {
    if (USE_BACKEND_API) {
      console.log('🔧 GuestAdapter: Usando Backend API')
      return 'api'
    } else if (USE_SUPABASE) {
      console.log('🔧 GuestAdapter: Usando Supabase')
      return 'supabase'
    } else {
      // Por defecto usar Backend API
      console.log('🔧 GuestAdapter: Usando Backend API (default)')
      return 'api'
    }
  }

  /**
   * Obtener invitados usando el servicio configurado
   */
  static async getGuests(): Promise<ApiResponse<Guest[]>> {
    const service = this.getService()
    
    try {
      console.log('📥 GuestAdapter: Cargando invitados')
      
      if (service === 'api') {
        // Usar Backend API
        const result = await GuestService.getGuests()
        
        if (result.success) {
          console.log(`✅ GuestAdapter: ${result.data?.length || 0} invitados cargados desde API`)
        } else {
          console.error('❌ GuestAdapter: Error cargando invitados desde API:', result.error)
          
          // Intentar fallback a Supabase si API falla
          if (!USE_SUPABASE) {
            console.log('🔄 GuestAdapter: Intentando fallback a Supabase')
            try {
              const fallbackResult = await this.getGuestsFromSupabase()
              if (fallbackResult.success) {
                console.log('✅ GuestAdapter: Fallback a Supabase exitoso')
                return fallbackResult
              }
            } catch (fallbackError) {
              console.error('❌ GuestAdapter: Fallback a Supabase falló:', fallbackError)
            }
          }
        }
        
        return result
      } else {
        // Usar Supabase directamente
        return await this.getGuestsFromSupabase()
      }
      
    } catch (error) {
      console.error('🚨 GuestAdapter: Error crítico en getGuests:', error)
      
      // Intentar fallback si el error es del servicio principal
      if (service === 'api' && !USE_SUPABASE) {
        console.log('🔄 GuestAdapter: Intentando fallback a Supabase (error catch)')
        try {
          const fallbackResult = await this.getGuestsFromSupabase()
          if (fallbackResult.success) {
            console.log('✅ GuestAdapter: Fallback a Supabase exitoso (catch)')
            return fallbackResult
          }
        } catch (fallbackError) {
          console.error('❌ GuestAdapter: Fallback a Supabase falló (catch):', fallbackError)
        }
      }
      
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
    const service = this.getService()
    
    try {
      console.log(`📝 GuestAdapter: Actualizando RSVP para invitado ${guestId}`)
      
      if (service === 'api') {
        // Usar Backend API
        const result = await GuestService.updateRsvp(guestId, payload)
        
        if (result.success) {
          console.log('✅ GuestAdapter: RSVP actualizado via API')
        } else {
          console.error('❌ GuestAdapter: Error actualizando RSVP via API:', result.error)
          
          // Intentar fallback a Supabase si API falla
          if (!USE_SUPABASE) {
            console.log('🔄 GuestAdapter: Intentando fallback a Supabase para RSVP')
            try {
              const fallbackResult = await this.updateRsvpInSupabase(guestId, payload)
              if (fallbackResult.success) {
                console.log('✅ GuestAdapter: Fallback a Supabase exitoso para RSVP')
                return fallbackResult
              }
            } catch (fallbackError) {
              console.error('❌ GuestAdapter: Fallback a Supabase falló para RSVP:', fallbackError)
            }
          }
        }
        
        return result
      } else {
        // Usar Supabase directamente
        return await this.updateRsvpInSupabase(guestId, payload)
      }
      
    } catch (error) {
      console.error('🚨 GuestAdapter: Error crítico en updateRsvp:', error)
      
      // Intentar fallback si el error es del servicio principal
      if (service === 'api' && !USE_SUPABASE) {
        console.log('🔄 GuestAdapter: Intentando fallback a Supabase (error catch) para RSVP')
        try {
          const fallbackResult = await this.updateRsvpInSupabase(guestId, payload)
          if (fallbackResult.success) {
            console.log('✅ GuestAdapter: Fallback a Supabase exitoso (catch) para RSVP')
            return fallbackResult
          }
        } catch (fallbackError) {
          console.error('❌ GuestAdapter: Fallback a Supabase falló (catch) para RSVP:', fallbackError)
        }
      }
      
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
      useBackendAPI: USE_BACKEND_API,
      useSupabase: USE_SUPABASE,
      currentService: USE_BACKEND_API ? 'Backend API' : USE_SUPABASE ? 'Supabase' : 'Backend API (default)'
    }
  }

  /**
   * Verificar disponibilidad de servicios
   */
  static async checkServices(): Promise<{ api: boolean; supabase: boolean }> {
    const results = { api: false, supabase: false }
    
    // Probar Backend API
    try {
      const apiTest = await GuestService.getGuests()
      results.api = apiTest.success
    } catch (error) {
      console.error('Backend API check failed:', error)
      results.api = false
    }
    
    // Probar Supabase
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
