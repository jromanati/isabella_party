import { GuestMessageService } from './guest-message.service'
import { getSupabaseClient } from '@/lib/supabase/client'
import { OpenAIService } from './openai.service'
import type { GuestMessage, GuestMessageCreate, PublicGuestMessage } from '@/types/guest-message'
import type { ApiResponse } from '@/lib/api'

/**
 * Servicio adaptador que usa Supabase directamente
 */
export class GuestMessageAdapter {
  /**
   * Siempre usa Supabase
   */
  private static getService() {
    console.log('🔧 GuestMessageAdapter: Usando Supabase (forzado)')
    return 'supabase'
  }

  /**
   * Crear mensaje de invitado usando el servicio configurado
   */
  static async createGuestMessage(guestMessage: GuestMessageCreate): Promise<ApiResponse<GuestMessage>> {
    try {
      console.log('📤 GuestMessageAdapter: Creando mensaje de invitado')
      
      // Usar Supabase directamente
      return await this.createGuestMessageInSupabase(guestMessage)
      
    } catch (error) {
      console.error('🚨 GuestMessageAdapter: Error crítico en createGuestMessage:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido creando mensaje de invitado'
      }
    }
  }

  /**
   * Obtener mensajes públicos usando el servicio configurado
   */
  static async getPublicMessages(): Promise<ApiResponse<PublicGuestMessage[]>> {
    const service = this.getService()
    
    try {
      console.log('📥 GuestMessageAdapter: Cargando mensajes públicos')
      
      if (service === 'api') {
        // Usar Backend API
        const result = await GuestMessageService.getPublicMessages()
        
        if (result.success) {
          console.log(`✅ GuestMessageAdapter: ${result.data?.length || 0} mensajes cargados desde API`)
        } else {
          console.error('❌ GuestMessageAdapter: Error cargando mensajes desde API:', result.error)
          
          // Intentar fallback a Supabase si API falla
          if (!USE_SUPABASE) {
            console.log('🔄 GuestMessageAdapter: Intentando fallback a Supabase')
            try {
              const fallbackResult = await this.getPublicMessagesFromSupabase()
              if (fallbackResult.success) {
                console.log('✅ GuestMessageAdapter: Fallback a Supabase exitoso')
                return fallbackResult
              }
            } catch (fallbackError) {
              console.error('❌ GuestMessageAdapter: Fallback a Supabase falló:', fallbackError)
            }
          }
        }
        
        return result
      } else {
        // Usar Supabase directamente
        return await this.getPublicMessagesFromSupabase()
      }
      
    } catch (error) {
      console.error('🚨 GuestMessageAdapter: Error crítico en getPublicMessages:', error)
      
      // Intentar fallback si el error es del servicio principal
      if (service === 'api' && !USE_SUPABASE) {
        console.log('🔄 GuestMessageAdapter: Intentando fallback a Supabase (error catch)')
        try {
          const fallbackResult = await this.getPublicMessagesFromSupabase()
          if (fallbackResult.success) {
            console.log('✅ GuestMessageAdapter: Fallback a Supabase exitoso (catch)')
            return fallbackResult
          }
        } catch (fallbackError) {
          console.error('❌ GuestMessageAdapter: Fallback a Supabase falló (catch):', fallbackError)
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando mensajes públicos'
      }
    }
  }

  /**
   * Crear mensaje de invitado en Supabase
   */
  private static async createGuestMessageInSupabase(guestMessage: GuestMessageCreate): Promise<ApiResponse<GuestMessage>> {
    try {
      const supabase = getSupabaseClient()
      
      // Análisis de IA para determinar el status del mensaje
      let messageStatus: 'approved' | 'rejected' | 'pending' = 'pending'
      let rejectionReason = ''
      
      try {
        console.log('🤖 GuestMessageAdapter: Analizando mensaje con IA...')
        const analysis = await OpenAIService.analyzeGuestMessage(guestMessage.message)
        
        if (analysis.isAppropriate) {
          messageStatus = 'approved'
          console.log('✅ GuestMessageAdapter: Mensaje aprobado por IA')
        } else {
          messageStatus = 'rejected'
          rejectionReason = analysis.reason || 'Contenido no apropiado según análisis de IA'
          console.log('❌ GuestMessageAdapter: Mensaje rechazado por IA:', rejectionReason)
        }
      } catch (aiError) {
        console.error('🚨 GuestMessageAdapter: Error en análisis de IA, manteniendo como pending:', aiError)
        messageStatus = 'pending'
      }
      
      const insertData: any = {
          guest: guestMessage.guest || null,
          recipient_type: guestMessage.recipient_type || 'celebrant',
          title: guestMessage.title || '',
          message: guestMessage.message,
          message_type: guestMessage.message_type || 'text',
          is_public: guestMessage.is_public || true,
          status: messageStatus,
          rejection_reason: rejectionReason || null,
          ai_moderation_result: messageStatus,
          ai_moderation_reason: rejectionReason || null,
          metadata: {
            ...guestMessage.metadata,
            ai_analyzed: true,
            ai_status: messageStatus,
            ai_reason: rejectionReason || null
          }
        }

      const { data, error } = await supabase
        .from('guest_messages')
        .insert(insertData)
        .select()
        .single() as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error creando mensaje en Supabase')
      }

      // Mapear a formato GuestMessage con el status del análisis de IA
      const mappedMessage: GuestMessage = {
        id: Math.abs(data.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)), // Hash UUID a number
        guest: data.guest || null,
        companion: null, // Campo no existe en Supabase
        guest_name: '', // No disponible en Supabase, necesitaría join
        companion_name: '', // No disponible en Supabase
        author_name: '', // No disponible en Supabase, necesitaría join
        author_type: 'guest', // Valor por defecto
        recipient_type: data.recipient_type || 'celebrant',
        title: data.title || '',
        message: data.message || '',
        message_type: 'text', // Campo no existe en Supabase, valor por defecto
        is_public: data.is_public || true,
        status: messageStatus, // Usar el status determinado por el análisis de IA
        is_featured: false, // Campo no existe en Supabase
        used_in_album: false, // Campo no existe en Supabase
        rejection_reason: rejectionReason || '',
        approved_at: null, // Campo no existe en Supabase
        approved_by: null, // Campo no existe en Supabase
        media_urls: [], // Campo no existe en Supabase
        tags: [], // Campo no existe en Supabase
        ai_status: messageStatus === 'approved' ? 'completed' : messageStatus === 'rejected' ? 'completed' : 'pending', // Mapear a valores válidos
        ai_moderation_result: messageStatus, // Usar el status del análisis de IA
        ai_moderation_reason: rejectionReason || '',
        ai_analysis: { analyzed: true, status: messageStatus, reason: rejectionReason }, // Campo no existe en Supabase
        metadata: data.metadata || {},
        created_at: data.created_at || '',
        updated_at: data.updated_at || ''
      }

      return {
        success: true,
        data: mappedMessage
      }

    } catch (error) {
      console.error('GuestMessageAdapter.createGuestMessageInSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido creando mensaje en Supabase'
      }
    }
  }

  /**
   * Obtener todos los mensajes de invitados usando el servicio configurado
   */
  static async getGuestMessages(params?: {
    status?: 'pending' | 'approved' | 'rejected' | 'hidden'
    recipient_type?: string
    message_type?: string
  }): Promise<ApiResponse<GuestMessage[]>> {
    const service = this.getService()
    
    try {
      console.log('📝 GuestMessageAdapter: Cargando mensajes de invitados')
      
      if (service === 'api') {
        // Usar Backend API
        const result = await GuestMessageService.getGuestMessages(params)
        
        if (result.success) {
          console.log('✅ GuestMessageAdapter: Mensajes cargados via API')
        } else {
          console.error('❌ GuestMessageAdapter: Error cargando mensajes via API:', result.error)
          
          // Intentar fallback a Supabase si API falla
          if (!USE_SUPABASE) {
            console.log('🔄 GuestMessageAdapter: Intentando fallback a Supabase')
            try {
              const fallbackResult = await this.getGuestMessagesFromSupabase(params)
              if (fallbackResult.success) {
                console.log('✅ GuestMessageAdapter: Fallback a Supabase exitoso')
                return fallbackResult
              }
            } catch (fallbackError) {
              console.error('❌ GuestMessageAdapter: Fallback a Supabase falló:', fallbackError)
            }
          }
        }
        
        return result
      } else {
        // Usar Supabase directamente
        return await this.getGuestMessagesFromSupabase(params)
      }
      
    } catch (error) {
      console.error('🚨 GuestMessageAdapter: Error crítico en getGuestMessages:', error)
      
      // Intentar fallback si el error es del servicio principal
      if (service === 'api' && !USE_SUPABASE) {
        console.log('🔄 GuestMessageAdapter: Intentando fallback a Supabase (error catch)')
        try {
          const fallbackResult = await this.getGuestMessagesFromSupabase(params)
          if (fallbackResult.success) {
            console.log('✅ GuestMessageAdapter: Fallback a Supabase exitoso (catch)')
            return fallbackResult
          }
        } catch (fallbackError) {
          console.error('❌ GuestMessageAdapter: Fallback a Supabase falló (catch):', fallbackError)
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando mensajes de invitados'
      }
    }
  }

  /**
   * Actualizar mensaje de invitado usando el servicio configurado
   */
  static async updateGuestMessage(id: number, updates: {
    status?: 'pending' | 'approved' | 'rejected' | 'hidden'
    rejection_reason?: string
  }): Promise<ApiResponse<GuestMessage>> {
    const service = this.getService()
    
    try {
      console.log(`📝 GuestMessageAdapter: Actualizando mensaje ID: ${id}`)
      
      if (service === 'api') {
        // Usar Backend API
        const result = await GuestMessageService.updateGuestMessage(id, updates)
        
        if (result.success) {
          console.log('✅ GuestMessageAdapter: Mensaje actualizado via API')
        } else {
          console.error('❌ GuestMessageAdapter: Error actualizando mensaje via API:', result.error)
          
          // Intentar fallback a Supabase si API falla
          if (!USE_SUPABASE) {
            console.log('🔄 GuestMessageAdapter: Intentando fallback a Supabase')
            try {
              const fallbackResult = await this.updateGuestMessageInSupabase(id, updates)
              if (fallbackResult.success) {
                console.log('✅ GuestMessageAdapter: Fallback a Supabase exitoso')
                return fallbackResult
              }
            } catch (fallbackError) {
              console.error('❌ GuestMessageAdapter: Fallback a Supabase falló:', fallbackError)
            }
          }
        }
        
        return result
      } else {
        // Usar Supabase directamente
        return await this.updateGuestMessageInSupabase(id, updates)
      }
      
    } catch (error) {
      console.error('🚨 GuestMessageAdapter: Error crítico en updateGuestMessage:', error)
      
      // Intentar fallback si el error es del servicio principal
      if (service === 'api' && !USE_SUPABASE) {
        console.log('🔄 GuestMessageAdapter: Intentando fallback a Supabase (error catch)')
        try {
          const fallbackResult = await this.updateGuestMessageInSupabase(id, updates)
          if (fallbackResult.success) {
            console.log('✅ GuestMessageAdapter: Fallback a Supabase exitoso (catch)')
            return fallbackResult
          }
        } catch (fallbackError) {
          console.error('❌ GuestMessageAdapter: Fallback a Supabase falló (catch):', fallbackError)
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido actualizando mensaje de invitado'
      }
    }
  }

  /**
   * Obtener mensajes públicos desde Supabase
   */
  private static async getPublicMessagesFromSupabase(): Promise<ApiResponse<PublicGuestMessage[]>> {
    try {
      const supabase = getSupabaseClient()
      
      // Hacer join con tabla guests para obtener nombres
      const { data, error } = await supabase
        .from('guest_messages')
        .select(`
          *,
          guests!guest_messages_guest_fkey (
            id,
            full_name
          )
        `)
        .eq('is_public', true)
        .eq('status', 'approved')
        .order('created_at', { ascending: false }) as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error cargando mensajes desde Supabase')
      }

      // Mapear a formato PublicGuestMessage con nombres resueltos
      const messages: PublicGuestMessage[] = (data || []).map((item: any) => {
        // Obtener nombre del invitado si existe
        const guestName = item.guests?.full_name || null
        const guestId = item.guest || null
        
        // Determinar author_name basado en si hay invitado asociado
        let authorName = 'Anónimo'
        let authorType: 'guest' | 'companion' | 'anonymous' | 'admin' = 'anonymous'
        
        if (guestName && guestId) {
          authorName = guestName
          authorType = 'guest'
        } else if (item.author_name && item.author_name.trim()) {
          authorName = item.author_name
          authorType = item.author_type || 'anonymous'
        }

        return {
          id: Math.abs(item.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)), // Hash UUID a number
          guest_name: guestName,
          companion_name: null, // No se usa companions en esta implementación
          author_name: authorName,
          author_type: authorType,
          recipient_type: item.recipient_type || 'birthday_girl',
          title: item.title || '',
          message: item.message || '',
          message_type: item.message_type || 'text',
          is_featured: false, // Campo no existe en Supabase
          created_at: item.created_at || ''
        }
      })

      return {
        success: true,
        data: messages
      }

    } catch (error) {
      console.error('GuestMessageAdapter.getPublicMessagesFromSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando mensajes desde Supabase'
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
      const apiTest = await GuestMessageService.getPublicMessages()
      results.api = apiTest.success
    } catch (error) {
      console.error('Backend API check failed:', error)
      results.api = false
    }
    
    // Probar Supabase
    try {
      const supabaseTest = await this.getPublicMessagesFromSupabase()
      results.supabase = supabaseTest.success
    } catch (error) {
      console.error('Supabase check failed:', error)
      results.supabase = false
    }
    
    console.log('🔍 GuestMessageAdapter: Service availability:', results)
    return results
  }

  /**
   * Obtener todos los mensajes desde Supabase
   */
  private static async getGuestMessagesFromSupabase(params?: {
    status?: 'pending' | 'approved' | 'rejected' | 'hidden'
    recipient_type?: string
    message_type?: string
  }): Promise<ApiResponse<GuestMessage[]>> {
    try {
      const supabase = getSupabaseClient()
      
      let query = supabase
        .from('guest_messages')
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtros si se proporcionan
      if (params?.status) {
        query = query.eq('status', params.status)
      }
      if (params?.recipient_type) {
        query = query.eq('recipient_type', params.recipient_type)
      }
      if (params?.message_type) {
        query = query.eq('message_type', params.message_type)
      }

      const { data, error } = await query

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error cargando mensajes desde Supabase')
      }

      // Mapear a formato GuestMessage
      const messages: GuestMessage[] = (data || []).map((item: any) => ({
        id: Math.abs(item.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)), // Hash UUID a number
        guest: item.guest || null,
        companion: null, // Campo no existe en Supabase
        guest_name: '', // No disponible en Supabase, necesitaría join
        companion_name: '', // No disponible en Supabase
        author_name: item.title || '', // Usar title como author_name
        author_type: 'guest', // Valor por defecto
        recipient_type: item.recipient_type || 'celebrant',
        title: item.title || '',
        message: item.message || '',
        message_type: item.message_type || 'text',
        is_public: item.is_public || true,
        status: item.status || 'pending',
        is_featured: false, // Campo no existe en Supabase
        used_in_album: false, // Campo no existe en Supabase
        rejection_reason: item.rejection_reason || '',
        approved_at: null, // Campo no existe en Supabase
        approved_by: null, // Campo no existe en Supabase
        media_urls: [], // Campo no existe en Supabase
        tags: [], // Campo no existe en Supabase
        ai_status: item.ai_moderation_result === 'approved' ? 'completed' : 
                  item.ai_moderation_result === 'rejected' ? 'completed' : 'pending',
        ai_moderation_result: item.ai_moderation_result || 'pending',
        ai_moderation_reason: item.ai_moderation_reason || '',
        ai_analysis: item.metadata?.ai_analysis || {}, // Campo no existe en Supabase
        metadata: item.metadata || {},
        created_at: item.created_at || '',
        updated_at: item.updated_at || ''
      }))

      return {
        success: true,
        data: messages
      }

    } catch (error) {
      console.error('GuestMessageAdapter.getGuestMessagesFromSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando mensajes desde Supabase'
      }
    }
  }

  /**
   * Actualizar mensaje en Supabase
   */
  private static async updateGuestMessageInSupabase(id: number, updates: {
    status?: 'pending' | 'approved' | 'rejected' | 'hidden'
    rejection_reason?: string
  }): Promise<ApiResponse<GuestMessage>> {
    try {
      const supabase = getSupabaseClient()
      
      // Buscar el UUID real usando el hash
      const { data: messages, error: searchError } = await supabase
        .from('guest_messages')
        .select('*')
        .limit(1000) as any

      if (searchError) {
        console.error('Supabase search error:', searchError)
        throw new Error(searchError.message || 'Error buscando mensaje en Supabase')
      }

      // Encontrar el mensaje correspondiente por hash
      const targetMessage = messages.find((msg: any) => 
        Math.abs(msg.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) === id
      )

      if (!targetMessage) {
        throw new Error('Mensaje no encontrado en Supabase')
      }

      // Preparar datos de actualización
      const updateData: any = {}
      if (updates.status) updateData.status = updates.status
      if (updates.rejection_reason) updateData.rejection_reason = updates.rejection_reason

      // Actualizar usando el UUID real
      const { data, error } = await supabase
        .from('guest_messages')
        .update(updateData)
        .eq('id', targetMessage.id)
        .select()
        .single() as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error actualizando mensaje en Supabase')
      }

      // Mapear a formato GuestMessage
      const message: GuestMessage = {
        id: Math.abs(data.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)), // Hash UUID a number
        guest: data.guest || null,
        companion: null, // Campo no existe en Supabase
        guest_name: '', // No disponible en Supabase
        companion_name: '', // No disponible en Supabase
        author_name: data.title || '',
        author_type: 'guest', // Valor por defecto
        recipient_type: data.recipient_type || 'celebrant',
        title: data.title || '',
        message: data.message || '',
        message_type: data.message_type || 'text',
        is_public: data.is_public || true,
        status: data.status || 'pending',
        is_featured: false, // Campo no existe en Supabase
        used_in_album: false, // Campo no existe en Supabase
        rejection_reason: data.rejection_reason || '',
        approved_at: null, // Campo no existe en Supabase
        approved_by: null, // Campo no existe en Supabase
        media_urls: [], // Campo no existe en Supabase
        tags: [], // Campo no existe en Supabase
        ai_status: data.ai_moderation_result === 'approved' ? 'completed' : 
                  data.ai_moderation_result === 'rejected' ? 'completed' : 'pending',
        ai_moderation_result: data.ai_moderation_result || 'pending',
        ai_moderation_reason: data.ai_moderation_reason || '',
        ai_analysis: data.metadata?.ai_analysis || {},
        metadata: data.metadata || {},
        created_at: data.created_at || '',
        updated_at: data.updated_at || ''
      }

      return {
        success: true,
        data: message
      }

    } catch (error) {
      console.error('GuestMessageAdapter.updateGuestMessageInSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido actualizando mensaje en Supabase'
      }
    }
  }
}
