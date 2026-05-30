'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import CinematicHero from '@/components/cinematic-hero'
import LocationRsvp from '@/components/action-cards'
import DressCode from '@/components/dress-code'
import EventSchedule from '@/components/event-schedule'
import PhotoUpload from '@/components/photo-upload'
import PhotoCollage from '@/components/photo-collage'

const VirtualSalon = dynamic(() => import('@/components/virtual-salon'), { ssr: false })

function NeonDivider({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div className="relative flex items-center justify-center py-2 px-5">
      <div
        className="w-full h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${primary}, ${secondary}, transparent)`,
          boxShadow: `0 0 10px ${primary}88`,
        }}
      />
    </div>
  )
}

function PartyEntrance({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function IsabellaPartyPage() {
  const [entered, setEntered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [salonOpen, setSalonOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      const stored = window.localStorage.getItem('isabella_party_entered')
      if (stored === '1') setEntered(true)
    } catch {
      // ignore
    }
  }, [mounted])

  const handleEnter = () => {
    setEntered(true)
    try {
      window.localStorage.setItem('isabella_party_entered', '1')
    } catch {
      // ignore
    }
  }

  if (!mounted) return null

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: '#050308' }}
    >
      <AnimatePresence mode="wait">
        {!entered ? (
          <CinematicHero key="hero" onEnter={handleEnter} />
        ) : (
          <PartyEntrance key="party">

            {/* ── Club intro ── */}
            <section className="relative px-5 pt-16 pb-6 overflow-hidden">
              {/* Atmospheric top glow */}
              <div
                className="absolute inset-x-0 top-0 h-64 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(168,85,247,0.18) 0%, transparent 70%)',
                }}
              />

              <div className="relative max-w-lg mx-auto flex flex-col gap-6">
                {/* Welcome headline */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  className="text-center pt-2"
                >
                  <p
                    className="text-xs font-semibold tracking-[0.35em] uppercase mb-3"
                    style={{ color: '#c084fc', fontFamily: 'var(--font-body)' }}
                  >
                    Bienvenido a la celebración
                  </p>
                  <h2
                    className="font-sans font-black italic leading-tight"
                    style={{
                      fontSize: 'clamp(2.8rem, 14vw, 5.5rem)',
                      background:
                        'linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #c084fc 70%, #818cf8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 30px rgba(192,132,252,0.5))',
                    }}
                  >
                    La noche
                    <br />
                    comienza.
                  </h2>

                  {/* Horizontal decorative line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="mx-auto mt-5 h-px w-40"
                    style={{
                      background:
                        'linear-gradient(to right, transparent, #ec4899, #a855f7, transparent)',
                      boxShadow: '0 0 10px #a855f7',
                    }}
                  />

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mt-5 text-base leading-relaxed"
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    11 de Julio · Neon Glow Party
                    <br />
                    Una noche que recordarás siempre.
                  </motion.p>
                </motion.div>

                {/* Photo collage */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <PhotoCollage />
                </motion.div>
              </div>
            </section>

            <NeonDivider primary="#ec4899" secondary="#a855f7" />
            <LocationRsvp onOpenSalon={() => setSalonOpen(true)} />
            <NeonDivider primary="#a855f7" secondary="#3b82f6" />
            <DressCode />
            <NeonDivider primary="#3b82f6" secondary="#ec4899" />
            <EventSchedule />
            <NeonDivider primary="#ec4899" secondary="#c084fc" />
            <PhotoUpload />

            {/* ── Footer ── */}
            <footer className="relative py-12 text-center overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    'linear-gradient(to right, transparent, rgba(168,85,247,0.4), transparent)',
                }}
              />
              <div
                className="absolute inset-x-0 top-0 h-24 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(168,85,247,0.06), transparent)',
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center gap-3"
              >
                <span
                  className="font-sans font-black italic text-2xl"
                  style={{
                    background:
                      'linear-gradient(135deg, #f9a8d4, #c084fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 16px rgba(192,132,252,0.4))',
                  }}
                >
                  Isabella XV
                </span>
                <div className="flex items-center gap-3">
                  <div
                    className="h-px w-12"
                    style={{
                      background: 'linear-gradient(to right, transparent, #ec489966)',
                    }}
                  />
                  <span
                    className="text-xs tracking-[0.3em] uppercase"
                    style={{
                      color: 'rgba(255,255,255,0.25)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Neon Glow Party · 2026
                  </span>
                  <div
                    className="h-px w-12"
                    style={{
                      background: 'linear-gradient(to left, transparent, #a855f766)',
                    }}
                  />
                </div>
              </motion.div>
            </footer>
          </PartyEntrance>
        )}
      </AnimatePresence>

      {/* ── Virtual Salon overlay ── */}
      <AnimatePresence>
        {salonOpen && <VirtualSalon onClose={() => setSalonOpen(false)} />}
      </AnimatePresence>
    </main>
  )
}
