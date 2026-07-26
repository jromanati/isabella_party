'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, Check, Clock, X } from 'lucide-react'
import type { Guest } from '@/types/guest'

interface GuestSelectorProps {
  value: string
  onChange: (guest: Guest | null) => void
  placeholder?: string
  disabled?: boolean
}

export default function GuestSelector({ 
  value, 
  onChange, 
  placeholder = "¿Cómo te llamas?", 
  disabled = false 
}: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar invitados al montar
  useEffect(() => {
    const loadGuests = async () => {
      try {
        setLoading(true)
        setError(null)

        // Importar dinámicamente para evitar SSR issues
        const { GuestAdapter } = await import('@/services/guest-adapter.service')

        const response = await GuestAdapter.getGuests()
        
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Error al cargar invitados')
        }

        setGuests(response.data)
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        setError(message)
        setGuests([])
      } finally {
        setLoading(false)
      }
    }

    loadGuests()
  }, [])

  // Filtrar invitados por búsqueda
  const filteredGuests = useMemo(() => {
    if (!searchQuery.trim()) return guests
    
    const query = searchQuery.toLowerCase()
    return guests.filter(guest => 
      guest.full_name.toLowerCase().includes(query) ||
      (guest.nickname && guest.nickname.toLowerCase().includes(query))
    )
  }, [guests, searchQuery])

  // Encontrar invitado seleccionado
  const selectedGuest = useMemo(() => {
    if (!value) return null
    return guests.find(g => g.id.toString() === value) || null
  }, [guests, value])

  const handleSelect = (guest: Guest) => {
    onChange(guest)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleClear = () => {
    onChange(null)
    setSearchQuery('')
  }

  const displayName = selectedGuest 
    ? selectedGuest.nickname || selectedGuest.full_name
    : ''

  return (
    <div className="relative">
      {/* Selector visible */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
        className="w-full px-4 py-3 rounded-xl text-left transition-all duration-300"
        style={{
          background: disabled 
            ? 'rgba(255,255,255,0.04)' 
            : isOpen 
              ? 'rgba(168,85,247,0.08)' 
              : 'rgba(255,255,255,0.04)',
          border: isOpen 
            ? '1px solid rgba(168,85,247,0.3)' 
            : '1px solid rgba(255,255,255,0.08)',
          color: selectedGuest 
            ? '#f9a8d4' 
            : 'rgba(255,255,255,0.4)',
          fontFamily: 'var(--font-body)',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {selectedGuest ? (
              <>
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{displayName}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 flex-shrink-0" />
                <span>{placeholder}</span>
              </>
            )}
          </div>
          
          {selectedGuest && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <motion.svg
                initial={{ rotate: 0 }}
                animate={{ rotate: 45 }}
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </motion.svg>
            </button>
          )}
        </div>
      </div>

      {/* Dropdown con búsqueda */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden"
            style={{
              background: 'rgba(17, 24, 39, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(168,85,247,0.2)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Campo de búsqueda */}
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar invitado..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50 transition-colors"
                  style={{ fontFamily: 'var(--font-body)' }}
                  autoFocus
                />
              </div>
            </div>

            {/* Lista de invitados */}
            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="text-sm text-white/40" style={{ fontFamily: 'var(--font-body)' }}>
                    Cargando invitados...
                  </div>
                </div>
              ) : error ? (
                <div className="p-4 text-center">
                  <div className="text-sm text-red-400" style={{ fontFamily: 'var(--font-body)' }}>
                    {error}
                  </div>
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="p-4 text-center">
                  <div className="text-sm text-white/40" style={{ fontFamily: 'var(--font-body)' }}>
                    {searchQuery ? 'No se encontraron invitados' : 'No hay invitados disponibles'}
                  </div>
                </div>
              ) : (
                filteredGuests.map((guest) => {
                  const isConfirmed = guest.rsvp_status === 'confirmed'
                  const isDeclined = guest.rsvp_status === 'declined'
                  const isPending = guest.rsvp_status === 'pending'

                  return (
                    <button
                      key={guest.id}
                      type="button"
                      onClick={() => handleSelect(guest)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <User className="w-4 h-4 text-white/40 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-white/90 truncate">
                          {guest.nickname || guest.full_name}
                        </div>
                        {guest.nickname && (
                          <div className="text-xs text-white/40 truncate">
                            {guest.full_name}
                          </div>
                        )}
                      </div>
                      
                      {selectedGuest?.id === guest.id && (
                        <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para cerrar al hacer click fuera */}
      {isOpen && !disabled && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
