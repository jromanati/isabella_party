'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { getSupabaseClient } from '@/lib/supabase/client'
import { type GalleryPhoto } from '@/lib/gallery-store'

const SLIDE_DURATION = 6000 // ms per slide
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
  const particles: Particle[] = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    color: ['rgba(168,85,247,0.6)', 'rgba(236,72,153,0.5)', 'rgba(96,165,250,0.5)'][
      Math.floor(Math.random() * 3)
    ],
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
  }))

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

// ── Ambient glow overlay ──────────────────────────────────────
function AmbientGlow({ photo }: { photo: GalleryPhoto }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={photo.id}
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
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        background: 'rgba(10,5,20,0.75)',
        border: '1px solid rgba(168,85,247,0.2)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* QR placeholder */}
      <div
        className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center"
        style={{
          background: '#ffffff',
          padding: 3,
        }}
      >
        {/* SVG QR placeholder pattern */}
        <svg viewBox="0 0 21 21" width="100%" height="100%">
          <rect x="0" y="0" width="9" height="9" fill="#000" />
          <rect x="1" y="1" width="7" height="7" fill="#fff" />
          <rect x="2" y="2" width="5" height="5" fill="#000" />
          <rect x="12" y="0" width="9" height="9" fill="#000" />
          <rect x="13" y="1" width="7" height="7" fill="#fff" />
          <rect x="14" y="2" width="5" height="5" fill="#000" />
          <rect x="0" y="12" width="9" height="9" fill="#000" />
          <rect x="1" y="13" width="7" height="7" fill="#fff" />
          <rect x="2" y="14" width="5" height="5" fill="#000" />
          <rect x="11" y="11" width="2" height="2" fill="#000" />
          <rect x="14" y="11" width="2" height="2" fill="#000" />
          <rect x="17" y="11" width="2" height="2" fill="#000" />
          <rect x="11" y="14" width="2" height="2" fill="#000" />
          <rect x="14" y="14" width="2" height="2" fill="#000" />
          <rect x="17" y="14" width="2" height="2" fill="#000" />
          <rect x="11" y="17" width="2" height="2" fill="#000" />
          <rect x="14" y="17" width="2" height="2" fill="#000" />
        </svg>
      </div>
      <div>
        <p
          className="text-xs font-semibold text-white"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Sube tus fotos
        </p>
        <p
          className="text-xs"
          style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}
        >
          isabellaxv.app/fotos
        </p>
      </div>
    </motion.div>
  )
}

