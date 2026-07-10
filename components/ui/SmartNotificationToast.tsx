'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { usePollingUpdates } from '@/hooks/usePollingUpdates'

interface SmartNotificationToastProps {
  className?: string
}

export function SmartNotificationToast({ className = '' }: SmartNotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null)
  
  const {
    hasAnyNew,
    hasNewPhotos,
    hasNewMessages,
    hasNewSongs,
    photosUpdate,
    messagesUpdate,
    songsUpdate,
    markAsReviewed,
    markAllAsReviewed,
    getNewCount
  } = usePollingUpdates(true, 30000)

  // Auto-mostrar/ocultar basado en nuevas actualizaciones
  useEffect(() => {
    if (hasAnyNew) {
      setIsVisible(true)
      
      // Auto-ocultar después de 8 segundos
      if (autoHideTimer) clearTimeout(autoHideTimer)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 8000)
      setAutoHideTimer(timer)
    }
  }, [hasAnyNew])

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (autoHideTimer) clearTimeout(autoHideTimer)
    }
  }, [autoHideTimer])

  const handleMarkAsReviewed = (type: 'photos' | 'messages' | 'songs') => {
    // Solo ocultar el toast, NO marcar como revisado
    // La notificación debe persistir en la campana hasta entrar a la sección
    setIsVisible(false)
  }

  const handleMarkAllAsReviewed = () => {
    // Solo ocultar el toast, NO marcar como revisado
    // La notificación debe persistir en la campana hasta entrar a la sección
    setIsVisible(false)
  }

  const getActionUrl = (type: 'photos' | 'messages' | 'songs') => {
    switch (type) {
      case 'photos':
        return '/slideshow'
      case 'messages':
        return '/messages-slideshow'
      case 'songs':
        return '/dj'
      default:
        return '#'
    }
  }

  const getUpdateInfo = (type: 'photos' | 'messages' | 'songs') => {
    switch (type) {
      case 'photos':
        return photosUpdate
      case 'messages':
        return messagesUpdate
      case 'songs':
        return songsUpdate
      default:
        return null
    }
  }

  const newCount = getNewCount()
  const updates = [
    hasNewPhotos && 'photos',
    hasNewMessages && 'messages', 
    hasNewSongs && 'songs'
  ].filter(Boolean) as ('photos' | 'messages' | 'songs')[]

  if (!isVisible || updates.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className={`fixed top-4 right-4 z-50 max-w-md ${className}`}
      >
        <div className="bg-gradient-to-r from-blue-500/90 via-purple-500/90 to-pink-500/90 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <h3 className="text-white font-semibold text-sm">
                🎉 Nuevas actualizaciones
              </h3>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                {newCount}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/60 hover:text-white text-sm transition-colors"
                title="Ocultar temporalmente"
              >
                −
              </button>
              
              <button
                onClick={handleMarkAllAsReviewed}
                className="text-white/60 hover:text-white text-sm transition-colors"
                title="Marcar todo como revisado"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Updates List */}
          <div className="space-y-2">
            {updates.map((type) => {
              const update = getUpdateInfo(type)
              if (!update) return null

              const newItems = update.previousTotal 
                ? update.total - update.previousTotal
                : update.total

              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: updates.indexOf(type) * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium text-sm">
                          {type === 'photos' && '📸 Fotos nuevas'}
                          {type === 'messages' && '💬 Mensajes nuevos'}
                          {type === 'songs' && '🎵 Canciones nuevas'}
                        </span>
                        <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded">
                          +{newItems}
                        </span>
                      </div>
                      
                      <p className="text-white/80 text-xs">
                        Total: {update.total} elementos
                      </p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <a
                          href={getActionUrl(type)}
                          className="inline-flex items-center gap-1 text-white/90 text-xs underline hover:text-white transition-colors"
                        >
                          Revisar ahora →
                        </a>
                        
                        <button
                          onClick={() => handleMarkAsReviewed(type)}
                          className="text-white/60 hover:text-white text-xs transition-colors"
                          title="Marcar como revisado"
                        >
                          ✓ Hecho
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Footer */}
          {updates.length > 1 && (
            <div className="mt-3 pt-3 border-t border-white/20 flex justify-between items-center">
              <span className="text-white/60 text-xs">
                {updates.length} tipo{updates.length > 1 ? 's' : ''} de contenido
              </span>
              
              <button
                onClick={handleMarkAllAsReviewed}
                className="text-white/80 hover:text-white text-xs transition-colors"
              >
                Marcar todo como revisado
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
