'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { AuthService } from '@/services/auth.service'
import { GuestMessageAdapter } from '@/services/guest-message-adapter.service'
import type { GuestMessage, PublicGuestMessage } from '@/types/guest-message'

const SLIDE_DURATION = 8000 // ms per slide
const TRANSITION_DURATION = 1.2 // seconds

// ── Floating particles ────────────────────────────────────────
interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
}

function Particles() {
  const particles = useMemo(() => [
    { id: 0, x: 10, y: 20, size: 2.5, color: 'rgba(168,85,247,0.6)', duration: 8, delay: 0 },
    { id: 1, x: 85, y: 15, size: 1.8, color: 'rgba(236,72,153,0.5)', duration: 7, delay: 1 },
    { id: 2, x: 30, y: 80, size: 3.2, color: 'rgba(96,165,250,0.5)', duration: 9, delay: 2 },
    { id: 3, x: 70, y: 40, size: 1.5, color: 'rgba(168,85,247,0.6)', duration: 6, delay: 3 },
    { id: 4, x: 15, y: 60, size: 2.8, color: 'rgba(236,72,153,0.5)', duration: 8, delay: 1 },
    { id: 5, x: 90, y: 70, size: 1.2, color: 'rgba(96,165,250,0.5)', duration: 7, delay: 4 },
    { id: 6, x: 45, y: 25, size: 2.3, color: 'rgba(168,85,247,0.6)', duration: 9, delay: 2 },
    { id: 7, x: 60, y: 85, size: 1.9, color: 'rgba(236,72,153,0.5)', duration: 6, delay: 3 },
    { id: 8, x: 25, y: 45, size: 2.7, color: 'rgba(96,165,250,0.5)', duration: 8, delay: 0 },
    { id: 9, x: 80, y: 30, size: 1.4, color: 'rgba(168,85,247,0.6)', duration: 7, delay: 2 },
    { id: 10, x: 35, y: 70, size: 2.1, color: 'rgba(236,72,153,0.5)', duration: 9, delay: 1 },
    { id: 11, x: 75, y: 55, size: 1.6, color: 'rgba(96,165,250,0.5)', duration: 6, delay: 3 },
    { id: 12, x: 20, y: 35, size: 2.4, color: 'rgba(168,85,247,0.6)', duration: 8, delay: 4 },
    { id: 13, x: 65, y: 20, size: 1.7, color: 'rgba(236,72,153,0.5)', duration: 7, delay: 0 },
    { id: 14, x: 40, y: 90, size: 2.9, color: 'rgba(96,165,250,0.5)', duration: 9, delay: 2 },
    { id: 15, x: 95, y: 50, size: 1.3, color: 'rgba(168,85,247,0.6)', duration: 6, delay: 1 },
    { id: 16, x: 5, y: 75, size: 2.6, color: 'rgba(236,72,153,0.5)', duration: 8, delay: 3 },
    { id: 17, x: 55, y: 10, size: 1.8, color: 'rgba(96,165,250,0.5)', duration: 7, delay: 2 },
    { id: 18, x: 30, y: 55, size: 2.2, color: 'rgba(168,85,247,0.6)', duration: 9, delay: 4 },
    { id: 19, x: 85, y: 85, size: 1.5, color: 'rgba(236,72,153,0.5)', duration: 6, delay: 0 },
    { id: 20, x: 15, y: 30, size: 2.8, color: 'rgba(96,165,250,0.5)', duration: 8, delay: 1 },
    { id: 21, x: 70, y: 65, size: 1.4, color: 'rgba(168,85,247,0.6)', duration: 7, delay: 3 },
    { id: 22, x: 45, y: 40, size: 2.0, color: 'rgba(236,72,153,0.5)', duration: 9, delay: 2 },
    { id: 23, x: 60, y: 75, size: 1.9, color: 'rgba(96,165,250,0.5)', duration: 6, delay: 4 },
    { id: 24, x: 25, y: 15, size: 2.5, color: 'rgba(168,85,247,0.6)', duration: 8, delay: 0 },
    { id: 25, x: 80, y: 45, size: 1.6, color: 'rgba(236,72,153,0.5)', duration: 7, delay: 1 },
    { id: 26, x: 35, y: 85, size: 2.3, color: 'rgba(96,165,250,0.5)', duration: 9, delay: 3 },
    { id: 27, x: 75, y: 25, size: 1.7, color: 'rgba(168,85,247,0.6)', duration: 6, delay: 2 },
  ], [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ── Progress bar ──────────────────────────────────────────────
function ProgressBar({
  current,
  total,
  progress,
}: {
  current: number
  total: number
  progress: number
}) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="relative flex-1 h-0.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          {i < current && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(to right, #ec4899, #a855f7)',
                boxShadow: '0 0 6px rgba(168,85,247,0.6)',
              }}
            />
          )}
          {i === current && (
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${progress * 100}%`,
                background: 'linear-gradient(to right, #ec4899, #a855f7)',
                boxShadow: '0 0 6px rgba(168,85,247,0.6)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Image collage background ───────────────────────────────────
function ImageCollage() {
  const PHOTOS = [
    { src: "/5.jpeg", alt: 'Background collage 1' },
    { src: "/4.jpeg", alt: 'Background collage 2' },
    { src: "/3.jpeg", alt: 'Background collage 3' },
    { src: "/2.jpeg", alt: 'Background collage 4' },
    { src: "/1.jpeg", alt: 'Background collage 5' },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Perspective container like photo-collage */}
      <div
        className="absolute inset-0 flex items-end justify-center gap-2 sm:gap-3 md:gap-4"
        style={{
          perspective: '1400px',
          perspectiveOrigin: '50% 45%',
          transform: 'rotateX(2deg)',
          transformStyle: 'preserve-3d',
          height: '100%',
          padding: '2rem',
        }}
      >
        {PHOTOS.map((photo, i) => {
          // Panel heights — center is tallest, sides shorter for perspective
          const heights = ['88%', '94%', '100%', '94%', '88%']
          // Subtle rotation for depth — outer panels angled inward
          const rotations = [4, 2, 0, -2, -4]

          return (
            <div
              key={i}
              className="relative flex-shrink-0 opacity-15"
              style={{
                width: 'clamp(80px, 20vw, 200px)',
                height: heights[i],
                transformStyle: 'preserve-3d',
                transform: `rotateY(${rotations[i]}deg)`,
              }}
            >
              {/* Panel frame */}
              <div
                className="relative w-full h-full overflow-hidden"
                style={{
                  borderRadius: '6px',
                  boxShadow: `
                    0 0 0 1px rgba(168,85,247,0.2),
                    0 0 20px rgba(168,85,247,0.1),
                    0 25px 50px -12px rgba(0,0,0,0.4)
                  `,
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 20vw, 200px"
                />
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Overlay gradient to blend with background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(5,3,8,0.6) 80%)',
        }}
      />
    </div>
  )
}

// ── Ambient glow overlay ──────────────────────────────────────
function AmbientGlow({ message }: { message: PublicGuestMessage }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div
          className="absolute bottom-0 left-0 w-1/2 h-1/2"
          style={{
            background: 'radial-gradient(ellipse, rgba(168,85,247,0.18) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-0 right-0 w-1/2 h-1/2"
          style={{
            background: 'radial-gradient(ellipse, rgba(236,72,153,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}

// ── QR corner badge ───────────────────────────────────────────
function QRBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.5 }}
      className="flex items-center gap-2 px-2.5 py-2 rounded-xl"
      style={{
        background: 'rgba(10,5,20,0.75)',
        border: '1px solid rgba(168,85,247,0.2)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* QR */}
      <div
        className="w-32 h-32 rounded-xl flex-shrink-0 flex items-center justify-center"
        style={{
          background: '#ffffff',
          padding: 7,
        }}
      >
        <Image
          src="/isabella_party_qr.png"
          alt="QR para enviar mensajes"
          width={220}
          height={220}
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <p
          className="text-xs font-semibold text-white"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Envía un mensaje
        </p>
        <p
          className="text-xs"
          style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}
        >
          isabellaxv.app/mensajes
        </p>
      </div>
    </motion.div>
  )
}

// ── Message slide ─────────────────────────────────────────────
function MessageSlide({ message, index }: { message: PublicGuestMessage; index: number }) {
  // Alternate animation direction per slide
  const y = index % 2 === 0 ? ['0%', '-5%'] : ['0%', '5%']
  const scale = index % 2 === 0 ? [1.0, 1.02] : [1.0, 1.02]

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: TRANSITION_DURATION }}
      className="absolute inset-0 flex items-center justify-center px-16 py-20"
    >
      <motion.div
        animate={{ y, scale }}
        transition={{ duration: SLIDE_DURATION / 1000, ease: 'easeInOut' }}
        className="max-w-4xl w-full text-center"
      >
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-8"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #c084fc 70%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(192,132,252,0.4))',
          }}
        >
          {message.title}
        </motion.h2>

        {/* Message content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl md:text-3xl leading-relaxed text-white/90 mb-8"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {message.message}
        </motion.div>

        {/* Author */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-pink-400"></div>
          <p className="text-lg text-white/70" style={{ fontFamily: 'var(--font-body)' }}>
            {message.author_name}
          </p>
          <div className="w-2 h-2 rounded-full bg-pink-400"></div>
        </motion.div>

        {/* Featured badge */}
        {message.is_featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(251,191,36,0.2)',
              border: '1px solid rgba(251,191,36,0.3)',
            }}
          >
            <span className="text-yellow-300 text-sm">⭐</span>
            <span className="text-yellow-200 text-sm font-medium">Destacado</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────────
export default function MessagesSlideshowPage() {
  const [messages, setMessages] = useState<PublicGuestMessage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const slideInterval = useRef<NodeJS.Timeout | null>(null)

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        // Usar Supabase directamente - no requiere autenticación para leer mensajes
        setError(null)

        const response = await GuestMessageAdapter.getPublicMessages()
        if (response.success && response.data) {
          // Filter messages with content and sort by featured first, then by date
          const filteredMessages = response.data.filter((msg: PublicGuestMessage) => 
            msg.title.trim() && msg.message.trim()
          ).sort((a: PublicGuestMessage, b: PublicGuestMessage) => {
            // Featured messages first
            if (a.is_featured && !b.is_featured) return -1
            if (!a.is_featured && b.is_featured) return 1
            // Then by date (newest first)
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
          
          setMessages(filteredMessages)
        } else {
          setError(response.error || 'Error al cargar mensajes')
        }
      } catch (err) {
        setError('Error al cargar los mensajes')
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [])

  // Auto-advance slides
  useEffect(() => {
    if (messages.length <= 1) return

    // Progress bar animation
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        const increment = 100 / (SLIDE_DURATION / 100)
        const next = prev + increment
        return next >= 100 ? 0 : next
      })
    }, 100)

    // Slide change
    slideInterval.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length)
      setProgress(0)
    }, SLIDE_DURATION)

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
      if (slideInterval.current) clearInterval(slideInterval.current)
    }
  }, [messages.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (messages.length <= 1) return
      
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % messages.length)
        setProgress(0)
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length)
        setProgress(0)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [messages.length])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Particles />
        <p className="text-white/60">Cargando mensajes...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Particles />
        <p className="text-red-400">{error}</p>
      </main>
    )
  }

  if (messages.length === 0) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Particles />
        <div className="text-center">
          <p className="text-white/60 mb-4">No hay mensajes para mostrar</p>
          <QRBadge />
        </div>
      </main>
    )
  }

  const currentMessage = messages[currentIndex]

  return (
    <main className="min-h-screen relative overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236,72,153,0.08) 0%, transparent 70%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(96,165,250,0.06) 0%, transparent 70%)',
          }}
        />
        <ImageCollage />
        <Particles />
      </div>

      {/* Ambient glow */}
      <AmbientGlow message={currentMessage} />

      {/* Message content */}
      <AnimatePresence mode="wait">
        <MessageSlide key={currentMessage.id} message={currentMessage} index={currentIndex} />
      </AnimatePresence>

      {/* Progress bar */}
      {messages.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-8 right-8"
        >
          <ProgressBar current={currentIndex} total={messages.length} progress={progress / 100} />
        </motion.div>
      )}

      {/* QR Badge */}
      <div className="absolute bottom-8 right-8">
        <QRBadge />
      </div>

      {/* Navigation hint */}
      {messages.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute top-8 left-8 text-white/40 text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Usa ← → para navegar
        </motion.div>
      )}

      {/* Counter */}
      {messages.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute top-8 right-8 text-white/40 text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {currentIndex + 1} / {messages.length}
        </motion.div>
      )}
    </main>
  )
}
