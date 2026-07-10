'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Eye, Lock, Unlock, Clock, LayoutGrid, MessageSquare, Trash2, User, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { GuestMessageAdapter } from '@/services/guest-message-adapter.service'
import { AuthService } from '@/services/auth.service'
import { GuestService } from '@/services/guest.service'
import { useAutoMarkAsReviewed } from '@/hooks/useAutoMarkAsReviewed'
import type { GuestMessage } from '@/types/guest-message'

// ── Neon ambience (same pattern as other admin pages) ────────────────────
function NeonAmbience() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh]"
        style={{
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[40vw] h-[30vh]"
        style={{
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}

// ── Neon Toggle Switch ────────────────────────────────────────
function NeonToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      style={{
        background: enabled 
          ? 'linear-gradient(135deg, rgba(168,85,247,0.8), rgba(59,130,246,0.8))' 
          : 'rgba(255,255,255,0.1)',
        boxShadow: enabled ? '0 0 20px rgba(168,85,247,0.4)' : 'none',
      }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        style={{
          transform: enabled ? 'translateX(1.25rem)' : 'translateX(0.25rem)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  )
}

// ── Message Card ──────────────────────────────────────────────
function MessageCard({
  message,
  onUpdateStatus,
  savingMessageId,
}: {
  message: GuestMessage
  onUpdateStatus: (id: number, status: 'approved' | 'rejected' | 'hidden') => void
  savingMessageId: number | null
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleApprove = () => onUpdateStatus(message.id, 'approved')
  const handleReject = () => onUpdateStatus(message.id, 'rejected')
  const handleHide = () => onUpdateStatus(message.id, 'hidden')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative rounded-2xl border border-white/10 overflow-hidden bg-black/40 backdrop-blur-md"
      style={{
        boxShadow: '0 0 40px rgba(168,85,247,0.1)',
      }}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className="px-3 py-1 rounded-full text-xs font-semibold border"
          style={{
            background: message.status === 'approved' 
              ? 'rgba(34,197,94,0.2)' 
              : message.status === 'rejected'
              ? 'rgba(239,68,68,0.2)'
              : 'rgba(168,85,247,0.2)',
            borderColor: message.status === 'approved'
              ? 'rgba(34,197,94,0.5)'
              : message.status === 'rejected'
              ? 'rgba(239,68,68,0.5)'
              : 'rgba(168,85,247,0.5)',
            color: message.status === 'approved'
              ? 'rgb(134,239,172)'
              : message.status === 'rejected'
              ? 'rgb(252,165,165)'
              : 'rgb(196,181,253)',
          }}
        >
          {message.status === 'approved' ? 'Aprobado' : 
           message.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
        </div>
      </div>

      {/* Message Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {message.author_name || 'Invitado'}
              </h3>
              <p className="text-xs text-white/60">
                Para: {message.recipient_type === 'celebrant' ? 'La cumpleañera' : 
                       message.recipient_type === 'couple' ? 'La pareja' :
                       message.recipient_type === 'family' ? 'La familia' : 'Todos'}
              </p>
            </div>
          </div>
          <p className="text-xs text-white/40">
            {new Date(message.created_at).toLocaleDateString('es-MX', { 
              day: 'numeric', 
              month: 'short', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>

        {/* Title */}
        <h4 className="text-lg font-semibold text-white mb-2">
          {message.title}
        </h4>

        {/* Message */}
        <div className="text-white/80 mb-4">
          <p className={isExpanded ? '' : 'line-clamp-3'}>
            {message.message}
          </p>
          {message.message.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-purple-400 hover:text-purple-300 mt-2"
            >
              {isExpanded ? 'Mostrar menos' : 'Mostrar más'}
            </button>
          )}
        </div>

        {/* AI Analysis */}
        {message.ai_moderation_reason && (
          <div className="mb-4 p-3 rounded-lg border border-white/10 bg-white/5">
            <p className="text-xs text-white/60 mb-1">Análisis de IA:</p>
            <p className="text-xs text-white/80">{message.ai_moderation_reason}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mostrar acciones disponibles según el estado actual */}
          {message.status === 'pending' && (
            <>
              <button
                onClick={handleApprove}
                disabled={savingMessageId === message.id}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: savingMessageId === message.id 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(34,197,94,0.2)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: 'rgb(134,239,172)',
                  opacity: savingMessageId === message.id ? 0.6 : 1,
                }}
              >
                {savingMessageId === message.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Aprobar
                  </>
                )}
              </button>

              <button
                onClick={handleReject}
                disabled={savingMessageId === message.id}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: savingMessageId === message.id 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(239,68,68,0.2)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: 'rgb(252,165,165)',
                  opacity: savingMessageId === message.id ? 0.6 : 1,
                }}
              >
                {savingMessageId === message.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Rechazar
                  </>
                )}
              </button>

              <button
                onClick={handleHide}
                disabled={savingMessageId === message.id}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: savingMessageId === message.id 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(168,85,247,0.2)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  color: 'rgb(196,181,253)',
                  opacity: savingMessageId === message.id ? 0.6 : 1,
                }}
              >
                {savingMessageId === message.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Ocultar
                  </>
                )}
              </button>
            </>
          )}

          {message.status === 'approved' && (
            <>
              <button
                onClick={handleReject}
                disabled={savingMessageId === message.id}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: savingMessageId === message.id 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(239,68,68,0.2)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: 'rgb(252,165,165)',
                  opacity: savingMessageId === message.id ? 0.6 : 1,
                }}
              >
                {savingMessageId === message.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Rechazar
                  </>
                )}
              </button>

              <button
                onClick={handleHide}
                disabled={savingMessageId === message.id}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: savingMessageId === message.id 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(168,85,247,0.2)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  color: 'rgb(196,181,253)',
                  opacity: savingMessageId === message.id ? 0.6 : 1,
                }}
              >
                {savingMessageId === message.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Ocultar
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-xs text-white/60">
                <Check className="w-4 h-4 text-green-400" />
                <span>Aprobado</span>
              </div>
            </>
          )}

          {message.status === 'rejected' && (
            <>
              <button
                onClick={handleApprove}
                disabled={savingMessageId === message.id}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: savingMessageId === message.id 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(34,197,94,0.2)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: 'rgb(134,239,172)',
                  opacity: savingMessageId === message.id ? 0.6 : 1,
                }}
              >
                {savingMessageId === message.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Aprobar
                  </>
                )}
              </button>

              <button
                onClick={handleHide}
                disabled={savingMessageId === message.id}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: savingMessageId === message.id 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(168,85,247,0.2)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  color: 'rgb(196,181,253)',
                  opacity: savingMessageId === message.id ? 0.6 : 1,
                }}
              >
                {savingMessageId === message.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Ocultar
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-xs text-white/60">
                <X className="w-4 h-4 text-red-400" />
                <span>Rechazado</span>
              </div>
            </>
          )}

          {message.status === 'hidden' && (
            <>
              <button
                onClick={handleApprove}
                disabled={savingMessageId === message.id}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: savingMessageId === message.id 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(34,197,94,0.2)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: 'rgb(134,239,172)',
                  opacity: savingMessageId === message.id ? 0.6 : 1,
                }}
              >
                {savingMessageId === message.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Aprobar
                  </>
                )}
              </button>

              <button
                onClick={handleReject}
                disabled={savingMessageId === message.id}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: savingMessageId === message.id 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(239,68,68,0.2)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: 'rgb(252,165,165)',
                  opacity: savingMessageId === message.id ? 0.6 : 1,
                }}
              >
                {savingMessageId === message.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Rechazar
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-xs text-white/60">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>Oculto</span>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────
type Tab = 'pending' | 'approved' | 'rejected' | 'hidden'

export default function AdminMensajesPage() {
  // Auto-marcar mensajes como revisados cuando se entra a esta página
  useAutoMarkAsReviewed()

  const [messages, setMessages] = useState<GuestMessage[]>([])
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [messagesError, setMessagesError] = useState<string | null>(null)
  const [savingMessageId, setSavingMessageId] = useState<number | null>(null)

  const [activeTab, setActiveTab] = useState<Tab>('pending')

  const pending = messages.filter((m) => m.status === 'pending')
  const approved = messages.filter((m) => m.status === 'approved')
  const rejected = messages.filter((m) => m.status === 'rejected')
  const hidden = messages.filter((m) => m.status === 'hidden')

  const tabMessages: Record<Tab, GuestMessage[]> = {
    pending,
    approved,
    rejected,
    hidden,
  }

  const tabConfig: { key: Tab; label: string; count: number; color: string }[] = [
    { key: 'pending', label: 'Pendientes', count: pending.length, color: '168,85,247' },
    { key: 'approved', label: 'Aprobados', count: approved.length, color: '34,197,94' },
    { key: 'rejected', label: 'Rechazados', count: rejected.length, color: '239,68,68' },
    { key: 'hidden', label: 'Ocultos', count: hidden.length, color: '168,85,247' },
  ]

  // Cargar mensajes
  useEffect(() => {
    let cancelled = false

    const loadMessages = async () => {
      try {
        setMessagesLoading(true)
        setMessagesError(null)

        const response = await GuestMessageAdapter.getGuestMessages()
        
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Error al cargar mensajes')
        }
        
        if (cancelled) return

        setMessages(response.data)
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        if (!cancelled) setMessagesError(message)
      } finally {
        if (!cancelled) setMessagesLoading(false)
      }
    }

    loadMessages()

    return () => {
      cancelled = true
    }
  }, [])

  // Actualizar status de mensaje
  const updateStatus = async (id: number, status: 'approved' | 'rejected' | 'hidden') => {
    if (savingMessageId) return

    const prev = messages
    setSavingMessageId(id)
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, status } : x)))

    try {
      const response = await GuestMessageAdapter.updateGuestMessage(id, { status })
      
      if (!response.success) {
        throw new Error(response.error || 'Error actualizando status de mensaje')
      }
    } catch (e) {
      setMessages(prev)
      const message = e instanceof Error ? e.message : String(e)
      setMessagesError(message)
    } finally {
      setSavingMessageId(null)
    }
  }

  return (
    <main className="min-h-screen w-full overflow-hidden" style={{ background: '#050308' }}>
      <NeonAmbience />

      {/* Header */}
      <div className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 
                  className="text-3xl font-black italic"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #c084fc 70%, #818cf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Administración de Mensajes
                </h1>
                <p className="mt-2 text-white/60" style={{ fontFamily: 'var(--font-body)' }}>
                  Revisa y aprueba los mensajes de los invitados
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Link
                  href="/admin-galeria"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all"
                  style={{
                    background: 'rgba(59,130,246,0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Galería</span>
                </Link>
              </div>
            </div>

            <Link
              href="/"
              className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1">
            {tabConfig.map(({ key, label, count, color }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative px-6 py-4 font-medium transition-all ${
                  activeTab === key ? 'text-white' : 'text-white/60 hover:text-white/80'
                }`}
                style={{
                  borderBottom: activeTab === key 
                    ? `2px solid rgb(${color})` 
                    : '2px solid transparent',
                }}
              >
                {label}
                {count > 0 && (
                  <span 
                    className="ml-2 px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: `rgba(${color}, 0.2)`,
                      color: `rgb(${color})`,
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {messagesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60">Cargando mensajes...</p>
            </div>
          </div>
        ) : messagesError ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-400 mb-4">{messagesError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : tabMessages[activeTab].length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">
                {activeTab === 'pending' && 'No hay mensajes pendientes'}
                {activeTab === 'approved' && 'No hay mensajes aprobados'}
                {activeTab === 'rejected' && 'No hay mensajes rechazados'}
                {activeTab === 'hidden' && 'No hay mensajes ocultos'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {tabMessages[activeTab].map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onUpdateStatus={updateStatus}
                  savingMessageId={savingMessageId}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  )
}
