import { getSupabaseClient } from '@/lib/supabase/client'
import type { SongRequest, SongRequestCreate, PublicSongRequest } from '@/types/song-request'
import type { ApiResponse } from '@/lib/api'

/**
 * Servicio adaptador que usa Supabase directamente
 */
export class SongRequestAdapter {
  /**
   * Siempre usa Supabase
   */
  private static getService() {
    console.log('🔧 SongRequestAdapter: Usando Supabase (forzado)')
    return 'supabase'
  }

  /**
   * Crear solicitud de canción usando el servicio configurado
   */
  static async createSongRequest(songRequest: SongRequestCreate): Promise<ApiResponse<SongRequest>> {
    try {
      console.log('📤 SongRequestAdapter: Creando solicitud de canción')
      
      // Usar Supabase directamente
      return await this.createSongRequestInSupabase(songRequest)
      
    } catch (error) {
      console.error('🚨 SongRequestAdapter: Error crítico en createSongRequest:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido creando solicitud de canción'
      }
    }
  }

  /**
   * Obtener todas las solicitudes de canciones (para DJ/admin)
   */
  static async getSongRequests(params?: any): Promise<ApiResponse<SongRequest[]>> {
    try {
      console.log('📥 SongRequestAdapter: Cargando solicitudes de canciones')
      
      // Usar Supabase directamente
      return await this.getSongRequestsFromSupabase(params)
      
    } catch (error) {
      console.error('🚨 SongRequestAdapter: Error crítico en getSongRequests:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando solicitudes de canciones'
      }
    }
  }

  /**
   * Obtener playlist pública usando Supabase directamente
   */
  static async getPublicPlaylist(): Promise<ApiResponse<PublicSongRequest[]>> {
    try {
      console.log('📥 SongRequestAdapter: Cargando playlist pública desde Supabase')
      
      // Usar Supabase directamente
      return await this.getPublicPlaylistFromSupabase()
      
    } catch (error) {
      console.error('🚨 SongRequestAdapter: Error crítico en getPublicPlaylist:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando playlist'
      }
    }
  }

  /**
   * Marcar canción como sonando usando Supabase directamente
   */
  static async markAsPlaying(id: number): Promise<ApiResponse<SongRequest>> {
    try {
      console.log('🎵 SongRequestAdapter: Marcando canción como sonando')
      
      // Usar Supabase directamente
      return await this.markAsPlayingInSupabase(id)
      
    } catch (error) {
      console.error('🚨 SongRequestAdapter: Error crítico en markAsPlaying:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido marcando canción como sonando'
      }
    }
  }

  /**
   * Marcar canción como reproducida usando Supabase directamente
   */
  static async markAsPlayed(id: number): Promise<ApiResponse<SongRequest>> {
    try {
      console.log('🎵 SongRequestAdapter: Marcando canción como reproducida')
      
      // Usar Supabase directamente
      return await this.markAsPlayedInSupabase(id)
      
    } catch (error) {
      console.error('🚨 SongRequestAdapter: Error crítico en markAsPlayed:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido marcando canción como reproducida'
      }
    }
  }

  /**
   * Rechazar solicitud de canción usando Supabase directamente
   */
  static async rejectSongRequest(id: number, request: { reason?: string }): Promise<ApiResponse<SongRequest>> {
    try {
      console.log('🚫 SongRequestAdapter: Rechazando solicitud de canción')
      
      // Usar Supabase directamente
      return await this.rejectSongRequestInSupabase(id, request)
      
    } catch (error) {
      console.error('🚨 SongRequestAdapter: Error crítico en rejectSongRequest:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido rechazando solicitud de canción'
      }
    }
  }

  /**
   * Obtener canción actual usando Supabase directamente
   */
  static async getNowPlaying(): Promise<ApiResponse<SongRequest | null>> {
    try {
      console.log('🎵 SongRequestAdapter: Obteniendo canción actual')
      
      // Usar Supabase directamente
      return await this.getNowPlayingFromSupabase()
      
    } catch (error) {
      console.error('🚨 SongRequestAdapter: Error crítico en getNowPlaying:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido obteniendo canción actual'
      }
    }
  }

