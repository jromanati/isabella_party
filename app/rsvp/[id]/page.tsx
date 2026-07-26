'use client'

import { useEffect, useState, use } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Clock, Loader2 } from 'lucide-react'
import { GuestAdapter } from '@/services/guest-adapter.service'
import type { Guest } from '@/types/guest'

export default function RsvpConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'confirmed' | 'declined' | null>(null)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const loadGuest = async () => {
      try {
        setLoading(true)
        const response = await GuestAdapter.getGuests()
        
        if (!response.success || !response.data) {
          throw new Error('Error al cargar invitado')
        }
        
        const foundGuest = response.data.find(g => String(g.id) === id)
        if (!foundGuest) {
          throw new Error('Invitado no encontrado')
        }
        
        setGuest(foundGuest)
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadGuest()
  }, [id])

  const handleSubmit = async () => {
    if (!guest || !status) return

    try {
      setSubmitting(true)
      const response = await GuestAdapter.updateGuest(guest.id, {
        full_name: guest.full_name,
        table: guest.table_number || null,
        rsvp_status: status,
        rsvp_message: message || null,
      })

      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar RSVP')
      }

      // Enviar notificación a los administradores
      await fetch('/api/notify-rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestName: guest.full_name,
          tableNumber: guest.table_number,
          status,
          message: message || null,
        }),
      })

      setSubmitted(true)
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: "url('/isabella-hero-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0" style={{ background: 'rgba(5,3,8,0.85)' }} />
        <div className="relative flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#a855f7' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
            Cargando...
          </p>
        </div>
      </div>
    )
  }

  if (error || !guest) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundImage: "url('/isabella-hero-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0" style={{ background: 'rgba(5,3,8,0.85)' }} />
        <div className="relative text-center">
          <p style={{ color: '#f87171', fontFamily: 'var(--font-body)' }}>
            {error || 'Invitado no encontrado'}
          </p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundImage: "url('/isabella-hero-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0" style={{ background: 'rgba(5,3,8,0.85)' }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative text-center max-w-md"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: status === 'confirmed' ? 'rgba(34,197,94,0.12)' : 'rgba(251,191,36,0.12)',
              border: status === 'confirmed' ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(251,191,36,0.3)',
            }}
          >
            {status === 'confirmed' ? (
              <Check className="w-10 h-10" style={{ color: '#4ade80' }} />
            ) : (
              <X className="w-10 h-10" style={{ color: '#fbbf24' }} />
            )}
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: '#ffffff', fontFamily: 'var(--font-body)' }}
          >
            {status === 'confirmed' ? '¡Gracias por confirmar!' : 'Lamentamos que no puedas asistir'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)' }}>
            Tu respuesta ha sido registrada exitosamente.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ backgroundImage: "url('/isabella-hero-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0" style={{ background: 'rgba(5,3,8,0.85)' }} />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center mb-8 w-full"
      >
        <h1 
          className="text-5xl md:text-6xl font-black italic tracking-tight mb-2 px-4"
          style={{ 
            color: '#ffffff',
            fontFamily: 'var(--font-body)',
            textShadow: '0 0 40px rgba(168,85,247,0.5), 0 0 80px rgba(236,72,153,0.3)',
            background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            whiteSpace: 'nowrap'
          }}
        >
          Isabella XV
        </h1>
        <div 
          className="text-sm font-semibold tracking-[0.4em] uppercase"
          style={{ 
            color: 'rgba(192,132,252,0.9)',
            fontFamily: 'var(--font-body)',
            textShadow: '0 0 20px rgba(168,85,247,0.4)'
          }}
        >
          Celebración Especial
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10,5,20,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div
            className="h-1"
            style={{
              background: 'linear-gradient(90deg, transparent, #ec4899, #a855f7, transparent)',
            }}
          />
          <div className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold mb-1" style={{ color: '#ffffff', fontFamily: 'var(--font-body)' }}>
                Confirmación de asistencia
              </h1>
            </div>

            <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                Invitado
              </div>
              <div className="text-lg font-semibold" style={{ color: '#ffffff', fontFamily: 'var(--font-body)' }}>
                {guest.full_name}
              </div>
              {guest.table_number && (
                <div className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                  Mesa {String(guest.table_number).padStart(2, '0')}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}>
                ¿Podrás asistir?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStatus('confirmed')}
                  className="p-4 rounded-xl flex flex-col items-center gap-2"
                  style={{
                    background: status === 'confirmed' ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)',
                    border: status === 'confirmed' ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Check className="w-6 h-6" style={{ color: status === 'confirmed' ? '#4ade80' : 'rgba(255,255,255,0.5)' }} />
                  <span className="text-sm font-semibold" style={{ color: status === 'confirmed' ? '#4ade80' : 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>
                    Sí, asistiré
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStatus('declined')}
                  className="p-4 rounded-xl flex flex-col items-center gap-2"
                  style={{
                    background: status === 'declined' ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.03)',
                    border: status === 'declined' ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <X className="w-6 h-6" style={{ color: status === 'declined' ? '#fbbf24' : 'rgba(255,255,255,0.5)' }} />
                  <span className="text-sm font-semibold" style={{ color: status === 'declined' ? '#fbbf24' : 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>
                    No podré
                  </span>
                </motion.button>
              </div>
            </div>

            {status === 'declined' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6"
              >
                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}>
                  Lamentamos que no puedas asistir (opcional)
                </label>
                <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                  Nos gustaría saber por qué (opcional)
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.9)',
                    fontFamily: 'var(--font-body)',
                  }}
                />
              </motion.div>
            )}

            {status === 'confirmed' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6"
              >
                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}>
                  Mensaje adicional (opcional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="¿Tienes alguna observación o mensaje especial?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.9)',
                    fontFamily: 'var(--font-body)',
                  }}
                />
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!status || submitting}
              className="w-full py-3 rounded-xl text-sm font-semibold"
              style={{
                background: !status || submitting ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #a855f7, #6366f1)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: !status || submitting ? 'rgba(255,255,255,0.3)' : '#ffffff',
                cursor: !status || submitting ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              {submitting ? 'Enviando...' : 'Enviar respuesta'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
