'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePollingUpdates } from '@/hooks/usePollingUpdates'

interface NotificationBellProps {
  className?: string
  position?: 'fixed' | 'relative'
  // Estado del polling para evitar múltiples instancias
  hasAnyNew?: boolean
  hasNewPhotos?: boolean
  hasNewMessages?: boolean
  hasNewSongs?: boolean
  photosUpdate?: any
  messagesUpdate?: any
  songsUpdate?: any
  getNewCount?: () => number
  markAsReviewed?: (type: 'photos' | 'messages' | 'songs') => void
  markAllAsReviewed?: () => void
}

export function NotificationBell({ 
  className = '', 
  position = 'fixed',
  hasAnyNew = false,
  hasNewPhotos = false,
  hasNewMessages = false,
  hasNewSongs = false,
  photosUpdate,
  messagesUpdate,
  songsUpdate,
  getNewCount = () => 0,
  markAsReviewed = () => {},
  markAllAsReviewed = () => {}
}: NotificationBellProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Debug: Log estado del NotificationBell
  useEffect(() => {
    console.log('🔍 NotificationBell: Estado actual', {
      hasAnyNew,
      hasNewPhotos,
      hasNewMessages,
      hasNewSongs,
      newCount: getNewCount(),
      timestamp: new Date().toISOString()
    })
  }, [hasAnyNew, hasNewPhotos, hasNewMessages, hasNewSongs])

  // Debug: Log cuando el hook se actualiza
  useEffect(() => {
    console.log('🔍 NotificationBell: Hook actualizado', {
      hasAnyNew,
      timestamp: new Date().toISOString()
    })
  }, [hasAnyNew])

  // Animación de campana cuando hay nuevas notificaciones
  useEffect(() => {
    if (hasAnyNew) {
      console.log('🔍 NotificationBell: Iniciando animación')
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
  }, [hasAnyNew])

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.notification-bell-container')) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => document.removeEventListener('click', handleClickOutside)
  }, [isDropdownOpen])

  const newCount = getNewCount()
  const totalNew = newCount

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

  const handleActionClick = (type: 'photos' | 'messages' | 'songs') => {
    // Solo cerrar el dropdown, NO marcar como revisado
    // La notificación debe persistir hasta entrar a la sección
    setIsDropdownOpen(false)
  }

  const handleMarkAllAsRead = () => {
    // Solo cerrar el dropdown, NO marcar como revisado
    // La notificación debe persistir hasta entrar a la sección
    setIsDropdownOpen(false)
  }

  const updates = [
    hasNewPhotos && 'photos',
    hasNewMessages && 'messages', 
    hasNewSongs && 'songs'
  ].filter(Boolean) as ('photos' | 'messages' | 'songs')[]

  const positionClasses = position === 'fixed' 
    ? 'fixed top-4 right-4 z-40' 
    : 'relative'

  return (
    <div className={`notification-bell-container ${positionClasses} ${className}`}>
      {/* Campana */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`relative p-3 rounded-full transition-all duration-200 ${
          hasAnyNew 
            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 hover:from-blue-500/30 hover:to-purple-500/30' 
            : 'bg-white/5 border border-white/10 hover:bg-white/10'
        }`}
        title={hasAnyNew ? `${totalNew} notificaciones nuevas` : 'Sin notificaciones nuevas'}
      >
        <motion.div
          animate={{
            rotate: isAnimating ? [0, -15, 15, -10, 10, 0] : 0,
            scale: isAnimating ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
        >
          <svg 
            className={`w-5 h-5 ${hasAnyNew ? 'text-blue-400' : 'text-white/60'}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </motion.div>

        {/* Badge de conteo */}
        <AnimatePresence>
          {totalNew > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              {totalNew > 9 ? '9+' : totalNew}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown de notificaciones */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 bg-black/90 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-hidden"
            style={{ transformOrigin: 'top right' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">
                  🎉 Notificaciones nuevas
                </h3>
                {totalNew > 0 && (
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                    {totalNew}
                  </span>
                )}
              </div>
            </div>

            {/* Lista de notificaciones */}
            <div className="max-h-96 overflow-y-auto">
              {updates.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm">
                  <div className="mb-2">🔔</div>
                  <p>No hay notificaciones nuevas</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {updates.map((type) => {
                    const update = getUpdateInfo(type)
                    if (!update) return null

                    const newItems = update.previousTotal 
                      ? update.total - update.previousTotal
                      : update.total

                    return (
                      <div
                        key={type}
                        className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
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
                            
                            <p className="text-white/60 text-xs mb-2">
                              Total: {update.total} elementos
                            </p>
                            
                            <Link
                              href={getActionUrl(type)}
                              onClick={() => handleActionClick(type)}
                              className="inline-flex items-center gap-1 text-blue-400 text-xs hover:text-blue-300 transition-colors"
                            >
                              Revisar ahora →
                            </Link>
                          </div>
                          
                          <button
                            onClick={() => markAsReviewed(type)}
                            className="text-white/40 hover:text-white/60 text-xs transition-colors"
                            title="Marcar como revisado"
                          >
                            ✓
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {updates.length > 1 && (
              <div className="p-3 border-t border-white/10">
                <button
                  onClick={handleMarkAllAsRead}
                  className="w-full text-center text-white/60 hover:text-white text-xs transition-colors"
                >
                  Marcar todo como revisado
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