  /**
   * Crear solicitud de canción en Supabase
   */
  private static async createSongRequestInSupabase(songRequest: SongRequestCreate): Promise<ApiResponse<SongRequest>> {
    try {
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase
        .from('song_requests')
        .insert({
          guest_name: songRequest.guest_name || '',
          raw_song: songRequest.raw_song,
          song_title: songRequest.song_title,
          artist_name: songRequest.artist_name,
          album_image_url: songRequest.album_image_url,
          preview_url: songRequest.preview_url,
          status: 'pending'
        })
        .select()
        .single() as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error creando solicitud de canción en Supabase')
      }

      // Mapear a formato SongRequest
      const mappedSong: SongRequest = {
        id: Math.abs(data.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)), // Hash UUID a number
        guest: songRequest.guest || null,
        companion: songRequest.companion || null,
        guest_name: data.guest_name || '',
        source: songRequest.source || 'guest',
        raw_song: data.raw_song || '',
        song_title: data.song_title || '',
        artist_name: data.artist_name || '',
        album_name: '', // Campo no existe en Supabase
        album_image_url: data.album_image_url || '',
        preview_url: data.preview_url || '',
        external_url: '', // Campo no existe en Supabase
        provider: 'manual', // Campo no existe en Supabase
        provider_track_id: '', // Campo no existe en Supabase
        status: data.status || 'pending',
        rejection_reason: '',
        played_at: data.played_at || null,
        sort_order: songRequest.sort_order || 0,
        is_featured: songRequest.is_featured || false,
        notes: '', // Campo no existe en Supabase
        ai_status: 'pending',
        ai_analysis: {},
        metadata: {},
        created_at: data.created_at || '',
        updated_at: data.updated_at || ''
      }

