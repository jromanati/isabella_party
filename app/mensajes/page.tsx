'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import Link from 'next/link'

import type { GuestMessage, GuestMessageCreate } from '@/types/guest-message'
import { GuestMessageAdapter } from '@/services/guest-message-adapter.service'
import { AuthService } from '@/services/auth.service'
import { EventService } from '@/services/event.service'
import type { Guest } from '@/types/guest'
import GuestSelector from '@/components/guest-selector'

function MessageCard({ message }: { message: GuestMessage }) {
  return (
    <Card
      className="border-white/10 bg-black/30"
      style={{ boxShadow: '0 0 30px rgba(192,132,252,0.10)' }}
    >
      <CardContent className="pt-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <p className="font-semibold text-white/90">{message.title}</p>
                {message.is_featured && (
                  <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30">⭐ Destacado</Badge>
                )}
                <Badge 
                  className={
                    message.message_type === 'wishes' ? 'bg-pink-500/20 text-pink-200 border-pink-400/30' :
                    message.message_type === 'memory' ? 'bg-purple-500/20 text-purple-200 border-purple-400/30' :
                    message.message_type === 'advice' ? 'bg-blue-500/20 text-blue-200 border-blue-400/30' :
                    message.message_type === 'toast' ? 'bg-green-500/20 text-green-200 border-green-400/30' :
                    'bg-orange-500/20 text-orange-200 border-orange-400/30'
                  }
                >
                  {message.message_type === 'wishes' ? 'Deseos' :
                   message.message_type === 'memory' ? 'Recuerdo' :
                   message.message_type === 'advice' ? 'Consejo' :
                   message.message_type === 'toast' ? 'Brindis' : 'Dedicatoria'}
                </Badge>
              </div>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <p className="text-xs text-white/60">
              De: <span className="text-white/80">{message.author_name}</span>
            </p>
            <p className="text-xs text-white/40">
              {new Date(message.created_at).toLocaleDateString('es-MX', { 
                day: 'numeric', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MessageUploadCard({
  eventProfile,
  onUpload,
  selectedGuest,
  setSelectedGuest,
  title,
  setTitle,
  message,
  setMessage,
  submitting,
  setSubmitting,
  success,
  setSuccess,
  error,
  setError,
}: {
  eventProfile: any
  onUpload: (
    guest: Guest,
    messageData: Omit<GuestMessageCreate, 'guest' | 'author_name'>
  ) => Promise<{ status: 'approved' | 'pending' | 'rejected' }>
  selectedGuest: Guest | null
  setSelectedGuest: (guest: Guest | null) => void
  title: string
  setTitle: (title: string) => void
  message: string
  setMessage: (message: string) => void
  submitting: boolean
  setSubmitting: (submitting: boolean) => void
  success: string | null
  setSuccess: (success: string | null) => void
  error: string | null
  setError: (error: string | null) => void
}) {

  // Valores fijos
  const recipientType: GuestMessageCreate['recipient_type'] = 'celebrant'
  const messageType: GuestMessageCreate['message_type'] = 'text'

  const handleSubmit = async () => {
    if (!selectedGuest) {
      setError('Por favor selecciona tu nombre de la lista.')
      return
    }

    if (!title.trim()) {
      setError('Por favor escribe un título para tu mensaje.')
      return
    }

    if (!message.trim()) {
      setError('Por favor escribe tu mensaje.')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await onUpload(selectedGuest, {
        recipient_type: recipientType,
        message_type: messageType,
        author_type: 'guest',
        title: title.trim(),
        message: message.trim(),
        is_public: true,
        is_featured: false,
        used_in_album: false,
        media_urls: [],
        tags: [],
        metadata: {}
      })

      setSuccess(result.status === 'approved' ? '¡Tu mensaje ha sido aprobado y publicado!' : 
               result.status === 'pending' ? 'Tu mensaje ha sido enviado y está pendiente de aprobación.' :
               'Tu mensaje no pudo ser aprobado.')

      // Limpiar formulario
      setSelectedGuest(null)
      setTitle('')
      setMessage('')
    } catch (err) {
      setError('Error al enviar el mensaje. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="border border-white/10 bg-black/35 rounded-xl p-6 flex flex-col gap-4">
      <h3 className="text-white/90 font-semibold">Escribe tu mensaje</h3>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-white/60">Tu nombre</p>
          <GuestSelector
            value={selectedGuest?.id?.toString() || ''}
            onChange={setSelectedGuest}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs text-white/60">Título</p>
          <input
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Ej: Feliz cumpleaños"
            className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs text-white/60">Tu mensaje</p>
          <textarea
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            placeholder="Escribe aquí tus deseos, recuerdos o consejos..."
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none"
          />
          <p className="text-xs text-white/40 text-right">
            {message.length}/500 caracteres
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !selectedGuest?.id || !title.trim() || !message.trim()}
            className="bg-purple-500/15 hover:bg-purple-500/20 text-white border border-purple-400/25"
          >
            {submitting ? 'Enviando...' : 'Enviar mensaje'}
          </Button>
        </div>

        {error && (
          <p className="text-sm" style={{ color: 'rgba(248,113,113,0.95)' }}>
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm" style={{ color: 'rgba(167,243,208,0.95)' }}>
            {success}
          </p>
        )}
      </div>
    </div>
  )
}

export default function MensajesPage() {
  const [eventProfile, setEventProfile] = useState<any>(null)
  const [messages, setMessages] = useState<GuestMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estados del formulario
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  // Cargar perfil del evento
  useEffect(() => {
    const loadEventProfile = async () => {
      try {
        const token = await AuthService.getValidToken()
        if (!token) return

        const response = await EventService.getEventProfile()
        if (response.success && response.data) {
          setEventProfile(response.data)
        }
      } catch (err) {
        console.error('Error loading event profile:', err)
      }
    }

    loadEventProfile()
  }, [])

  // Cargar mensajes públicos aprobados
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = await AuthService.getValidToken()
        if (!token) return

        const response = await GuestMessageAdapter.getPublicMessages()
        
        if (response.success && response.data) {
          setMessages(response.data)
        } else {
          setError(response.error || 'Error al cargar mensajes')
        }
      } catch (err) {
        setError('Error al cargar los mensajes')
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [])

  const handleUpload = async (
    guest: Guest,
    messageData: Omit<GuestMessageCreate, 'guest' | 'author_name'>
  ): Promise<{ status: 'approved' | 'pending' | 'rejected' }> => {
    const token = await AuthService.getValidToken()
    if (!token) {
      throw new Error('No se pudo autenticar')
    }

    const messageRequest: GuestMessageCreate = {
      guest: guest.id,
      author_name: guest.full_name,
      ...messageData
    }

    const response = await GuestMessageAdapter.createGuestMessage(messageRequest)

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Error al enviar mensaje')
    }

    // Recargar mensajes
    const messagesResponse = await GuestMessageAdapter.getPublicMessages()
    if (messagesResponse.success && messagesResponse.data) {
      setMessages(messagesResponse.data)
    }

    return {
      status: response.data.status === 'hidden' ? 'rejected' as const : response.data.status
    }
  }

  return (
    <main className="min-h-screen" style={{ background: '#050308' }}>
      {/* ── Background ambience ── */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236,72,153,0.15) 0%, transparent 70%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(96,165,250,0.12) 0%, transparent 70%)',
        }}
      />

      {/* ── Nav ── */}
      <nav
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 py-4"
        style={{
          background: 'rgba(5,3,8,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black italic text-white">Libro de Mensajes</h1>
        </div>
      </nav>

      {/* ── Content ── */}
      <div className="pt-24 pb-10 px-5">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <header className="text-center">
            <p className="text-xs font-semibold tracking-[0.35em] uppercase neon-purple">Libro de mensajes</p>
            <h1
              className="mt-3 font-sans font-black italic leading-tight"
              style={{
                fontSize: 'clamp(2.2rem, 8vw, 3.4rem)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #c084fc 70%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 26px rgba(192,132,252,0.35))',
              }}
            >
              Deja tu mensaje especial
            </h1>
            <p className="mt-3 text-white/55" style={{ fontFamily: 'var(--font-body)' }}>
              Comparte tus deseos, recuerdos y consejos para este momento especial.
            </p>
          </header>

          {/* Formulario de envío */}
          {eventProfile && (
            <MessageUploadCard
              eventProfile={eventProfile}
              onUpload={handleUpload}
              selectedGuest={selectedGuest}
              setSelectedGuest={setSelectedGuest}
              title={title}
              setTitle={setTitle}
              message={message}
              setMessage={setMessage}
              submitting={submitting}
              setSubmitting={setSubmitting}
              success={success}
              setSuccess={setSuccess}
              error={error}
              setError={setError}
            />
          )}

          {/* Lista de mensajes */}
          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-lg font-semibold text-white/90">Mensajes compartidos</h2>
              <p className="text-sm text-white/40">
                {messages.length} mensaje{messages.length !== 1 ? 's' : ''}
              </p>
            </div>

            {loading ? (
              <p className="text-sm text-white/40">Cargando mensajes...</p>
            ) : error ? (
              <p className="text-sm" style={{ color: 'rgba(248,113,113,0.95)' }}>{error}</p>
            ) : messages.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-8">
                Aún no hay mensajes. ¡Sé el primero en compartir tus deseos!
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {messages.map((msg) => (
                  <MessageCard key={msg.id} message={msg} />
                ))}
              </div>
            )}
          </section>

        {/* ── Footer nav ── */}
        <div className="flex justify-center pb-4">
          <Link href="/guest">
            <motion.span
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300"
              style={{
                background: 'rgba(168,85,247,0.08)',
                border: '1px solid rgba(168,85,247,0.4)',
                color: '#c084fc',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 0 18px rgba(168,85,247,0.2), inset 0 0 18px rgba(168,85,247,0.04)',
                cursor: 'pointer',
                textShadow: '0 0 12px rgba(192,132,252,0.6)',
              }}
            >
              ← Volver al menú
            </motion.span>
          </Link>
        </div>
        </div>
      </div>
    </main>
  )
}
