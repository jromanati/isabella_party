'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

const COLORS = ['#f472b6', '#c084fc', '#818cf8', '#60a5fa', '#e879f9']

export default function CinematicHero({
  onEnter,
}: {
  onEnter: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(0.4 + Math.random() * 1.2),
      radius: 1 + Math.random() * 2.5,
      opacity: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
      maxLife: 120 + Math.random() * 180,
    })

    // seed initial particles
    for (let i = 0; i < 60; i++) {
      const p = spawn()
      p.y = Math.random() * canvas.height
      p.life = Math.random() * p.maxLife
      particlesRef.current.push(p)
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // spawn new
      if (particlesRef.current.length < 90) {
        particlesRef.current.push(spawn())
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++
        p.x += p.vx
        p.y += p.vy

        const progress = p.life / p.maxLife
        p.opacity =
          progress < 0.2
            ? (progress / 0.2) * 0.85
            : progress > 0.75
            ? ((1 - progress) / 0.25) * 0.85
            : 0.85

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.shadowBlur = 12
        ctx.shadowColor = p.color
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        return p.life < p.maxLife && p.y > -20
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <motion.section
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Cinematic background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/isabella-hero-bg.jpg')" }}
      />

      {/* Deep dark overlay */}
      <div className="absolute inset-0 bg-[#050308]/70" />

      {/* Bottom radial pink glow */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(236,72,153,0.28) 0%, transparent 70%)',
        }}
      />

      {/* Top purple ambient */}
      <div
        className="absolute inset-x-0 top-0 h-[40%]"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(168,85,247,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Left blue accent */}
      <div
        className="absolute left-0 inset-y-0 w-[40%]"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 0% 60%, rgba(59,130,246,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Scan line texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,1) 0px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6">

        {/* Date pill */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full"
          style={{
            background: 'rgba(236,72,153,0.12)',
            border: '1px solid rgba(236,72,153,0.4)',
            boxShadow: '0 0 24px rgba(236,72,153,0.2)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse"
            style={{ boxShadow: '0 0 6px #f472b6' }}
          />
          <span
            className="text-xs font-semibold tracking-[0.25em] uppercase"
            style={{ color: '#fda4cf', fontFamily: 'var(--font-body)' }}
          >
            11 de Julio · 2025
          </span>
        </motion.div>

        {/* Isabella */}
        <motion.h1
          initial={{ opacity: 0, y: 28, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 1, type: 'spring', bounce: 0.22 }}
          className="font-sans font-black italic leading-[0.92] tracking-tight"
          style={{
            fontSize: 'clamp(4.5rem, 22vw, 10rem)',
            background:
              'linear-gradient(160deg, #ffffff 0%, #f9a8d4 35%, #c084fc 65%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 40px rgba(192,132,252,0.6))',
          }}
        >
          Isabella
        </motion.h1>

        {/* XV with horizontal lines */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex items-center gap-5 w-full max-w-sm"
        >
          <div
            className="flex-1 h-px"
            style={{
              background: 'linear-gradient(to right, transparent, #ec4899)',
              boxShadow: '0 0 8px #ec4899',
            }}
          />
          <span
            className="font-sans font-black animate-flicker"
            style={{
              fontSize: 'clamp(2.5rem, 14vw, 6rem)',
              color: '#f472b6',
              textShadow:
                '0 0 10px #f472b6, 0 0 30px #ec4899, 0 0 70px #ec489988, 0 0 120px #ec489944',
              lineHeight: 1,
            }}
          >
            XV
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background: 'linear-gradient(to left, transparent, #ec4899)',
              boxShadow: '0 0 8px #ec4899',
            }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ delay: 1.1, duration: 1 }}
          className="font-body text-sm sm:text-base uppercase font-semibold"
          style={{
            color: '#c084fc',
            textShadow: '0 0 20px rgba(192,132,252,0.6)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Neon Glow Party
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.7 }}
          className="mt-2"
        >
          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onEnter}
            className="relative group overflow-hidden rounded-full px-10 py-4 text-sm sm:text-base font-semibold text-white tracking-wide"
            style={{
              background:
                'linear-gradient(135deg, rgba(236,72,153,0.9) 0%, rgba(168,85,247,0.9) 100%)',
              boxShadow:
                '0 0 30px rgba(236,72,153,0.5), 0 0 60px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {/* shimmer */}
            <span
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              }}
            />
            <span className="relative">Entrar a la fiesta</span>
          </motion.button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="flex flex-col items-center gap-1.5 mt-4"
        >
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}
          >
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8"
            style={{
              background: 'linear-gradient(to bottom, rgba(236,72,153,0.8), transparent)',
              boxShadow: '0 0 6px #ec4899',
            }}
          />
        </motion.div>
      </div>

      {/* Cinematic letterbox bars */}
      <div
        className="absolute top-0 inset-x-0 h-12 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #050308, transparent)',
        }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #050308, transparent)',
        }}
      />
    </motion.section>
  )
}
