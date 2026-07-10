// Servicio de Polling Inteligente para Actualizaciones en Tiempo Real
// Basado en timestamps del backend - sin WebSocket

import { apiClient, type ApiResponse } from '@/lib/api'

export interface TimestampResponse {
  photos_last_updated: string
  messages_last_updated: string
  songs_last_updated: string
  total_photos: number
  total_messages: number
  total_songs: number
  poll_interval: number  // Intervalo recomendado en ms
  server_time: string
}

export interface ContentUpdate {
  type: 'photos' | 'messages' | 'songs'
  hasNew: boolean
  lastUpdated: string
  total: number
  previousTotal?: number
  manuallyReviewed?: boolean
}

export interface PollingState {
  isPolling: boolean
  lastCheck: string | null
  interval: number
  updates: {
    photos: ContentUpdate
    messages: ContentUpdate
    songs: ContentUpdate
  }
  hasAnyNew: boolean
}

export class PollingService {
  private static instance: PollingService
  private listeners: Set<(state: PollingState) => void> = new Set()
  private state: PollingState = {
    isPolling: false,
    lastCheck: null,
    interval: 30000, // Default 30 segundos
    updates: {
      photos: { type: 'photos', hasNew: false, lastUpdated: '', total: 0, manuallyReviewed: false },
      messages: { type: 'messages', hasNew: false, lastUpdated: '', total: 0, manuallyReviewed: false },
      songs: { type: 'songs', hasNew: false, lastUpdated: '', total: 0, manuallyReviewed: false }
    },
    hasAnyNew: false
  }
  private pollInterval: NodeJS.Timeout | null = null
  private visibilityHandler: (() => void) | null = null
  private readonly STORAGE_KEY = 'polling_notifications_state'
  private initialized = false

  static getInstance(): PollingService {
    if (!PollingService.instance) {
      PollingService.instance = new PollingService()
    }
    return PollingService.instance
  }

  constructor() {
    // NO cargar localStorage en el constructor para evitar error de SSR
  }

  // Inicializar en cliente (llamar desde useEffect)
  initializeClient(): void {
    if (typeof window === 'undefined') return
    if (this.initialized) return
    
    this.loadFromStorage()
    this.initialized = true
  }

  // Cargar estado desde localStorage
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const parsedState = JSON.parse(stored)
        
        // Validar y fusionar con estado inicial
        this.state = {
          isPolling: false, // Siempre empezar en false
          lastCheck: parsedState.lastCheck || null,
          interval: parsedState.interval || 30000,
          updates: {
            photos: { 
              ...this.state.updates.photos, 
              ...parsedState.updates?.photos,
              manuallyReviewed: parsedState.updates?.photos?.manuallyReviewed ?? false
            },
            messages: { 
              ...this.state.updates.messages, 
              ...parsedState.updates?.messages,
              manuallyReviewed: parsedState.updates?.messages?.manuallyReviewed ?? false
            },
            songs: { 
              ...this.state.updates.songs, 
              ...parsedState.updates?.songs,
              manuallyReviewed: parsedState.updates?.songs?.manuallyReviewed ?? false
            }
          },
          hasAnyNew: parsedState.hasAnyNew || false
        }

