'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, Lock, Sparkles, ArrowRight } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { AuthService } from '@/services/auth.service'
import { EventService } from '@/services/event.service'
import type { EventProfile } from '@/types/event'

const PLACEHOLDERS = [
  { col: '#ec4899', rotate: -3 },
  { col: '#a855f7', rotate: 1.5 },
  { col: '#3b82f6', rotate: -1 },
  { col: '#f472b6', rotate: 2.5 },
  { col: '#818cf8', rotate: -2 },
  { col: '#c084fc', rotate: 1 },
]

export default function PhotoUpload() {
  const [eventProfile, setEventProfile] = useState<EventProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadEventProfile = async () => {
      try {
        setLoading(true)
        
        // Asegurar autenticación antes de cargar el perfil del evento
        const token = await AuthService.getValidToken()
        if (!token) {
          throw new Error('No se pudo autenticar con la API')
        }

        const response = await EventService.getEventProfile()
        
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Error al cargar el perfil del evento')
        }
        
        if (!cancelled) {
          setEventProfile(response.data)
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        console.error('Error cargando perfil del evento:', message)
        if (!cancelled) {
          setEventProfile(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadEventProfile()

    return () => {
      cancelled = true
    }
  }, [])

  const shouldShowPlaceholder = loading || !eventProfile?.gallery_enabled
  const shouldShowGalleryLink = eventProfile?.gallery_enabled === true
  const isEnabled = eventProfile?.gallery_enabled === true

  return (
    <section className="relative px-5 py-20 pb-28 overflow-hidden">
      {/* Background image with deep overlay */}
      <div className="absolute inset-0">
        <Image
          src="/gallery-bg.jpg"
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.1 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #050308 0%, rgba(5,3,8,0.3) 40%, rgba(5,3,8,0.3) 60%, #050308 100%)',
          }}
        />
      </div>

      <div className="relative max-w-lg mx-auto flex flex-col gap-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p
            className="text-xs font-semibold tracking-[0.35em] uppercase mb-3"
            style={{ color: '#f472b6', fontFamily: 'var(--font-body)' }}
          >
            Recuerdos de la noche
          </p>
          <h2
            className="font-sans font-black text-4xl sm:text-5xl italic leading-tight"
            style={{
              background:
                'linear-gradient(135deg, #fff 0%, #f9a8d4 40%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 24px rgba(244,114,182,0.4))',
            }}
          >
            Galería
          </h2>
          <div
            className="mx-auto mt-4 h-px w-24"
            style={{
              background:
                'linear-gradient(to right, transparent, #ec4899, transparent)',
              boxShadow: '0 0 8px #ec4899',
            }}
          />
        </motion.div>

        {/* Placeholder photo grid */}
        {shouldShowPlaceholder && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-3 gap-2.5"
          >
            {PLACEHOLDERS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85, rotate: p.rotate }}
                whileInView={{ opacity: 1, scale: 1, rotate: p.rotate }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-square rounded-2xl overflow-hidden flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${p.col}18, ${p.col}08)`,
                  border: `1px solid ${p.col}33`,
                  boxShadow: `0 0 20px ${p.col}18`,
                }}
              >
                <Lock
                  className="w-5 h-5 opacity-30"
                  style={{ color: p.col }}
                />
                {/* Corner glow dot */}
                <div
                  className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: p.col, boxShadow: `0 0 6px ${p.col}` }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Lock card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(8,4,18,0.8)',
            border: '1px solid rgba(236,72,153,0.2)',
            boxShadow: '0 0 50px rgba(236,72,153,0.1), 0 20px 60px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Top accent */}
          <div
            className="absolute top-0 inset-x-0 h-px"
            style={{
              background:
                'linear-gradient(to right, transparent, #ec4899, #a855f7, transparent)',
              boxShadow: '0 0 8px #ec4899',
            }}
          />

          <div className="p-8 flex flex-col items-center text-center gap-5">
            {/* Icon */}
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(236,72,153,0.12)',
                  border: '1px solid rgba(236,72,153,0.3)',
                  boxShadow: '0 0 30px rgba(236,72,153,0.2)',
                }}
              >
                <Camera className="w-7 h-7" style={{ color: '#f472b6' }} />
              </div>
              {!isEnabled && (
                <div
                  className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: '#0d0520',
                    border: '1px solid rgba(168,85,247,0.5)',
                    boxShadow: '0 0 12px #a855f7',
                  }}
                >
                  <Lock className="w-3.5 h-3.5" style={{ color: '#c084fc' }} />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h3
                className="font-sans font-black text-2xl text-white"
                style={{ filter: 'drop-shadow(0 0 12px rgba(244,114,182,0.3))' }}
              >
                {isEnabled ? '¡La galería está activa!' : 'Se activa el 11 de Julio'}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {isEnabled
                  ? 'Ya puedes subir tus fotos y ver los mejores momentos de la noche.'
                  : 'Durante la fiesta podrás subir, ver y compartir todos los momentos de la noche. ¡No olvides tu mejor pose!'}
              </p>
            </div>

            {/* Date display */}
            {!isEnabled && (
              <div className="flex items-center gap-3">
                {['11', '·', 'Jul', '·', '2026'].map((val, i) => (
                  val === '·' ? (
                    <span key={i} style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                  ) : (
                    <div
                      key={i}
                      className="px-4 py-2 rounded-xl"
                      style={{
                        background: 'rgba(236,72,153,0.1)',
                        border: '1px solid rgba(236,72,153,0.25)',
                        boxShadow: '0 0 10px rgba(236,72,153,0.1)',
                      }}
                    >
                      <p
                        className="font-bold text-lg leading-none"
                        style={{ color: '#f9a8d4' }}
                      >
                        {val}
                      </p>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Locked CTA */}
            {!isEnabled && (
              <div
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Galería bloqueada hasta la noche</span>
              </div>
            )}

            {/* Link to gallery page */}
            {shouldShowGalleryLink && (
              <Link href="/fotos" className="w-full">
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative overflow-hidden flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.15))',
                    border: '1px solid rgba(236,72,153,0.3)',
                    color: '#f9a8d4',
                    fontFamily: 'var(--font-body)',
                    boxShadow: '0 0 20px rgba(236,72,153,0.08)',
                  }}
                >
                  <span
                    className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.1), transparent)',
                    }}
                  />
                  <span className="relative">Ver galería de fotos</span>
                  <ArrowRight className="relative w-4 h-4" />
                </motion.div>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
