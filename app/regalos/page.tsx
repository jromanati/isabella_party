'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

/* ─── Fade-in wrapper ─────────────────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Tape strip ──────────────────────────────────────────────────── */
function Tape({
  rotate = '-2deg',
  top = '-10px',
  left = '50%',
  translateX = '-50%',
  width = 56,
}: {
  rotate?: string
  top?: string
  left?: string
  translateX?: string
  width?: number
}) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top,
        left,
        transform: `translateX(${translateX}) rotate(${rotate})`,
        width,
        height: 22,
        background: 'rgba(220,190,140,0.52)',
        borderRadius: 3,
        boxShadow: '0 1px 4px rgba(0,0,0,0.28)',
        backdropFilter: 'blur(2px)',
        zIndex: 10,
      }}
    />
  )
}

/* ─── Polaroid wrapper ────────────────────────────────────────────── */
function Polaroid({
  src,
  alt,
  rotate = '0deg',
  className = '',
  label,
  tapeLeft,
  tapeRight,
}: {
  src: string
  alt: string
  rotate?: string
  className?: string
  label?: string
  tapeLeft?: boolean
  tapeRight?: boolean
}) {
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ transform: `rotate(${rotate})` }}
    >
      {/* Tape strips */}
      {tapeLeft && (
        <Tape rotate="-15deg" top="-12px" left="18%" translateX="-50%" width={50} />
      )}
      {tapeRight && (
        <Tape rotate="12deg" top="-12px" left="80%" translateX="-50%" width={50} />
      )}
      {!tapeLeft && !tapeRight && (
        <Tape rotate="-3deg" top="-12px" left="50%" translateX="-50%" width={58} />
      )}

      <div
        style={{
          background: '#f5f0e8',
          padding: '10px 10px 28px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)',
          borderRadius: 2,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 1,
          }}
        />
        {label && (
          <p
            style={{
              textAlign: 'center',
              marginTop: 6,
              fontSize: 11,
              color: '#4a3060',
              fontFamily: 'var(--font-sans)',
              fontStyle: 'italic',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </p>
        )}
      </div>
    </div>
  )
}

/* ─── Notebook note ───────────────────────────────────────────────── */
function NotebookNote({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: 'linear-gradient(to bottom, #f8f0e3 0%, #f2e8d5 100%)',
        borderRadius: 4,
        boxShadow: '0 6px 28px rgba(0,0,0,0.5)',
        padding: '28px 24px 24px 52px',
        backgroundImage:
          'linear-gradient(to bottom, #f8f0e3 0%, #f2e8d5 100%), repeating-linear-gradient(transparent, transparent 27px, rgba(100,80,160,0.15) 27px, rgba(100,80,160,0.15) 28px)',
        backgroundBlendMode: 'multiply',
      }}
    >
      {/* Red margin line */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 40,
          width: 1,
          background: 'rgba(200,80,80,0.35)',
        }}
      />
      {/* Holes */}
      {[15, 48, 81].map((pct) => (
        <div
          key={pct}
          aria-hidden
          style={{
            position: 'absolute',
            left: 14,
            top: `${pct}%`,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#050308',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
          }}
        />
      ))}
      <Tape rotate="-4deg" top="-11px" left="38%" translateX="-50%" width={52} />
      <Tape rotate="6deg" top="-11px" left="72%" translateX="-50%" width={44} />
      {children}
    </div>
  )
}

/* ─── Kraft paper ─────────────────────────────────────────────────── */
function KraftPaper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: 'linear-gradient(135deg, #c8a870 0%, #b8915a 40%, #c4a06a 100%)',
        borderRadius: 4,
        boxShadow: '0 6px 28px rgba(0,0,0,0.5)',
        padding: '24px 20px',
      }}
    >
      <Tape rotate="3deg" top="-12px" left="25%" translateX="-50%" width={54} />
      <Tape rotate="-5deg" top="-12px" left="78%" translateX="-50%" width={46} />
      {children}
    </div>
  )
}

