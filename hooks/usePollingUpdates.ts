import { useState, useEffect, useCallback, useRef } from 'react'
import { PollingService, PollingState, ContentUpdate } from '@/services/polling.service'

export function usePollingUpdates(autoStart: boolean = true, interval: number = 30000) {
  const [isClient, setIsClient] = useState(false)
  const [state, setState] = useState<PollingState>(() => {
    // Estado inicial vacío para SSR
    return {
      isPolling: false,
      lastCheck: null,
      interval: 30000,
      updates: {
        photos: { type: 'photos', hasNew: false, lastUpdated: '', total: 0, manuallyReviewed: false },
        messages: { type: 'messages', hasNew: false, lastUpdated: '', total: 0, manuallyReviewed: false },
        songs: { type: 'songs', hasNew: false, lastUpdated: '', total: 0, manuallyReviewed: false }
      },
      hasAnyNew: false
    }
  })
  const pollingServiceRef = useRef<PollingService | null>(null)

  // Inicializar solo en cliente
  useEffect(() => {
    setIsClient(true)
    const service = PollingService.getInstance()
    service.initializeClient() // Cargar localStorage
    pollingServiceRef.current = service
    setState(service.getState()) // Actualizar con estado real
  }, [])

  // Suscribirse a cambios del servicio
  useEffect(() => {
    if (!isClient || !pollingServiceRef.current) return
    
    const service = pollingServiceRef.current
    
    const unsubscribe = service.subscribe((newState) => {
      console.log('🔍 usePollingUpdates: Estado recibido del PollingService', {
        hasAnyNew: newState.hasAnyNew,
        photos: newState.updates.photos.hasNew,
        messages: newState.updates.messages.hasNew,
        songs: newState.updates.songs.hasNew
      })
      setState(newState)
    })

    return () => unsubscribe()
  }, [isClient])

  // Iniciar polling automáticamente
  useEffect(() => {
    const service = pollingServiceRef.current
    
    if (service && autoStart && !state.isPolling) {
      service.startPolling(interval)
    }

    return () => {
      // No detener el polling automáticamente para permitir múltiples componentes
    }
  }, [autoStart, interval, state.isPolling])

  // Métodos para controlar el polling
  const startPolling = useCallback(async (customInterval?: number) => {
    const service = pollingServiceRef.current
    if (service) {
      await service.startPolling(customInterval || interval)
    }
  }, [interval])

  const stopPolling = useCallback(() => {
    const service = pollingServiceRef.current
    if (service) {
      service.stopPolling()
    }
  }, [])

  const forceCheck = useCallback(async () => {
    const service = pollingServiceRef.current
    if (service) {
      await service.forceCheck()
    }
  }, [])

  const markAsReviewed = useCallback((type: 'photos' | 'messages' | 'songs') => {
    const service = pollingServiceRef.current
    if (service) {
      service.markAsReviewed(type)
    }
  }, [])

  const markAllAsReviewed = useCallback(() => {
    const service = pollingServiceRef.current
    if (service) {
      service.markAllAsReviewed()
    }
  }, [])

  const getDebugInfo = useCallback(async () => {
    const service = pollingServiceRef.current
    if (service) {
      return await service.getDebugInfo()
    }
    return null
  }, [])

  // Obtener actualizaciones agrupadas
  const getNewUpdates = useCallback((): ContentUpdate[] => {
    return Object.values(state.updates).filter(update => update.hasNew)
  }, [state.updates])

  // Obtener conteo de nuevos elementos
  const getNewCount = useCallback((): number => {
    return getNewUpdates().reduce((total, update) => {
      // Contar cada tipo de notificación pendiente como 1 si tiene hasNew
      return total + (update.hasNew ? 1 : 0)
    }, 0)
  }, [getNewUpdates])

  // Verificar si hay actualizaciones específicas
  const hasNewPhotos = state.updates.photos.hasNew
  const hasNewMessages = state.updates.messages.hasNew
  const hasNewSongs = state.updates.songs.hasNew

  return {
    // Estado
    state,
    isPolling: state.isPolling,
    hasAnyNew: state.hasAnyNew,
    lastCheck: state.lastCheck,
    
    // Actualizaciones específicas
    hasNewPhotos,
    hasNewMessages,
    hasNewSongs,
    photosUpdate: state.updates.photos,
    messagesUpdate: state.updates.messages,
    songsUpdate: state.updates.songs,
    
    // Métodos de control
    startPolling,
    stopPolling,
    forceCheck,
    markAsReviewed,
    markAllAsReviewed,
    getDebugInfo,
    
    // Utilidades
    getNewUpdates,
    getNewCount
  }
}