        console.log('🔍 PollingService: Estado cargado desde localStorage', this.state)
      }
    } catch (error) {
      console.warn('🔍 PollingService: Error cargando estado desde localStorage', error)
    }
  }

  // Guardar estado en localStorage
  private saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const stateToSave = {
        lastCheck: this.state.lastCheck,
        interval: this.state.interval,
        updates: this.state.updates,
        hasAnyNew: this.state.hasAnyNew
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave))
      console.log('🔍 PollingService: Estado guardado en localStorage')
    } catch (error) {
      console.warn('🔍 PollingService: Error guardando estado en localStorage', error)
    }
  }

  // Suscribirse a cambios de estado
  subscribe(listener: (state: PollingState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // Obtener estado actual
  getState(): PollingState {
    return { ...this.state }
  }

  // Iniciar polling
  async startPolling(initialInterval: number = 30000): Promise<void> {
    if (this.state.isPolling) return

    this.state.isPolling = true
    this.state.interval = initialInterval
    
    // Verificación inicial inmediata
    await this.checkForUpdates()
    
    // Configurar polling periódico
    this.pollInterval = setInterval(async () => {
      await this.checkForUpdates()
    }, this.state.interval)

    // Configurar manejo de visibilidad de página
    this.setupVisibilityHandler()
    
    this.notifyListeners()
  }

  // Detener polling
  stopPolling(): void {
    if (!this.state.isPolling) return

    this.state.isPolling = false
    
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }

    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler)
      this.visibilityHandler = null
    }
    
    this.notifyListeners()
  }

  // Verificar actualizaciones con el backend
  private async checkForUpdates(): Promise<void> {
    try {
      console.log('PollingService: Checking for updates...')
      
      const response = await apiClient.get<TimestampResponse>('eventhub/updates/timestamps/')
      
      if (!response.success) {
        console.warn(`PollingService: API Error - ${response.error}`)
        return
      }
      
      if (!response.data) {
        console.warn('PollingService: No data received')
        return
      }

      const data = response.data
      
      // Actualizar estado con nueva información
      this.updateState(data)
      
      // Actualizar intervalo dinámicamente si el backend lo sugiere
      if (data.poll_interval && data.poll_interval !== this.state.interval) {
        this.updateInterval(data.poll_interval)
      }

    } catch (error) {
      console.error('PollingService: Error checking updates', error)
    }
  }

  // Actualizar estado con datos del backend
  private updateState(data: TimestampResponse): void {
    const now = new Date().toISOString()
    
    // Actualizar cada tipo de contenido
    const updateContent = (
      type: 'photos' | 'messages' | 'songs',
      lastUpdated: string,
      total: number
    ): ContentUpdate => {
      const previous = this.state.updates[type]
      
      // Debug: Log estado anterior y nuevo
      console.log(`🔍 PollingService[${type}]:`, {
        previous: {
          hasNew: previous.hasNew,
          lastUpdated: previous.lastUpdated,
          manuallyReviewed: previous.manuallyReviewed,
          total: previous.total
        },
        backend: {
          lastUpdated,
          total
        }
      })
      
      // Detectar si hay contenido nuevo
      const hasNewContent = this.isNewer(lastUpdated, previous.lastUpdated)
      
      // Lógica simplificada:
      // 1. Si ya tiene hasNew=true y no fue revisado manualmente, mantener hasNew=true
      // 2. Si hay contenido nuevo y no fue revisado manualmente, establecer hasNew=true
      // 3. Si fue revisado manualmente, mantener hasNew=false hasta nuevo contenido
      
      let hasNew = previous.hasNew
      let manuallyReviewed = previous.manuallyReviewed ?? false
      
      if (hasNewContent && manuallyReviewed) {
        // Hay contenido nuevo después de una revisión: resetear y mostrar nueva notificación
        hasNew = true
        manuallyReviewed = false
        console.log(`🔍 PollingService[${type}]: Nuevo contenido después de revisión - reseteando`)
      } else if (hasNewContent && !manuallyReviewed) {
        // Hay contenido nuevo y no fue revisado: mostrar notificación
        hasNew = true
        console.log(`🔍 PollingService[${type}]: Nuevo contenido detectado`)
      } else if (!hasNewContent && previous.hasNew && !manuallyReviewed) {
        // No hay contenido nuevo pero ya había notificación: mantener
        hasNew = true
        console.log(`🔍 PollingService[${type}]: Manteniendo notificación existente`)
      } else {
        // No hay contenido nuevo o ya fue revisado
        hasNew = false
        console.log(`🔍 PollingService[${type}]: Sin notificación`)
      }
      
      console.log(`🔍 PollingService[${type}] FINAL:`, {
        hasNew,
        manuallyReviewed,
        willPersist: hasNew && !manuallyReviewed
      })
      
      return {
        type,
        hasNew,
        lastUpdated,
        total,
        previousTotal: previous.total,
        manuallyReviewed
      }
    }

    this.state.updates.photos = updateContent(
      'photos',
      data.photos_last_updated,
      data.total_photos
    )
    
    this.state.updates.messages = updateContent(
      'messages',
      data.messages_last_updated,
      data.total_messages
    )
    
    this.state.updates.songs = updateContent(
      'songs',
      data.songs_last_updated,
      data.total_songs
    )

    this.state.lastCheck = now
    this.state.hasAnyNew = this.state.updates.photos.hasNew || 
                          this.state.updates.messages.hasNew || 
                          this.state.updates.songs.hasNew

    this.notifyListeners()
  }

  // Comparar timestamps para detectar actualizaciones
  private isNewer(newTimestamp: string, oldTimestamp: string): boolean {
    if (!oldTimestamp) return true
    
    try {
      const newDate = new Date(newTimestamp)
      const oldDate = new Date(oldTimestamp)
      return newDate > oldDate
    } catch {
      return false
    }
  }

  // Actualizar intervalo de polling
  private updateInterval(newInterval: number): void {
    if (newInterval === this.state.interval) return

    this.state.interval = newInterval
    
    // Reiniciar polling con nuevo intervalo
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = setInterval(async () => {
        await this.checkForUpdates()
      }, this.state.interval)
    }
    
    console.log(`PollingService: Interval updated to ${newInterval}ms`)
  }

  // Configurar manejo de visibilidad de página
  private setupVisibilityHandler(): void {
    if (this.visibilityHandler) return

    this.visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        // Verificar inmediatamente cuando la página gana foco
        this.checkForUpdates()
      }
    }

    document.addEventListener('visibilitychange', this.visibilityHandler)
  }

  // Notificar a todos los listeners
  private notifyListeners(): void {
    const currentState = this.getState()
    this.listeners.forEach(listener => listener(currentState))
    
    // Guardar estado en localStorage después de cada cambio
    this.saveToStorage()
  }

  // Marcar contenido como revisado (actualizar timestamp local)
  markAsReviewed(type: 'photos' | 'messages' | 'songs'): void {
    this.state.updates[type].hasNew = false
    this.state.updates[type].manuallyReviewed = true
    this.state.hasAnyNew = this.state.updates.photos.hasNew || 
                          this.state.updates.messages.hasNew || 
                          this.state.updates.songs.hasNew
    this.notifyListeners()
  }

  // Marcar todo como revisado
  markAllAsReviewed(): void {
    Object.keys(this.state.updates).forEach(key => {
      this.state.updates[key as keyof typeof this.state.updates].hasNew = false
      this.state.updates[key as keyof typeof this.state.updates].manuallyReviewed = true
    })
    this.state.hasAnyNew = false
    this.notifyListeners()
  }

  // Forzar verificación manual
  async forceCheck(): Promise<void> {
    await this.checkForUpdates()
  }

  // Forzar una notificación manualmente (para debugging)
  forceNotification(type: 'photos' | 'messages' | 'songs'): void {
    console.log(`🔍 PollingService: Forzando notificación para ${type}`)
    
    this.state.updates[type].hasNew = true
    this.state.updates[type].manuallyReviewed = false
    this.state.updates[type].lastUpdated = new Date().toISOString()
    
    // Recalcular hasAnyNew
    this.state.hasAnyNew = this.state.updates.photos.hasNew || 
                          this.state.updates.messages.hasNew || 
                          this.state.updates.songs.hasNew
    
    console.log(`🔍 PollingService: Estado después de forzar:`, this.getState())
    this.notifyListeners()
  }

  // Obtener estado actual para debugging
  getDebugState(): any {
    return {
      state: this.getState(),
      storage: typeof window !== 'undefined' ? localStorage.getItem(this.STORAGE_KEY) : null,
      isPolling: this.state.isPolling,
      interval: this.state.interval,
      lastCheck: this.state.lastCheck
    }
  }

  // Obtener estado para debugging
  async getDebugInfo(): Promise<any> {
    try {
      const response = await apiClient.get<any>('eventhub/updates/status/')
      
      if (!response.success) {
        return { error: response.error }
      }
      
      return response.data
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  // Limpiar localStorage (útil para logout o reset)
  clearStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY)
      console.log('🔍 PollingService: Estado eliminado de localStorage')
    }
  }

  // Limpiar recursos
  destroy(): void {
    this.stopPolling()
    this.listeners.clear()
  }
}
