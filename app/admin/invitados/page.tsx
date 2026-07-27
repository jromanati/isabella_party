'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Clock, Plus, Edit, Trash2, Search, UserPlus, ChevronLeft, ChevronRight, ArrowLeft, AlertTriangle, MoreVertical, Mail } from 'lucide-react'
import Link from 'next/link'
import { GuestAdapter } from '@/services/guest-adapter.service'
import { getSupabaseClient } from '@/lib/supabase/client'
import { sendInvitation, sendAlbumNotification } from '@/lib/notifications/sendInvitation'
import type { Guest } from '@/types/guest'

// ── Neon ambience ───────────────────────────────────────────────
function NeonAmbience() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh]"
        style={{
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[40vw] h-[30vh]"
        style={{
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}

// ── Action Menu ─────────────────────────────────────────────────────
function ActionMenu({
  guest,
  onEdit,
  onDelete,
  onToggleRSVP,
  onSendInvitation,
}: {
  guest: Guest
  onEdit: () => void
  onDelete: () => void
  onToggleRSVP: () => void
  onSendInvitation: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })

  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const isConfirmed = guest.rsvp_status === 'confirmed'
  const hasEmail = Boolean(guest.email?.trim())

  const MENU_WIDTH = 224
  const MENU_ESTIMATED_HEIGHT = 220
  const SCREEN_MARGIN = 12
  const MENU_GAP = 8

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const calculateMenuPosition = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()

    let left = rect.right - MENU_WIDTH
    left = Math.max(SCREEN_MARGIN, left)
    left = Math.min(left, window.innerWidth - MENU_WIDTH - SCREEN_MARGIN)

    let top = rect.bottom + MENU_GAP
    const availableSpaceBelow = window.innerHeight - rect.bottom
    const availableSpaceAbove = rect.top

    if (
      availableSpaceBelow < MENU_ESTIMATED_HEIGHT &&
      availableSpaceAbove > availableSpaceBelow
    ) {
      top = rect.top - MENU_ESTIMATED_HEIGHT - MENU_GAP
    }

    top = Math.max(SCREEN_MARGIN, top)

    if (top + MENU_ESTIMATED_HEIGHT > window.innerHeight - SCREEN_MARGIN) {
      top = window.innerHeight - MENU_ESTIMATED_HEIGHT - SCREEN_MARGIN
    }

    setMenuPosition({ top, left })
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu()
      return
    }

    calculateMenuPosition()
    setIsOpen(true)
  }

  useEffect(() => {
    if (!isOpen) return

    const handleResize = () => calculateMenuPosition()
    const handleScroll = () => closeMenu()

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, true)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen, calculateMenuPosition, closeMenu])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeMenu])

  const executeAction = (callback: () => void) => {
    callback()
    closeMenu()
  }

  const menu =
    isMounted && isOpen
      ? createPortal(
          <AnimatePresence>
            <>
              <motion.button
                type="button"
                aria-label="Cerrar menú"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMenu}
                className="fixed inset-0 z-[9998] cursor-default"
                style={{ background: 'transparent' }}
              />

              <motion.div
                role="menu"
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="fixed z-[9999] w-56 overflow-hidden rounded-xl"
                style={{
                  top: menuPosition.top,
                  left: menuPosition.left,
                  background: 'rgba(10,5,20,0.98)',
                  border: '1px solid rgba(168,85,247,0.35)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  boxShadow: '0 18px 60px rgba(0,0,0,0.75)',
                }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="py-1">
                  <motion.button
                    type="button"
                    role="menuitem"
                    whileHover={{ background: 'rgba(168,85,247,0.12)' }}
                    onClick={() => executeAction(onToggleRSVP)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    style={{
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {isConfirmed ? (
                      <>
                        <X className="h-4 w-4" style={{ color: '#fbbf24' }} />
                        <span className="text-sm">Marcar pendiente</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" style={{ color: '#4ade80' }} />
                        <span className="text-sm">Confirmar</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    role="menuitem"
                    whileHover={{ background: 'rgba(168,85,247,0.12)' }}
                    onClick={() => executeAction(onEdit)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    style={{
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <Edit className="h-4 w-4" style={{ color: '#60a5fa' }} />
                    <span className="text-sm">Editar</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    role="menuitem"
                    disabled={!hasEmail}
                    whileHover={{
                      background: hasEmail
                        ? 'rgba(168,85,247,0.12)'
                        : 'transparent',
                    }}
                    onClick={() => {
                      if (hasEmail) executeAction(onSendInvitation)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    style={{
                      color: hasEmail
                        ? 'rgba(255,255,255,0.85)'
                        : 'rgba(255,255,255,0.3)',
                      fontFamily: 'var(--font-body)',
                      cursor: hasEmail ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <Mail
                      className="h-4 w-4"
                      style={{
                        color: hasEmail
                          ? '#ec4899'
                          : 'rgba(255,255,255,0.3)',
                      }}
                    />
                    <span className="text-sm">
                      {hasEmail ? 'Enviar invitación' : 'Sin email'}
                    </span>
                  </motion.button>

                  <div
                    className="mx-3 my-1 h-px"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  />

                  <motion.button
                    type="button"
                    role="menuitem"
                    disabled={isConfirmed}
                    whileHover={{
                      background: isConfirmed
                        ? 'transparent'
                        : 'rgba(239,68,68,0.12)',
                    }}
                    onClick={() => {
                      if (!isConfirmed) executeAction(onDelete)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    style={{
                      color: isConfirmed
                        ? 'rgba(255,255,255,0.3)'
                        : '#fca5a5',
                      fontFamily: 'var(--font-body)',
                      cursor: isConfirmed ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Trash2
                      className="h-4 w-4"
                      style={{
                        color: isConfirmed
                          ? 'rgba(255,255,255,0.3)'
                          : '#f87171',
                      }}
                    />
                    <span className="text-sm">
                      {isConfirmed ? 'No se puede eliminar' : 'Eliminar'}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          </AnimatePresence>,
          document.body
        )
      : null

  return (
    <>
      <div className="relative inline-flex">
        <motion.button
          ref={buttonRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label={`Acciones para ${guest.full_name}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMenu}
          className="rounded-lg p-2"
          style={{
            background: isOpen
              ? 'rgba(168,85,247,0.24)'
              : 'rgba(168,85,247,0.12)',
            border: '1px solid rgba(168,85,247,0.3)',
            color: isOpen ? '#d8b4fe' : 'rgba(192,132,252,0.8)',
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </motion.button>
      </div>

      {menu}
    </>
  )
}

// ── Tooltip ─────────────────────────────────────────────────────
function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode
  content: string
}) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-sm whitespace-normal z-50"
          style={{
            background: 'rgba(10,5,20,0.95)',
            border: '1px solid rgba(168,85,247,0.3)',
            backdropFilter: 'blur(16px)',
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            maxWidth: '300px',
            wordWrap: 'break-word',
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}

// ── Toast Notification ─────────────────────────────────────────────
function Toast({
  message,
  type = 'success',
  onClose,
}: {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', text: '#4ade80', icon: Check },
    error: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: '#f87171', icon: X },
  }

  const { bg, border, text, icon: Icon } = colors[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        backdropFilter: 'blur(16px)',
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: `${border}33` }}
      >
        <Icon className="w-4 h-4" style={{ color: text }} />
      </div>
      <p className="text-sm font-medium" style={{ color: text, fontFamily: 'var(--font-body)' }}>
        {message}
      </p>
    </motion.div>
  )
}

// ── Delete Confirmation Modal ─────────────────────────────────────
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  guestName,
  isConfirmed,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  guestName: string
  isConfirmed: boolean
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative rounded-2xl overflow-hidden w-full max-w-md"
        style={{
          background: 'rgba(10,5,20,0.95)',
          border: '1px solid rgba(239,68,68,0.3)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <div className="p-6">
          {isConfirmed ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(251,191,36,0.15)',
                    border: '1px solid rgba(251,191,36,0.3)',
                  }}
                >
                  <AlertTriangle className="w-6 h-6" style={{ color: '#fbbf24' }} />
                </div>
                <h2 className="font-sans font-black italic text-xl text-white">No se puede eliminar</h2>
              </div>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>
                El invitado <strong>{guestName}</strong> ya está confirmado. No se pueden eliminar invitados que han confirmado su asistencia.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Entendido
              </motion.button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.3)',
                  }}
                >
                  <AlertTriangle className="w-6 h-6" style={{ color: '#f87171' }} />
                </div>
                <h2 className="font-sans font-black italic text-xl text-white">¿Eliminar invitado?</h2>
              </div>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>
                ¿Estás seguro de que deseas eliminar a <strong>{guestName}</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: '#f87171',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Eliminar
                </motion.button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ── Guest Form Modal ─────────────────────────────────────────────
function GuestFormModal({
  isOpen,
  onClose,
  onSubmit,
  guest,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { full_name: string; table: number | null; email?: string }) => void
  guest?: Guest
}) {
  const [fullName, setFullName] = useState(guest?.full_name || '')
  const [table, setTable] = useState(guest?.table ? String(guest.table) : '')
  const [email, setEmail] = useState(guest?.email || '')

  useEffect(() => {
    if (isOpen) {
      setFullName(guest?.full_name || '')
      setTable(guest?.table ? String(guest.table) : '')
      setEmail(guest?.email || '')
    }
  }, [isOpen, guest])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) return
    onSubmit({
      full_name: fullName.trim(),
      table: table ? parseInt(table, 10) : null,
      email: email.trim() || undefined,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative rounded-2xl overflow-hidden w-full max-w-md"
        style={{
          background: 'rgba(10,5,20,0.95)',
          border: '1px solid rgba(168,85,247,0.2)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <div className="p-6">
          <h2 className="font-sans font-black italic text-2xl text-white mb-6">
            {guest ? 'Editar invitado' : 'Nuevo invitado'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)' }}>
                Nombre completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)' }}>
                Número de mesa (opcional)
              </label>
              <select
                value={table}
                onChange={(e) => setTable(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <option value="">Sin asignar</option>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)' }}>
                Email (opcional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej: juan@email.com"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {guest ? 'Guardar cambios' : 'Crear invitado'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────
export default function AdminInvitadosPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | undefined>()
  const [detailsGuest, setDetailsGuest] = useState<Guest | undefined>()
  const [saving, setSaving] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [guestToDelete, setGuestToDelete] = useState<Guest | undefined>()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const itemsPerPage = 6

  const loadGuests = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await GuestAdapter.getGuests()
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Error al cargar invitados')
      }
      
      setGuests(response.data)
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGuests()
  }, [loadGuests])

  const handleCreateGuest = async (data: { full_name: string; table: number | null; email?: string }) => {
    try {
      setSaving(true)
      const response = await GuestAdapter.createGuest(data)
      
      if (!response.success) {
        throw new Error(response.error || 'Error al crear invitado')
      }
      
      await loadGuests()
      setToast({ message: 'Invitado creado exitosamente', type: 'success' })
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      setToast({ message: 'Error al crear invitado', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateGuest = async (id: number, data: { full_name: string; table: number | null; email?: string }) => {
    try {
      setSaving(true)
      const response = await GuestAdapter.updateGuest(id, data)
      
      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar invitado')
      }
      
      await loadGuests()
      setToast({ message: 'Invitado actualizado exitosamente', type: 'success' })
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      setToast({ message: 'Error al actualizar invitado', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteGuest = (guest: Guest) => {
    setGuestToDelete(guest)
    setDeleteModalOpen(true)
  }

  const confirmDeleteGuest = async () => {
    if (!guestToDelete) return
    
    try {
      setSaving(true)
      const response = await GuestAdapter.deleteGuest(guestToDelete.id)
      
      if (!response.success) {
        throw new Error(response.error || 'Error al eliminar invitado')
      }
      
      await loadGuests()
      setDeleteModalOpen(false)
      setGuestToDelete(undefined)
      setToast({ message: 'Invitado eliminado exitosamente', type: 'success' })
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      setToast({ message: 'Error al eliminar invitado', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleRSVP = async (guest: Guest) => {
    try {
      setSaving(true)
      const newStatus = guest.rsvp_status === 'confirmed' ? 'pending' : 'confirmed'
      const response = await GuestAdapter.updateGuest(guest.id, { 
        full_name: guest.full_name, 
        table: guest.table_number || null,
        rsvp_status: newStatus 
      })
      
      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar estado')
      }
      
      await loadGuests()
      setToast({ 
        message: newStatus === 'confirmed' 
          ? 'Invitado confirmado exitosamente' 
          : 'Invitado marcado como pendiente', 
        type: 'success' 
      })
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      setToast({ message: 'Error al actualizar estado', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleSendInvitation = async (guest: Guest) => {
    try {
      setSaving(true)
      const response = await fetch('/api/send-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestName: guest.full_name,
          guestEmail: guest.email || '',
          tableNumber: guest.table_number || null,
          guestId: guest.id,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setToast({ message: 'Invitación enviada exitosamente', type: 'success' })
      } else {
        throw new Error(result.error || 'Error al enviar invitación')
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      setToast({ message: 'Error al enviar invitación', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleMassSendInvitations = async () => {
    try {
      setSaving(true)
      
      // Filtrar invitados pendientes con email
      const pendingGuests = guests.filter(
        guest => guest.rsvp_status === 'pending' && guest.email && guest.email.trim() !== ''
      )
      
      if (pendingGuests.length === 0) {
        setToast({ 
          message: 'No hay invitados pendientes con email para enviar', 
          type: 'error' 
        })
        return
      }
      
      let successCount = 0
      let errorCount = 0
      
      for (const guest of pendingGuests) {
        try {
          const response = await fetch('/api/send-invitation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              guestName: guest.full_name,
              guestEmail: guest.email || '',
              tableNumber: guest.table_number || null,
              guestId: guest.id,
            }),
          })
          
          const result = await response.json()
          
          if (result.success) {
            successCount++
          } else {
            errorCount++
          }
        } catch (e) {
          errorCount++
        }
      }
      
      if (successCount > 0) {
        setToast({ 
          message: `Invitaciones enviadas: ${successCount} exitosas${errorCount > 0 ? `, ${errorCount} con error` : ''}`, 
          type: 'success' 
        })
      } else {
        setToast({ 
          message: 'Error al enviar invitaciones masivas', 
          type: 'error' 
        })
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      setToast({ message: 'Error al enviar invitaciones masivas', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleMassSendAlbumNotifications = async () => {
    try {
      setSaving(true)
      
      // Filtrar invitados con email
      const guestsWithEmail = guests.filter(
        guest => guest.email && guest.email.trim() !== ''
      )
      
      if (guestsWithEmail.length === 0) {
        setToast({ 
          message: 'No hay invitados con email para enviar notificaciones', 
          type: 'error' 
        })
        return
      }
      
      let successCount = 0
      let errorCount = 0
      
      for (const guest of guestsWithEmail) {
        try {
          const response = await fetch('/api/send-album-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              guestName: guest.full_name,
              guestEmail: guest.email || '',
            }),
          })
          
          const result = await response.json()
          
          if (result.success) {
            successCount++
          } else {
            errorCount++
          }
        } catch (e) {
          errorCount++
        }
      }
      
      if (successCount > 0) {
        setToast({ 
          message: `Notificaciones de álbumes enviadas: ${successCount} exitosas${errorCount > 0 ? `, ${errorCount} con error` : ''}`, 
          type: 'success' 
        })
      } else {
        setToast({ 
          message: 'Error al enviar notificaciones de álbumes', 
          type: 'error' 
        })
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      setToast({ message: 'Error al enviar notificaciones de álbumes', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()

  const filteredGuests = guests.filter((g) => {
    const matchesQuery = searchQuery.trim()
      ? normalize(g.full_name).includes(normalize(searchQuery))
      : true

    const isConfirmed = g.rsvp_status === 'confirmed'
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'confirmed'
        ? isConfirmed
        : !isConfirmed

    return matchesQuery && matchesFilter
  })

  const confirmed = guests.filter((g) => g.rsvp_status === 'confirmed')
  const pending = guests.filter((g) => g.rsvp_status === 'pending')
  const declined = guests.filter((g) => g.rsvp_status === 'declined')

  // Paginación
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedGuests = filteredGuests.slice(startIndex, endIndex)

  // Resetear página cuando cambia el filtro o búsqueda
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filter])

  return (
    <main className="min-h-screen" style={{ background: '#050308' }}>
      <NeonAmbience />

      {/* ── Nav ── */}
      <nav
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 py-4"
        style={{
          background: 'rgba(5,3,8,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(168,85,247,0.1)',
        }}
      >
        <Link href="/admin">
          <span
            className="font-sans font-black italic text-lg"
            style={{
              background: 'linear-gradient(135deg, #f9a8d4, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Isabella XV
          </span>
        </Link>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.2)',
            color: 'rgba(192,132,252,0.8)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#a855f7', boxShadow: '0 0 6px #a855f7' }}
          />
          Admin
        </div>
      </nav>

      <div className="relative pt-24 pb-20 px-5 max-w-6xl mx-auto flex flex-col gap-6">

        {/* ── Page title ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="pt-2"
        >
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase mb-2"
            style={{ color: '#c084fc', fontFamily: 'var(--font-body)' }}
          >
            Panel de control
          </p>
          <h1
            className="font-sans font-black italic"
            style={{
              fontSize: 'clamp(2rem, 10vw, 3.5rem)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(192,132,252,0.3))',
            }}
          >
            Invitados
          </h1>
          <Link href="/admin" className="inline-flex items-center gap-2 mt-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              style={{
                background: 'rgba(168,85,247,0.1)',
                border: '1px solid rgba(168,85,247,0.2)',
                color: 'rgba(192,132,252,0.8)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al menú
            </motion.div>
          </Link>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl p-3 text-center"
            style={{
              background: 'rgba(168,85,247,0.07)',
              border: '1px solid rgba(168,85,247,0.18)',
            }}
          >
            <p className="font-sans font-black italic text-2xl" style={{ color: 'rgb(168,85,247)' }}>
              {guests.length}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(168,85,247,0.7)', fontFamily: 'var(--font-body)' }}>
              Total
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl p-3 text-center"
            style={{
              background: 'rgba(34,197,94,0.07)',
              border: '1px solid rgba(34,197,94,0.18)',
            }}
          >
            <p className="font-sans font-black italic text-2xl" style={{ color: 'rgb(34,197,94)' }}>
              {confirmed.length}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(34,197,94,0.7)', fontFamily: 'var(--font-body)' }}>
              Confirmados
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl p-3 text-center"
            style={{
              background: 'rgba(251,191,36,0.07)',
              border: '1px solid rgba(251,191,36,0.18)',
            }}
          >
            <p className="font-sans font-black italic text-2xl" style={{ color: 'rgb(251,191,36)' }}>
              {pending.length}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(251,191,36,0.7)', fontFamily: 'var(--font-body)' }}>
              Pendientes
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="rounded-xl p-3 text-center"
            style={{
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.18)',
            }}
          >
            <p className="font-sans font-black italic text-2xl" style={{ color: 'rgb(239,68,68)' }}>
              {declined.length}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(239,68,68,0.7)', fontFamily: 'var(--font-body)' }}>
              Rechazados
            </p>
          </motion.div>
        </div>

        {/* ── Search & Filter ── */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar invitado…"
              className="w-full pl-10 pr-4 py-3 rounded-xl outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.9)',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all' as const, label: 'Todos', color: '255,255,255' },
              { key: 'confirmed' as const, label: 'Confirmados', color: '34,197,94' },
              { key: 'pending' as const, label: 'Pendientes', color: '251,191,36' },
              { key: 'declined' as const, label: 'Rechazados', color: '239,68,68' },
            ].map((f) => {
              const active = filter === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300"
                  style={{
                    background: active ? `rgba(${f.color},0.12)` : 'rgba(255,255,255,0.02)',
                    border: active ? `1px solid rgba(${f.color},0.3)` : '1px solid rgba(255,255,255,0.06)',
                    color: active ? `rgb(${f.color})` : 'rgba(255,255,255,0.45)',
                    fontFamily: 'var(--font-body)',
                  }}
                  type="button"
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Add Guest Button ── */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingGuest(undefined)
            setIsModalOpen(true)
          }}
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
            border: '1px solid rgba(168,85,247,0.3)',
            color: 'white',
            fontFamily: 'var(--font-body)',
          }}
        >
          <UserPlus className="w-4 h-4" />
          Agregar invitado
        </motion.button>

        {/* ── Mass Send Invitations Button ── */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleMassSendInvitations}
          disabled={saving}
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: '1px solid rgba(16,185,129,0.3)',
            color: 'white',
            fontFamily: 'var(--font-body)',
            opacity: saving ? 0.6 : 1,
          }}
        >
          <Mail className="w-4 h-4" />
          {saving ? 'Enviando...' : 'Enviar invitaciones masivas'}
        </motion.button>

        {/* ── Mass Send Album Notifications Button ── */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleMassSendAlbumNotifications}
          disabled={saving}
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            border: '1px solid rgba(139,92,246,0.3)',
            color: 'white',
            fontFamily: 'var(--font-body)',
            opacity: saving ? 0.6 : 1,
          }}
        >
          <Mail className="w-4 h-4" />
          {saving ? 'Enviando...' : 'Enviar notificaciones de álbumes'}
        </motion.button>

        {/* ── Error ── */}
        {error && (
          <div
            className="rounded-xl px-4 py-3"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <p className="text-xs font-semibold">Error</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{error}</p>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div
            className="rounded-xl px-4 py-3"
            style={{
              background: 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.2)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <p className="text-xs font-semibold">Cargando invitados…</p>
          </div>
        )}

        {/* ── Guests DataTable ── */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(10,5,20,0.8)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div
              className="h-px w-full"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.55), rgba(168,85,247,0.55), transparent)',
                boxShadow: '0 0 12px rgba(168,85,247,0.25)',
              }}
            />
            
            {filteredGuests.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(168,85,247,0.08)',
                    border: '1px solid rgba(168,85,247,0.15)',
                  }}
                >
                  <UserPlus className="w-5 h-5" style={{ color: 'rgba(192,132,252,0.4)' }} />
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-body)' }}>
                  {searchQuery || filter !== 'all' ? 'No se encontraron invitados' : 'No hay invitados registrados'}
                </p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold" style={{ 
                  background: 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-body)'
                }}>
                  <div className="col-span-2">Nombre</div>
                  <div className="col-span-2">Email</div>
                  <div className="col-span-1">Mesa</div>
                  <div className="col-span-2">Estado</div>
                  <div className="col-span-3">Mensaje</div>
                  <div className="col-span-2 text-right">Acciones</div>
                </div>
                
                {/* Table Body */}
                <div className="max-h-[400px] overflow-y-auto">
                  {paginatedGuests.map((guest, idx) => {
                    const isConfirmed = guest.rsvp_status === 'confirmed'
                    const isDeclined = guest.rsvp_status === 'declined'
                    return (
                      <div
                        key={guest.id}
                        className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-2 px-4 py-3 sm:items-center"
                        style={{
                          background: idx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <div className="sm:col-span-2">
                          <span className="sm:hidden text-xs font-semibold text-white/40 mb-1 block" style={{ fontFamily: 'var(--font-body)' }}>Nombre</span>
                          <p className="text-sm font-semibold text-white/85 truncate" style={{ fontFamily: 'var(--font-body)' }}>
                            {guest.full_name}
                          </p>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="sm:hidden text-xs font-semibold text-white/40 mb-1 block" style={{ fontFamily: 'var(--font-body)' }}>Email</span>
                          <p className="text-sm truncate" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                            {guest.email || '—'}
                          </p>
                        </div>
                        <div className="sm:col-span-1">
                          <span className="sm:hidden text-xs font-semibold text-white/40 mb-1 block" style={{ fontFamily: 'var(--font-body)' }}>Mesa</span>
                          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                            {guest.table_number ? String(guest.table_number).padStart(2, '0') : '—'}
                          </p>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="sm:hidden text-xs font-semibold text-white/40 mb-1 block" style={{ fontFamily: 'var(--font-body)' }}>Estado</span>
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold"
                            style={{
                              background: isConfirmed ? 'rgba(34,197,94,0.12)' : isDeclined ? 'rgba(239,68,68,0.12)' : 'rgba(251,191,36,0.12)',
                              border: isConfirmed ? '1px solid rgba(34,197,94,0.28)' : isDeclined ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(251,191,36,0.3)',
                              color: isConfirmed ? '#4ade80' : isDeclined ? '#f87171' : '#fbbf24',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            {isConfirmed ? <Check className="w-3 h-3" /> : isDeclined ? <X className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {isConfirmed ? 'Confirmado' : isDeclined ? 'Rechazado' : 'Pendiente'}
                          </span>
                        </div>
                        <div className="sm:col-span-3">
                          <span className="sm:hidden text-xs font-semibold text-white/40 mb-1 block" style={{ fontFamily: 'var(--font-body)' }}>Mensaje</span>
                          {guest.rsvp_message ? (
                            <p 
                              className="text-sm cursor-pointer" 
                              style={{ 
                                color: 'rgba(255,255,255,0.6)', 
                                fontFamily: 'var(--font-body)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '100%'
                              }}
                              onClick={() => setDetailsGuest(guest)}
                            >
                              {guest.rsvp_message}
                            </p>
                          ) : (
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
                              —
                            </p>
                          )}
                        </div>
                        <div className="sm:col-span-2 flex items-center justify-end sm:justify-end">
                          <span className="sm:hidden text-xs font-semibold text-white/40 mb-1 block w-full" style={{ fontFamily: 'var(--font-body)' }}>Acciones</span>
                          <ActionMenu
                            guest={guest}
                            onEdit={() => {
                              setEditingGuest(guest)
                              setIsModalOpen(true)
                            }}
                            onDelete={() => handleDeleteGuest(guest)}
                            onToggleRSVP={() => handleToggleRSVP(guest)}
                            onSendInvitation={() => handleSendInvitation(guest)}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3" style={{ 
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.02)'
                  }}>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}>
                      Mostrando {startIndex + 1}-{Math.min(endIndex, filteredGuests.length)} de {filteredGuests.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg"
                        style={{
                          background: currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(168,85,247,0.12)',
                          border: currentPage === 1 ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(168,85,247,0.3)',
                          color: currentPage === 1 ? 'rgba(255,255,255,0.3)' : 'rgba(192,132,252,0.8)',
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </motion.button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                          
                          return (
                            <motion.button
                              key={pageNum}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 rounded-lg text-xs font-semibold"
                              style={{
                                background: currentPage === pageNum ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                                border: currentPage === pageNum ? '1px solid rgba(168,85,247,0.4)' : '1px solid rgba(255,255,255,0.1)',
                                color: currentPage === pageNum ? 'rgba(192,132,252,0.9)' : 'rgba(255,255,255,0.5)',
                                fontFamily: 'var(--font-body)',
                              }}
                            >
                              {pageNum}
                            </motion.button>
                          )
                        })}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg"
                        style={{
                          background: currentPage === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(168,85,247,0.12)',
                          border: currentPage === totalPages ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(168,85,247,0.3)',
                          color: currentPage === totalPages ? 'rgba(255,255,255,0.3)' : 'rgba(192,132,252,0.8)',
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

      </div>

      {/* ── Modal ── */}
      <GuestFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          if (editingGuest) {
            handleUpdateGuest(editingGuest.id, data)
          } else {
            handleCreateGuest(data)
          }
        }}
        guest={editingGuest}
      />

      {/* ── Delete Confirmation Modal ── */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setGuestToDelete(undefined)
        }}
        onConfirm={confirmDeleteGuest}
        guestName={guestToDelete?.full_name || ''}
        isConfirmed={guestToDelete?.rsvp_status === 'confirmed'}
      />

      {/* ── Guest Details Modal ── */}
      <AnimatePresence>
        {detailsGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setDetailsGuest(undefined)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md"
              style={{
                background: 'rgba(10,5,20,0.95)',
                border: '1px solid rgba(168,85,247,0.3)',
                borderRadius: '16px',
                backdropFilter: 'blur(24px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold" style={{ color: '#ffffff', fontFamily: 'var(--font-body)' }}>
                    Detalles del Invitado
                  </h2>
                  <button
                    onClick={() => setDetailsGuest(undefined)}
                    className="p-2 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.6)' }} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                      Nombre
                    </div>
                    <div className="text-base" style={{ color: '#ffffff', fontFamily: 'var(--font-body)' }}>
                      {detailsGuest.full_name}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                      Email
                    </div>
                    <div className="text-base" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}>
                      {detailsGuest.email || '—'}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                      Mesa
                    </div>
                    <div className="text-base" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}>
                      {detailsGuest.table_number ? String(detailsGuest.table_number).padStart(2, '0') : '—'}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                      Estado
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: detailsGuest.rsvp_status === 'confirmed' ? 'rgba(34,197,94,0.12)' : detailsGuest.rsvp_status === 'declined' ? 'rgba(239,68,68,0.12)' : 'rgba(251,191,36,0.12)',
                        border: detailsGuest.rsvp_status === 'confirmed' ? '1px solid rgba(34,197,94,0.28)' : detailsGuest.rsvp_status === 'declined' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(251,191,36,0.3)',
                        color: detailsGuest.rsvp_status === 'confirmed' ? '#4ade80' : detailsGuest.rsvp_status === 'declined' ? '#f87171' : '#fbbf24',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {detailsGuest.rsvp_status === 'confirmed' ? <Check className="w-3 h-3" /> : detailsGuest.rsvp_status === 'declined' ? <X className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {detailsGuest.rsvp_status === 'confirmed' ? 'Confirmado' : detailsGuest.rsvp_status === 'declined' ? 'Rechazado' : 'Pendiente'}
                    </span>
                  </div>

                  {detailsGuest.rsvp_message && (
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                        Mensaje
                      </div>
                      <div 
                        className="text-base p-3 rounded-lg"
                        style={{ 
                          color: 'rgba(255,255,255,0.9)', 
                          fontFamily: 'var(--font-body)',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          wordWrap: 'break-word',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {detailsGuest.rsvp_message}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}