      return {
        success: true,
        data: mappedSong
      }

    } catch (error) {
      console.error('SongRequestAdapter.createSongRequestInSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido creando solicitud en Supabase'
      }
    }
  }

  /**
   * Obtener todas las solicitudes de canciones desde Supabase (para DJ/admin)
   */
  private static async getSongRequestsFromSupabase(params?: any): Promise<ApiResponse<SongRequest[]>> {
    try {
      const supabase = getSupabaseClient()
      
      let query = supabase
        .from('song_requests')
        .select('*')
        .order('created_at', { ascending: false }) as any

      // Aplicar filtros si se proporcionan
      if (params?.status) {
        query = query.eq('status', params.status)
      }

      const { data, error } = await query

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error cargando solicitudes desde Supabase')
      }

      // Mapear a formato SongRequest con UUID original almacenado en metadata
      const requests: SongRequest[] = (data || []).map((item: any) => ({
        id: Math.abs(item.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)), // Hash UUID a number
        status: item.status || 'pending',
        is_featured: false, // Campo no existe en Supabase
        sort_order: 0, // Campo no existe en Supabase
        raw_song: item.raw_song || '',
        song_title: item.song_title || '',
        artist_name: item.artist_name || '',
        album_name: '', // Campo no existe en Supabase
        album_image_url: item.album_image_url || '',
        preview_url: item.preview_url || '',
        external_url: '', // Campo no existe en Supabase
        provider: 'manual', // Campo no existe en Supabase
        provider_track_id: '', // Campo no existe en Supabase
        notes: '', // Campo no existe en Supabase
        guest_name: item.guest_name || '',
        rejection_reason: item.rejection_reason || '',
        played_at: item.played_at || null,
        created_at: item.created_at || '',
        updated_at: item.updated_at || '',
        metadata: { uuid: item.id } // Almacenar UUID original en metadata
      }))

      return {
        success: true,
        data: requests
      }

    } catch (error) {
      console.error('SongRequestAdapter.getSongRequestsFromSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando solicitudes desde Supabase'
      }
    }
  }

  /**
   * Obtener playlist pública desde Supabase
   */
  private static async getPublicPlaylistFromSupabase(): Promise<ApiResponse<PublicSongRequest[]>> {
    try {
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase
        .from('song_requests')
        .select('*')
        .in('status', ['pending', 'playing', 'played'])
        .order('created_at', { ascending: true }) as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error cargando playlist desde Supabase')
      }

      // Mapear a formato PublicSongRequest
      const playlist: PublicSongRequest[] = (data || []).map((item: any) => ({
        id: Math.abs(item.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)), // Hash UUID a number
        status: item.status || 'pending',
        is_featured: false, // Campo no existe en Supabase
        sort_order: 0, // Campo no existe en Supabase
        raw_song: item.raw_song || '',
        song_title: item.song_title || '',
        artist_name: item.artist_name || '',
        album_name: '', // Campo no existe en Supabase
        album_image_url: item.album_image_url || '',
        preview_url: item.preview_url || '',
        external_url: '', // Campo no existe en Supabase
        provider: 'manual', // Campo no existe en Supabase
        provider_track_id: '', // Campo no existe en Supabase
        notes: '', // Campo no existe en Supabase
        guest_name: item.guest_name || '',
        created_at: item.created_at || ''
      }))

      return {
        success: true,
        data: playlist
      }

    } catch (error) {
      console.error('SongRequestAdapter.getPublicPlaylistFromSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido cargando playlist desde Supabase'
      }
    }
  }

  /**
   * Obtener canción actual desde Supabase
   */
  private static async getNowPlayingFromSupabase(): Promise<ApiResponse<SongRequest | null>> {
    try {
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase
        .from('song_requests')
        .select('*')
        .eq('status', 'playing')
        .single() as any

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error obteniendo canción actual desde Supabase')
      }

      if (!data) {
        return {
          success: true,
          data: null
        }
      }

      // Mapear a formato SongRequest
      const nowPlaying: SongRequest = {
        id: Math.abs(data.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)), // Hash UUID a number
        guest: null, // No disponible en Supabase
        companion: null, // No disponible en Supabase
        guest_name: data.guest_name || '',
        source: 'guest', // Valor por defecto
        raw_song: data.raw_song || '',
        song_title: data.song_title || '',
        artist_name: data.artist_name || '',
        album_name: '', // Campo no existe en Supabase
        album_image_url: data.album_image_url || '',
        preview_url: data.preview_url || '',
        external_url: '', // Campo no existe en Supabase
        provider: 'manual', // Campo no existe en Supabase
        provider_track_id: '', // Campo no existe en Supabase
        status: data.status || 'playing',
        rejection_reason: '',
        played_at: data.played_at || null,
        sort_order: 0, // Campo no existe en Supabase
        is_featured: false, // Campo no existe en Supabase
        notes: '', // Campo no existe en Supabase
        ai_status: 'pending', // Campo no existe en Supabase
        ai_analysis: {}, // Campo no existe en Supabase
        metadata: {}, // Campo no existe en Supabase
        created_at: data.created_at || '',
        updated_at: data.updated_at || ''
      }

      return {
        success: true,
        data: nowPlaying
      }

    } catch (error) {
      console.error('SongRequestAdapter.getNowPlayingFromSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido obteniendo canción actual desde Supabase'
      }
    }
  }

  /**
   * Marcar canción como sonando en Supabase
   */
  private static async markAsPlayingInSupabase(id: number): Promise<ApiResponse<SongRequest>> {
    try {
      const supabase = getSupabaseClient()
      
      // Primero buscar la canción por su hash ID para obtener el UUID real
      const { data: songs, error: searchError } = await supabase
        .from('song_requests')
        .select('*')
        .eq('status', 'pending') as any

      if (searchError) {
        console.error('Supabase search error:', searchError)
        throw new Error(searchError.message || 'Error buscando canción en Supabase')
      }

      // Encontrar la canción correspondiente por hash
      const targetSong = songs.find((song: any) => 
        Math.abs(song.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) === id
      )

      if (!targetSong) {
        throw new Error('Canción no encontrada en Supabase')
      }

      // Actualizar usando el UUID real
      const { data, error } = await supabase
        .from('song_requests')
        .update({ 
          status: 'playing',
          played_at: new Date().toISOString()
        })
        .eq('id', targetSong.id)
        .select()
        .single() as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error marcando canción como sonando en Supabase')
      }

      // Mapear a formato SongRequest
      const request: SongRequest = {
        id: Math.abs(data.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)),
        guest: data.guest || null,
        companion: data.companion || null,
        guest_name: data.guest_name || '',
        source: 'guest',
        status: data.status || 'playing',
        raw_song: data.raw_song || '',
        song_title: data.song_title || '',
        artist_name: data.artist_name || '',
        album_name: '',
        album_image_url: data.album_image_url || '',
        preview_url: data.preview_url || '',
        external_url: '',
        provider: 'manual',
        provider_track_id: '',
        rejection_reason: data.rejection_reason || '',
        played_at: data.played_at || null,
        sort_order: 0,
        is_featured: false,
        notes: '',
        ai_status: 'pending',
        ai_analysis: {},
        metadata: {},
        created_at: data.created_at || '',
        updated_at: data.updated_at || ''
      }

      return {
        success: true,
        data: request
      }

    } catch (error) {
      console.error('SongRequestAdapter.markAsPlayingInSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido marcando canción como sonando en Supabase'
      }
    }
  }

  /**
   * Marcar canción como reproducida en Supabase
   */
  private static async markAsPlayedInSupabase(id: number): Promise<ApiResponse<SongRequest>> {
    try {
      const supabase = getSupabaseClient()
      
      // Primero buscar la canción por su hash ID para obtener el UUID real
      const { data: songs, error: searchError } = await supabase
        .from('song_requests')
        .select('*')
        .in('status', ['pending', 'playing']) as any

      if (searchError) {
        console.error('Supabase search error:', searchError)
        throw new Error(searchError.message || 'Error buscando canción en Supabase')
      }

      // Encontrar la canción correspondiente por hash
      const targetSong = songs.find((song: any) => 
        Math.abs(song.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) === id
      )

      if (!targetSong) {
        throw new Error('Canción no encontrada en Supabase')
      }

      // Actualizar usando el UUID real
      const { data, error } = await supabase
        .from('song_requests')
        .update({ 
          status: 'played',
          played_at: new Date().toISOString()
        })
        .eq('id', targetSong.id)
        .select()
        .single() as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error marcando canción como reproducida en Supabase')
      }

      // Mapear a formato SongRequest
      const request: SongRequest = {
        id: Math.abs(data.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)),
        guest: data.guest || null,
        companion: data.companion || null,
        guest_name: data.guest_name || '',
        source: 'guest',
        status: data.status || 'played',
        raw_song: data.raw_song || '',
        song_title: data.song_title || '',
        artist_name: data.artist_name || '',
        album_name: '',
        album_image_url: data.album_image_url || '',
        preview_url: data.preview_url || '',
        external_url: '',
        provider: 'manual',
        provider_track_id: '',
        rejection_reason: data.rejection_reason || '',
        played_at: data.played_at || null,
        sort_order: 0,
        is_featured: false,
        notes: '',
        ai_status: 'pending',
        ai_analysis: {},
        metadata: {},
        created_at: data.created_at || '',
        updated_at: data.updated_at || ''
      }

      return {
        success: true,
        data: request
      }

    } catch (error) {
      console.error('SongRequestAdapter.markAsPlayedInSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido marcando canción como reproducida en Supabase'
      }
    }
  }

  /**
   * Rechazar solicitud de canción en Supabase
   */
  private static async rejectSongRequestInSupabase(id: number, request: { reason?: string }): Promise<ApiResponse<SongRequest>> {
    try {
      const supabase = getSupabaseClient()
      
      // Primero buscar la canción por su hash ID para obtener el UUID real
      const { data: songs, error: searchError } = await supabase
        .from('song_requests')
        .select('*')
        .eq('status', 'pending') as any

      if (searchError) {
        console.error('Supabase search error:', searchError)
        throw new Error(searchError.message || 'Error buscando canción en Supabase')
      }

      // Encontrar la canción correspondiente por hash
      const targetSong = songs.find((song: any) => 
        Math.abs(song.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) === id
      )

      if (!targetSong) {
        throw new Error('Canción no encontrada en Supabase')
      }

      // Actualizar usando el UUID real
      const { data, error } = await supabase
        .from('song_requests')
        .update({ 
          status: 'rejected' as const,
          rejection_reason: (request.reason || 'Rechazada por el DJ') as string
        })
        .eq('id', targetSong.id)
        .select()
        .single() as any

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error rechazando solicitud en Supabase')
      }

      // Mapear a formato SongRequest
      const songRequest: SongRequest = {
        id: Math.abs(data.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)),
        guest: data.guest || null,
        companion: data.companion || null,
        guest_name: data.guest_name || '',
        source: 'guest',
        status: data.status || 'rejected',
        raw_song: data.raw_song || '',
        song_title: data.song_title || '',
        artist_name: data.artist_name || '',
        album_name: '',
        album_image_url: data.album_image_url || '',
        preview_url: data.preview_url || '',
        external_url: '',
        provider: 'manual',
        provider_track_id: '',
        rejection_reason: data.rejection_reason || '',
        played_at: data.played_at || null,
        sort_order: 0,
        is_featured: false,
        notes: '',
        ai_status: 'pending',
        ai_analysis: {},
        metadata: {},
        created_at: data.created_at || '',
        updated_at: data.updated_at || ''
      }

      return {
        success: true,
        data: songRequest
      }

    } catch (error) {
      console.error('SongRequestAdapter.rejectSongRequestInSupabase error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido rechazando solicitud en Supabase'
      }
    }
  }
}
