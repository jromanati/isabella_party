'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import { MapPin, CheckCircle, Navigation, Sparkles } from 'lucide-react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export default function LocationRsvp({
  onOpenSalon,
}: {
  onOpenSalon?: () => void
}) {
  return (
    <section className="relative px-5 py-20 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative max-w-lg mx-auto flex flex-col gap-12">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p
            className="text-xs font-semibold tracking-[0.35em] uppercase mb-3"
            style={{ color: '#c084fc', fontFamily: 'var(--font-body)' }}
          >
            El evento
          </p>
          <h2
            className="font-sans font-black text-4xl sm:text-5xl italic leading-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #f9a8d4 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 24px rgba(192,132,252,0.4))',
            }}
          >
            Te esperamos
          </h2>
          <div
            className="mx-auto mt-4 h-px w-24"
            style={{
              background: 'linear-gradient(to right, transparent, #ec4899, transparent)',
              boxShadow: '0 0 8px #ec4899',
            }}
          />
        </motion.div>

        {/* Dirección — large immersive card */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(10,5,25,0.8)',
            border: '1px solid rgba(168,85,247,0.25)',
            boxShadow:
              '0 0 40px rgba(168,85,247,0.12), 0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 inset-x-0 h-px"
            style={{
              background:
                'linear-gradient(to right, transparent, #a855f7, transparent)',
              boxShadow: '0 0 8px #a855f7',
            }}
          />

          <div className="p-7 flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(168,85,247,0.15)',
                  border: '1px solid rgba(168,85,247,0.35)',
                  boxShadow: '0 0 20px rgba(168,85,247,0.2)',
                }}
              >
                <MapPin className="w-5 h-5" style={{ color: '#c084fc' }} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold tracking-[0.2em] uppercase mb-1"
                  style={{ color: '#c084fc', fontFamily: 'var(--font-body)' }}
                >
                  Dirección
                </p>
                <p className="text-white font-semibold text-lg leading-snug font-sans">
                  Centro de Eventos Colibri
                </p>
                <p
                  className="text-sm mt-1 leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)' }}
                >
                  German Ebbinghauss 2617, Puente Alto
                  <br />
                  Región Metropolitana, Chile
                </p>
              </div>
            </div>

            <motion.a
              href="https://www.google.com/maps/place/Centro+de+Eventos+Colibr%C3%AD/@-33.5870916,-70.5748445,17z/data=!3m1!4b1!4m6!3m5!1s0x9662d78ece0cbb77:0x87552de156255ca0!8m2!3d-33.5870916!4d-70.5722696!16s%2Fg%2F11y5fzm9dj?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm text-white"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.6), rgba(59,130,246,0.6))',
                border: '1px solid rgba(168,85,247,0.4)',
                boxShadow: '0 0 24px rgba(168,85,247,0.2)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <Navigation className="w-4 h-4" />
              Abrir en Maps
            </motion.a>
          </div>
        </motion.div>

        {/* RSVP — large immersive card */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(10,5,25,0.8)',
            border: '1px solid rgba(236,72,153,0.25)',
            boxShadow:
              '0 0 40px rgba(236,72,153,0.1), 0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 inset-x-0 h-px"
            style={{
              background:
                'linear-gradient(to right, transparent, #ec4899, transparent)',
              boxShadow: '0 0 8px #ec4899',
            }}
          />

          <div className="p-7 flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(236,72,153,0.15)',
                  border: '1px solid rgba(236,72,153,0.35)',
                  boxShadow: '0 0 20px rgba(236,72,153,0.2)',
                }}
              >
                <CheckCircle className="w-5 h-5" style={{ color: '#f472b6' }} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold tracking-[0.2em] uppercase mb-1"
                  style={{ color: '#f472b6', fontFamily: 'var(--font-body)' }}
                >
                  Confirmar asistencia
                </p>
                <p className="text-white font-semibold text-lg leading-snug font-sans">
                  ¿Vas a venir?
                </p>
                <p
                  className="text-sm mt-1 leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)' }}
                >
                  Confirma tu lugar antes del{' '}
                  <span style={{ color: '#f9a8d4' }}>5 de Julio</span>.
                  ¡Tu presencia es el mejor regalo!
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenSalon}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                boxShadow:
                  '0 0 24px rgba(236,72,153,0.35), 0 0 48px rgba(168,85,247,0.2)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Encuentra tu mesa y confirma asistencia
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(10,5,25,0.8)',
            border: '1px solid rgba(168,85,247,0.25)',
            boxShadow:
              '0 0 40px rgba(168,85,247,0.1), 0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="absolute top-0 inset-x-0 h-px"
            style={{
              background: 'linear-gradient(to right, transparent, #a855f7, transparent)',
              boxShadow: '0 0 8px #a855f7',
            }}
          />

          <div className="p-7 flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(168,85,247,0.15)',
                  border: '1px solid rgba(168,85,247,0.35)',
                  boxShadow: '0 0 20px rgba(168,85,247,0.2)',
                }}
              >
                <Sparkles className="w-5 h-5" style={{ color: '#c084fc' }} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold tracking-[0.2em] uppercase mb-1"
                  style={{ color: '#c084fc', fontFamily: 'var(--font-body)' }}
                >
                  Conoce sus gustos
                </p>
                <p className="text-white font-semibold text-lg leading-snug font-sans">
                  Pequeñas pistas para sorprenderla
                </p>
                <p
                  className="text-sm mt-1 leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)' }}
                >
                  Una guía emocional y moderna para elegir un detalle que conecte con su esencia.
                </p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/regalos"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm text-white"
                style={{
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.65), rgba(59,130,246,0.55))',
                  border: '1px solid rgba(168,85,247,0.4)',
                  boxShadow: '0 0 24px rgba(168,85,247,0.2)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <Sparkles className="w-4 h-4" />
                Explorar gustos
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