// ── Ken Burns wrapper ─────────────────────────────────────────
function KenBurnsImage({ photo, index }: { photo: GalleryPhoto; index: number }) {
  // Alternate zoom-in / zoom-out and pan direction per slide
  const scale = index % 2 === 0 ? [1.08, 1.0] : [1.0, 1.08]
  const x = index % 3 === 0 ? ['0%', '1.5%'] : index % 3 === 1 ? ['1%', '-1%'] : ['0%', '0%']
  const y = index % 2 === 0 ? ['0%', '1%'] : ['1%', '0%']

  return (
    <motion.div
      className="absolute inset-0"
      animate={{ scale, x, y }}
      transition={{ duration: SLIDE_DURATION / 1000 + TRANSITION_DURATION, ease: 'linear' }}
    >
      <Image
        src={photo.url}
        alt={`Recuerdo de ${photo.guestName}`}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        crossOrigin="anonymous"
      />
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function SlideshowPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [photosLoading, setPhotosLoading] = useState(true)
  const [photosError, setPhotosError] = useState<string | null>(null)

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  useEffect(() => {
    let cancelled = false

    const loadApproved = async () => {
      try {
        setPhotosLoading(true)
        setPhotosError(null)

        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from('photos')
          .select('id, guest_name, image_url, public_id, status, created_at')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })

        if (error) throw error
        if (cancelled) return

        const mapped: GalleryPhoto[] = (data ?? []).map((r) => {
          const thumbnailUrl =
            cloudName && r.public_id
              ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_400/${r.public_id}`
              : r.image_url

          return {
            id: r.id,
            guestName: r.guest_name,
            url: r.image_url,
            thumbnailUrl,
            status: r.status,
            uploadedAt: r.created_at,
          }
        })

        setPhotos(mapped)
        setCurrentIndex(0)
        setProgress(0)
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        if (!cancelled) setPhotosError(message)
      } finally {
        if (!cancelled) setPhotosLoading(false)
      }
    }

    loadApproved()

    return () => {
      cancelled = true
    }
  }, [cloudName])

  const advance = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
    setProgress(0)
  }, [photos.length])

  useEffect(() => {
    if (paused) return
    if (photos.length === 0) return

    intervalRef.current = setInterval(advance, SLIDE_DURATION)
    const tick = 80
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + tick / SLIDE_DURATION, 1))
    }, tick)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [paused, advance, currentIndex])

  const current = photos[currentIndex]

  if (photosLoading) {
    return (
      <main className="fixed inset-0 overflow-hidden select-none" style={{ background: '#050308' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
            Cargando slideshow…
          </p>
        </div>
      </main>
    )
  }

  if (photosError) {
    return (
      <main className="fixed inset-0 overflow-hidden select-none" style={{ background: '#050308' }}>
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
          <div>
            <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)' }}>
              Error cargando fotos
            </p>
            <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}>
              {photosError}
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (photos.length === 0) {
    return (
      <main className="fixed inset-0 overflow-hidden select-none" style={{ background: '#050308' }}>
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
            Aún no hay fotos aprobadas.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main
      className="fixed inset-0 overflow-hidden select-none"
      style={{ background: '#050308' }}
      onClick={() => setPaused((p) => !p)}
    >
      {/* ── Background slide ── */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TRANSITION_DURATION, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <KenBurnsImage photo={current} index={currentIndex} />
          </motion.div>
        </AnimatePresence>

        {/* Dark vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, rgba(5,3,8,0.65) 100%),
              linear-gradient(to bottom, rgba(5,3,8,0.5) 0%, transparent 20%, transparent 70%, rgba(5,3,8,0.8) 100%)
            `,
          }}
        />
      </div>

      {/* ── Ambient glow ── */}
      <AmbientGlow photo={current} />

      {/* ── Floating particles ── */}
      <Particles />

      {/* ── Top UI bar ── */}
      <div
        className="absolute top-0 inset-x-0 px-8 pt-6 pb-4 flex items-start justify-between gap-4 z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,3,8,0.6), transparent)',
        }}
      >
        {/* Branding */}
        <div className="flex flex-col gap-1">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-sans font-black italic"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              background: 'linear-gradient(135deg, #ffffff, #f9a8d4, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(192,132,252,0.5))',
            }}
          >
            Isabella XV
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}
          >
            Neon Glow Party · 2025
          </motion.span>
        </div>

        {/* Pause indicator */}
        <AnimatePresence>
          {paused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span
                className="text-xs"
                style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}
              >
                Pausado — toca para continuar
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom overlay ── */}
      <div
        className="absolute bottom-0 inset-x-0 px-8 pb-8 pt-20 z-10"
        style={{
          background: 'linear-gradient(to top, rgba(5,3,8,0.85) 0%, transparent 100%)',
        }}
      >
        <div className="flex items-end justify-between gap-6">

          {/* Guest info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + '-info'}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-1.5 max-w-sm"
            >
              <p
                className="text-xs tracking-[0.25em] uppercase"
                style={{ color: 'rgba(192,132,252,0.7)', fontFamily: 'var(--font-body)' }}
              >
                Compartido por
              </p>
              <h2
                className="font-sans font-black italic leading-tight"
                style={{
                  fontSize: 'clamp(1.6rem, 4vw, 3rem)',
                  background: 'linear-gradient(135deg, #fff 0%, #f9a8d4 50%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(192,132,252,0.4))',
                }}
              >
                {current.guestName}
              </h2>

              {/* Progress bar */}
              <div className="mt-2 w-48">
                <ProgressBar
                  current={currentIndex}
                  total={Math.min(photos.length, 8)}
                  progress={progress}
                />
              </div>
              <p
                className="text-xs mt-1"
                style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-body)' }}
              >
                {currentIndex + 1} / {photos.length}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* QR badge */}
          <QRBadge />
        </div>
      </div>

    </main>
  )
}