/* ─── Dark note (libreta negra) ───────────────────────────────────── */
function DarkNote({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: 'linear-gradient(135deg, #1a0e2e 0%, #120a22 100%)',
        border: '1px solid rgba(168,85,247,0.35)',
        borderRadius: 4,
        boxShadow: '0 6px 28px rgba(0,0,0,0.6), 0 0 30px rgba(168,85,247,0.08)',
        padding: '24px 20px',
      }}
    >
      <Tape rotate="-3deg" top="-11px" left="50%" translateX="-50%" width={52} />
      {children}
    </div>
  )
}

/* ─── Color swatch ────────────────────────────────────────────────── */
const COLORS = [
  { name: 'Morado', hex: '#7c3aed', glow: 'rgba(124,58,237,0.7)' },
  { name: 'Lila', hex: '#c084fc', glow: 'rgba(192,132,252,0.65)' },
  { name: 'Negro', hex: '#0d0d14', glow: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.25)' },
  { name: 'Blanco', hex: '#f0eeff', glow: 'rgba(240,238,255,0.45)' },
  { name: 'Rosado', hex: '#f472b6', glow: 'rgba(244,114,182,0.65)' },
  { name: 'Azul', hex: '#60a5fa', glow: 'rgba(96,165,250,0.55)' },
]

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function ConocienzoAIsabellaPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const heroRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const scrollDown = () =>
    heroRef.current?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: '#050308', fontFamily: 'var(--font-body)' }}
    >
      {/* ── Ambient glow ── */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 15% 25%, rgba(244,114,182,0.08) 0%, transparent 60%)',
        }}
      />

      {/* ────────────────────────────────────────────────────────────── */}
      {/* HEADER                                                        */}
      {/* ────────────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 gap-4"
        style={{
          background: 'rgba(5,3,8,0.86)',
          borderBottom: '1px solid rgba(168,85,247,0.2)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <a
          href="/"
          className="font-sans font-black italic text-base sm:text-lg"
          style={{ color: '#fff', textDecoration: 'none', letterSpacing: '-0.01em' }}
        >
          Isabella{' '}
          <span
            style={{
              color: '#c084fc',
              textShadow: '0 0 14px rgba(192,132,252,0.8)',
            }}
          >
            XV
          </span>
        </a>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
          style={{
            background: 'linear-gradient(135deg, #9333ea, #ec4899)',
            color: '#fff',
            boxShadow: '0 0 20px rgba(147,51,234,0.4)',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Volver a la invitación</span>
          <span className="sm:hidden">Volver</span>
        </button>
      </header>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* HERO                                                          */}
      {/* ────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-28 pb-16 px-5 overflow-hidden"
        style={{ minHeight: '92svh' }}
      >
        {/* Floating stars / doodles */}
        {['⋆', '✦', '✧', '⋆', '✦'].map((s, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute select-none pointer-events-none text-purple-400"
            style={{
              fontSize: [14, 10, 18, 12, 16][i],
              left: `${[8, 88, 15, 78, 55][i]}%`,
              top: `${[12, 8, 55, 45, 28][i]}%`,
              opacity: 0.5,
            }}
            animate={{ y: [-4, 4, -4], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          >
            {s}
          </motion.span>
        ))}

        <div className="max-w-6xl mx-auto">
          {/* ── Desktop: 3-column grid / Mobile: stacked ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-8 lg:gap-6 items-start">

            {/* Col 1: Foto Isabella */}
            <FadeIn delay={0.1} className="flex justify-center lg:justify-end lg:pt-8">
              <Polaroid
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_01-bgxvL7KJUFxdMOtPGfBZy7L44lUCZY.png"
                alt="Isabella, protagonista de la fiesta de XV"
                rotate="-3deg"
                className="w-[200px] sm:w-[240px] lg:w-[260px]"
                tapeLeft
                tapeRight
              />
            </FadeIn>

            {/* Col 2: Título central */}
            <FadeIn delay={0.15} className="text-center">
              <p
                className="text-xs font-semibold tracking-[0.35em] uppercase mb-3"
                style={{ color: '#c084fc' }}
              >
                Isabella XV
              </p>

              <h1
                className="font-sans leading-tight text-balance"
                style={{
                  fontSize: 'clamp(1.6rem, 5vw, 3rem)',
                  color: 'rgba(255,255,255,0.82)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                }}
              >
                Conociendo a
              </h1>
              <h1
                className="font-sans leading-none text-balance"
                style={{
                  fontSize: 'clamp(3rem, 10vw, 6rem)',
                  background: 'linear-gradient(135deg, #f9a8d4 0%, #c084fc 50%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  filter: 'drop-shadow(0 0 30px rgba(192,132,252,0.55))',
                  lineHeight: 1,
                }}
              >
                Isabella
              </h1>

              {/* Subrayado lila tipo marcador */}
              <div className="flex justify-center mt-2 mb-5">
                <svg
                  aria-hidden
                  width="260"
                  height="14"
                  viewBox="0 0 260 14"
                  fill="none"
                >
                  <path
                    d="M4 10 Q65 4 130 8 Q195 12 256 6"
                    stroke="#a855f7"
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                </svg>
              </div>

              {/* Chip subtítulo */}
              <div className="flex justify-center mb-5">
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
                  style={{
                    background: 'rgba(168,85,247,0.18)',
                    border: '1px solid rgba(168,85,247,0.4)',
                    color: '#dbb6ff',
                  }}
                >
                  Algunas cosas que me hacen feliz
                </span>
              </div>

              <p
                className="text-sm sm:text-base leading-relaxed text-pretty max-w-sm mx-auto"
                style={{ color: 'rgba(255,255,255,0.58)' }}
              >
                Para que me conozcan un poquito más y puedan sorprenderme con algo que tenga que ver conmigo{' '}
                <span style={{ color: '#f472b6' }}>✨</span>
              </p>

              {/* Scroll cue */}
              <motion.button
                type="button"
                onClick={scrollDown}
                className="mt-10 flex flex-col items-center gap-2 mx-auto"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                aria-label="Seguir leyendo"
              >
                <svg aria-hidden width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M7 10l7 7 7-7"
                    stroke="rgba(192,132,252,0.7)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            </FadeIn>

            {/* Col 3: Nota Sobre mí */}
            <FadeIn delay={0.25} className="flex justify-center lg:justify-start lg:pt-6">
              <div className="w-[200px] sm:w-[230px] lg:w-[250px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_02-TCluLuwzzghMmZki7QEIUVEF4ewjNI.png"
                  alt="Nota de cuaderno 'Sobre mí': Soy soñadora, creativa y súper curiosa"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))',
                  }}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* SECCIÓN: PASIÓN #1 — EL VÓLEY                               */}
      {/* ────────────────────────────────────────────────────────────── */}
      <section className="relative px-5 py-16 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px_1fr] gap-8 items-center">

            {/* Texto izquierda */}
            <FadeIn delay={0.05}>
              <div>
                <p
                  className="font-sans italic font-semibold mb-2"
                  style={{ color: '#c084fc', fontSize: '1.1rem' }}
                >
                  Pasión #1
                </p>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-sm font-bold tracking-wider uppercase"
                  style={{
                    background: 'rgba(168,85,247,0.15)',
                    border: '1px solid rgba(168,85,247,0.45)',
                    color: '#ddb6ff',
                    letterSpacing: '0.12em',
                  }}
                >
                  El Vóley{' '}
                  <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7 1.5C7 1.5 4 4.5 4 7C4 8.66 5.34 10 7 10C8.66 10 10 8.66 10 7C10 4.5 7 1.5 7 1.5Z"
                      stroke="#f472b6"
                      strokeWidth="1.2"
                    />
                    <path d="M7 10V12.5" stroke="#f472b6" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
                <p
                  className="text-sm leading-loose"
                  style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 2 }}
                >
                  Amo este deporte.<br />
                  Me enseñó disciplina,<br />
                  me reta cada día<br />
                  y me regaló amistades increíbles.<br />
                  Ver partidos también es mi plan favorito.
                </p>
              </div>
            </FadeIn>

            {/* Foto central */}
            <FadeIn delay={0.12} className="flex justify-center">
              <Polaroid
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_03-2bpjLQ5VJvtepMZ7az4eFGvJ9UBxqE.png"
                alt="Isabella con uniforme de vóley sosteniendo un balón"
                rotate="2deg"
                className="w-[210px] sm:w-[240px]"
                tapeLeft
                tapeRight
              />
            </FadeIn>

            {/* Collage pequeñas cosas (imagen) */}
            <FadeIn delay={0.2} className="flex flex-col items-center gap-4">
              <p
                className="font-sans italic font-semibold text-center"
                style={{ color: '#c084fc', fontSize: '1.05rem' }}
              >
                Pequeñas cosas<br />que me hacen feliz
              </p>
              <ul
                className="space-y-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {[
                  'Escuchar música',
                  'Dibujar y ser creativa',
                  'Disney',
                  'Anime',
                  'Peluches',
                  'Atardeceres',
                  'Detalles bonitos',
                  'Viajar y conocer lugares nuevos',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 1C6 1 3.5 3.5 3.5 5.5C3.5 6.88 4.62 8 6 8C7.38 8 8.5 6.88 8.5 5.5C8.5 3.5 6 1 6 1Z"
                        fill="#f472b6"
                        opacity="0.85"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div
        aria-hidden
        className="mx-auto my-2"
        style={{
          maxWidth: 560,
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.5), transparent)',
          boxShadow: '0 0 12px rgba(168,85,247,0.3)',
        }}
      />

      {/* ────────────────────────────────────────────────────────────── */}
      {/* SECCIÓN: PEQUEÑAS COSAS (collage imagen) + COLORES           */}
      {/* ────────────────────────────────────────────────────────────── */}
      <section className="relative px-5 py-16 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Collage imagen blog_04 */}
            <FadeIn delay={0.05} className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_04-DdSw739X0YRjjwG1in0Vr5kTc39Nmz.png"
                alt="Pequeñas cosas que me gustan: Arte, Disney y Peluches en fotos polaroid"
                style={{
                  width: '100%',
                  maxWidth: 420,
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 12px 36px rgba(0,0,0,0.65))',
                }}
              />
            </FadeIn>

            {/* Colores */}
            <FadeIn delay={0.15}>
              <p
                className="font-sans italic font-semibold mb-6"
                style={{ color: '#c084fc', fontSize: '1.2rem' }}
              >
                Colores que me representan{' '}
                <svg
                  aria-hidden
                  style={{ display: 'inline', verticalAlign: 'middle' }}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 1.5C8 1.5 5 5 5 7.5C5 9.16 6.34 10.5 8 10.5C9.66 10.5 11 9.16 11 7.5C11 5 8 1.5 8 1.5Z"
                    fill="#f472b6"
                    opacity="0.8"
                  />
                </svg>
              </p>

              <div className="flex flex-wrap gap-6">
                {COLORS.map((c, i) => (
                  <FadeIn key={c.name} delay={0.15 + i * 0.06}>
                    <motion.div
                      className="flex flex-col items-center gap-2"
                      whileHover={{ scale: 1.12 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: '50%',
                          background: c.hex,
                          boxShadow: `0 0 0 2px ${c.border ?? 'rgba(255,255,255,0.06)'}, 0 0 22px ${c.glow}`,
                          cursor: 'default',
                        }}
                      />
                      <p
                        className="text-xs font-semibold text-center font-sans italic"
                        style={{ color: 'rgba(255,255,255,0.72)' }}
                      >
                        {c.name}
                      </p>
                    </motion.div>
                  </FadeIn>
                ))}
              </div>

              {/* Mini quote */}
              <div
                className="mt-8 p-4 rounded-lg text-sm italic leading-relaxed"
                style={{
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.25)',
                  color: 'rgba(255,255,255,0.65)',
                  transform: 'rotate(-0.8deg)',
                  position: 'relative',
                }}
              >
                <Tape rotate="4deg" top="-10px" left="60%" translateX="-50%" width={46} />
                Me encantan las cosas con significado, los detalles pensados y todo lo que tenga mi estilo{' '}
                <span style={{ color: '#f472b6' }}>✦</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* SECCIÓN: MI MOOD                                             */}
      {/* ────────────────────────────────────────────────────────────── */}
      <section className="relative px-5 py-16 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Mi mood: texto + estilo */}
            <FadeIn delay={0.05}>
              <p
                className="font-sans italic font-semibold mb-5"
                style={{ color: '#c084fc', fontSize: '1.2rem' }}
              >
                Mi estilo{' '}
                <svg
                  aria-hidden
                  style={{ display: 'inline', verticalAlign: 'middle' }}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 1.5C8 1.5 5 5 5 7.5C5 9.16 6.34 10.5 8 10.5C9.66 10.5 11 9.16 11 7.5C11 5 8 1.5 8 1.5Z"
                    fill="#f472b6"
                    opacity="0.8"
                  />
                </svg>
              </p>

              <p
                className="text-base leading-relaxed mb-8"
                style={{ color: 'rgba(255,255,255,0.68)' }}
              >
                Cómodo, relajado y siempre con un toque de personalidad.
              </p>

              {/* Libreta oscura: Me gusta */}
              <DarkNote>
                <p
                  className="font-sans italic font-semibold mb-4"
                  style={{ color: '#c084fc', fontSize: '1rem' }}
                >
                  Me gusta
                </p>
                <ul className="space-y-2">
                  {[
                    'Accesorios',
                    'Gorros',
                    'Zapatillas lindas',
                    'Oversize',
                    'Colores neutros',
                    'Detalles minimalistas',
                    'Cosas de vóley',
                    'Cosas de anime',
                    'Detalles creativos',
                  ].map((item) => (
                    <li
                      key={item}
                      className="text-sm"
                      style={{ color: 'rgba(255,255,255,0.72)' }}
                    >
                      <span style={{ color: '#c084fc', marginRight: 8 }}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </DarkNote>
            </FadeIn>

            {/* Mi mood collage imagen */}
            <FadeIn delay={0.18} className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_05-cGA2APUcsyudgHXq9Dr2R2uaPaHkr9.png"
                alt="Mi mood: Moda, Música y Anime en polaroids"
                style={{
                  width: '100%',
                  maxWidth: 400,
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 12px 36px rgba(0,0,0,0.65))',
                }}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div
        aria-hidden
        className="mx-auto my-2"
        style={{
          maxWidth: 560,
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(244,114,182,0.5), transparent)',
          boxShadow: '0 0 12px rgba(244,114,182,0.3)',
        }}
      />

      {/* ────────────────────────────────────────────────────────────── */}
      {/* SECCIÓN: REFERENCIAS ÚTILES                                  */}
      {/* ────────────────────────────────────────────────────────────── */}
      <section className="relative px-5 py-16 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

            {/* Notebook references */}
            <FadeIn delay={0.05}>
              <NotebookNote>
                <h2
                  className="font-sans italic font-bold mb-4"
                  style={{ color: '#7c3aed', fontSize: '1.35rem' }}
                >
                  Sobre mí
                </h2>
                <p style={{ color: '#3a2060', lineHeight: 1.9, fontSize: 14 }}>
                  Soy soñadora, creativa y súper curiosa.
                </p>
                <p style={{ color: '#3a2060', lineHeight: 1.9, fontSize: 14 }}>
                  Me gusta reír mucho, disfrutar lo simple y pasarla bien con las personas que quiero.
                </p>
                {/* Doodle heart */}
                <svg
                  aria-hidden
                  style={{ position: 'absolute', bottom: 16, right: 20, opacity: 0.5 }}
                  width="32"
                  height="28"
                  viewBox="0 0 32 28"
                  fill="none"
                >
                  <path
                    d="M16 25C16 25 2 17 2 8C2 4.5 4.5 2 8 2C11 2 14 4 16 7C18 4 21 2 24 2C27.5 2 30 4.5 30 8C30 17 16 25 16 25Z"
                    stroke="#7c3aed"
                    strokeWidth="2"
                    fill="rgba(192,132,252,0.25)"
                  />
                </svg>
              </NotebookNote>
            </FadeIn>

            {/* Kraft: referencias útiles */}
            <FadeIn delay={0.15}>
              <KraftPaper>
                <h2
                  className="font-sans italic font-bold mb-5"
                  style={{ color: '#2d1a05', fontSize: '1.1rem' }}
                >
                  Referencias útiles{' '}
                  <svg
                    aria-hidden
                    style={{ display: 'inline', verticalAlign: 'middle' }}
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M7 1C7 1 4 4 4 6C4 7.66 5.34 9 7 9C8.66 9 10 7.66 10 6C10 4 7 1 7 1Z"
                      fill="#7c3aed"
                      opacity="0.8"
                    />
                  </svg>
                </h2>
                <ul className="space-y-3">
                  {[
                    { icon: '👕', label: 'Ropa', val: 'Por confirmar' },
                    { icon: '👟', label: 'Calzado', val: 'Por confirmar' },
                    { icon: '🎨', label: 'Colores favoritos', val: 'Morado, lila, negro, rosado, azul' },
                  ].map((row) => (
                    <li key={row.label} className="flex gap-3 items-start">
                      <span style={{ fontSize: 18, lineHeight: 1.4 }}>{row.icon}</span>
                      <div>
                        <p
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: '#5a3a10' }}
                        >
                          {row.label}
                        </p>
                        <p className="text-sm" style={{ color: '#2d1a05' }}>
                          {row.val}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Note at bottom */}
                <p
                  className="mt-5 text-xs italic"
                  style={{ color: 'rgba(45,26,5,0.6)', borderTop: '1px solid rgba(45,26,5,0.2)', paddingTop: 10 }}
                >
                  Solo referencias para inspirarte, sin obligaciones.
                </p>
              </KraftPaper>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* CIERRE                                                        */}
      {/* ────────────────────────────────────────────────────────────── */}
      <footer className="relative px-5 pt-8 pb-24 overflow-hidden">
        <div className="max-w-2xl mx-auto">
          <FadeIn delay={0.05}>
            {/* Tira de papel con tape */}
            <div
              className="relative px-8 py-10 text-center"
              style={{
                background: 'linear-gradient(to bottom, #f8f0e3, #f2e8d5)',
                borderRadius: 3,
                boxShadow: '0 8px 36px rgba(0,0,0,0.55)',
              }}
            >
              <Tape rotate="-4deg" top="-12px" left="22%" translateX="-50%" width={60} />
              <Tape rotate="5deg" top="-12px" left="78%" translateX="-50%" width={52} />

              {/* Doodle hearts */}
              <svg
                aria-hidden
                style={{ position: 'absolute', top: 12, right: 18, opacity: 0.4 }}
                width="24"
                height="22"
                viewBox="0 0 24 22"
                fill="none"
              >
                <path
                  d="M12 20C12 20 1 13 1 6C1 3.2 3.2 1 6 1C8.5 1 10.5 2.5 12 5C13.5 2.5 15.5 1 18 1C20.8 1 23 3.2 23 6C23 13 12 20 12 20Z"
                  stroke="#7c3aed"
                  strokeWidth="1.5"
                  fill="rgba(192,132,252,0.3)"
                />
              </svg>
              <svg
                aria-hidden
                style={{ position: 'absolute', bottom: 14, left: 16, opacity: 0.35 }}
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
              >
                <path
                  d="M9 14C9 14 1 9 1 4.5C1 2.4 2.4 1 4.5 1C6.2 1 7.7 2 9 3.8C10.3 2 11.8 1 13.5 1C15.6 1 17 2.4 17 4.5C17 9 9 14 9 14Z"
                  stroke="#f472b6"
                  strokeWidth="1.5"
                  fill="rgba(244,114,182,0.25)"
                />
              </svg>

              <p
                className="text-base leading-relaxed text-pretty"
                style={{ color: '#2d1a45', fontFamily: 'var(--font-sans)', fontStyle: 'italic' }}
              >
                <span style={{ color: '#7c3aed', fontWeight: 700 }}>No se trata</span> del regalo perfecto,<br />
                sino de un detalle hecho con cariño.<br />
                Lo más importante será compartir esta noche<br />
                con las personas que quiero.
              </p>
            </div>

            {/* Botón */}
            <div className="flex justify-center mt-8">
              <motion.button
                onClick={() => router.push('/')}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm"
                style={{
                  background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                  boxShadow: '0 0 28px rgba(147,51,234,0.4), 0 0 56px rgba(236,72,153,0.2)',
                  color: '#fff',
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a la invitación
              </motion.button>
            </div>
          </FadeIn>
        </div>
      </footer>
    </main>
  )
}
