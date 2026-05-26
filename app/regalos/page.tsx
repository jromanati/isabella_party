'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

/* ─── Fade-in ──────────────────────────────────────────────────────── */
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
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Heart SVG doodle ─────────────────────────────────────────────── */
function HeartDoodle({ size = 28, color = '#c084fc', fill = 'rgba(192,132,252,0.25)', className = '' }: { size?: number; color?: string; fill?: string; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size * 0.88} viewBox="0 0 28 25" fill="none" className={className}>
      <path
        d="M14 23C14 23 1.5 15 1.5 7C1.5 3.9 3.9 1.5 7 1.5C9.8 1.5 12.1 3.2 14 6C15.9 3.2 18.2 1.5 21 1.5C24.1 1.5 26.5 3.9 26.5 7C26.5 15 14 23 14 23Z"
        stroke={color}
        strokeWidth="1.6"
        fill={fill}
      />
    </svg>
  )
}

/* ─── Sparkle ──────────────────────────────────────────────────────── */
function Sparkle({ size = 16, color = '#c084fc' }: { size?: number; color?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1L8.8 6.2L14 7L8.8 7.8L8 13L7.2 7.8L2 7L7.2 6.2L8 1Z" fill={color} opacity="0.85" />
    </svg>
  )
}

/* ─── Tape strip ───────────────────────────────────────────────────── */
function Tape({
  rotate = '-2deg',
  top = '-10px',
  left = '50%',
  translateX = '-50%',
  width = 52,
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
        height: 20,
        background: 'rgba(220,190,135,0.48)',
        borderRadius: 3,
        boxShadow: '0 1px 4px rgba(0,0,0,0.28)',
        backdropFilter: 'blur(2px)',
        zIndex: 10,
      }}
    />
  )
}

/* ─── Script-style section title ──────────────────────────────────── */
function ScriptTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={className}
      style={{
        fontFamily: 'var(--font-sans)',
        fontStyle: 'italic',
        fontWeight: 400,
        color: '#c084fc',
        fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
        lineHeight: 1.3,
        textShadow: '0 0 20px rgba(192,132,252,0.4)',
      }}
    >
      {children}
    </p>
  )
}

/* ─── Colors ───────────────────────────────────────────────────────── */
const COLORS = [
  { name: 'Morado', hex: '#6d28d9', border: '2px solid rgba(255,255,255,0.1)' },
  { name: 'Lila', hex: '#a78bfa', border: '2px solid rgba(255,255,255,0.1)' },
  { name: 'Negro', hex: '#111118', border: '2px solid rgba(255,255,255,0.22)' },
  { name: 'Blanco', hex: '#e8e4f0', border: '2px solid rgba(255,255,255,0.15)' },
  { name: 'Rosado', hex: '#f9a8d4', border: '2px solid rgba(255,255,255,0.1)' },
]

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function ConocienzoAIsabellaPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

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
            'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(124,58,237,0.16) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 10% 30%, rgba(244,114,182,0.07) 0%, transparent 55%)',
        }}
      />

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* HEADER                                                          */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 sm:px-10 py-3 gap-4"
        style={{
          background: 'rgba(5,3,8,0.88)',
          borderBottom: '1px solid rgba(168,85,247,0.18)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <a
          href="/"
          className="font-sans font-black italic text-base sm:text-lg"
          style={{ color: '#fff', textDecoration: 'none' }}
        >
          Isabella{' '}
          <span style={{ color: '#c084fc', textShadow: '0 0 12px rgba(192,132,252,0.8)' }}>XV</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {['Inicio', 'Itinerario', 'Lugar', 'Código de vestimenta', 'Confirma tu asistencia'].map((item) => (
            <a key={item} href="/" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }} className="hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all"
          style={{
            background: '#7c3aed',
            color: '#fff',
            boxShadow: '0 0 18px rgba(124,58,237,0.45)',
            letterSpacing: '0.08em',
          }}
        >
          <span className="hidden sm:inline">Conóceme</span>
          <span className="sm:hidden"><ArrowLeft className="w-4 h-4" /></span>
        </button>
      </header>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* SECCIÓN 1 — HERO: foto | título | sobre mí                     */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_240px] gap-6 lg:gap-8 items-start">

            {/* Col 1: foto Isabella (ya tiene tape/polaroid en la imagen) */}
            <FadeIn delay={0.05} className="flex justify-center lg:justify-end pt-4 lg:pt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_01-bgxvL7KJUFxdMOtPGfBZy7L44lUCZY.png"
                alt="Isabella, protagonista de la fiesta de XV"
                style={{
                  width: '100%',
                  maxWidth: 250,
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 12px 36px rgba(0,0,0,0.7))',
                }}
              />
            </FadeIn>

            {/* Col 2: título central */}
            <FadeIn delay={0.1} className="text-center flex flex-col items-center">
              {/* Sparkles decorativos */}
              <div className="flex gap-6 mb-3 items-center justify-center" aria-hidden>
                <Sparkle size={12} color="#c084fc" />
                <Sparkle size={16} color="#c084fc" />
                <Sparkle size={10} color="#f472b6" />
              </div>

              {/* "Conociendo a" */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
                  color: 'rgba(255,255,255,0.88)',
                  marginBottom: 0,
                  lineHeight: 1.1,
                }}
              >
                Conociendo a
              </p>

              {/* "Isabella" neon script */}
              <h1
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontStyle: 'italic',
                  fontWeight: 900,
                  fontSize: 'clamp(3.5rem, 10vw, 6.5rem)',
                  lineHeight: 1,
                  marginBottom: 0,
                  background: 'linear-gradient(135deg, #f9a8d4 0%, #c084fc 45%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 28px rgba(192,132,252,0.6))',
                }}
              >
                Isabella
              </h1>

              {/* Heart doodle */}
              <HeartDoodle size={22} color="#f472b6" fill="rgba(244,114,182,0.2)" className="mt-1 mb-3" />

              {/* Banner "Algunas cosas que me hacen feliz" */}
              <div
                className="relative inline-block px-6 py-2 mb-5"
                style={{
                  background: 'rgba(124,58,237,0.55)',
                  borderRadius: 3,
                  boxShadow: '0 2px 16px rgba(124,58,237,0.35)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                    color: '#fff',
                    margin: 0,
                    textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                  }}
                >
                  Algunas cosas que me hacen feliz
                </p>
              </div>

              <p
                className="text-sm leading-relaxed text-pretty max-w-xs"
                style={{ color: 'rgba(255,255,255,0.58)', textAlign: 'center' }}
              >
                Para que me conozcan un poquito más<br />
                y puedan sorprenderme con algo<br />
                que tenga que ver conmigo{' '}
                <span style={{ color: '#f472b6' }}>✨</span>
              </p>

              <HeartDoodle size={26} color="#c084fc" fill="rgba(192,132,252,0.18)" className="mt-6" />
            </FadeIn>

            {/* Col 3: nota "Sobre mí" (ya tiene efecto cuaderno en la imagen) */}
            <FadeIn delay={0.18} className="flex justify-center lg:justify-start pt-2 lg:pt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_02-TCluLuwzzghMmZki7QEIUVEF4ewjNI.png"
                alt="Nota de cuaderno 'Sobre mí' de Isabella"
                style={{
                  width: '100%',
                  maxWidth: 230,
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.65))',
                }}
              />
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* SECCIÓN 2 — PASIÓN | FOTO VÓLEY | PEQUEÑAS COSAS + COLLAGE    */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-8 pt-4 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px_1fr] gap-8 items-start">

            {/* Col 1: Pasión #1 */}
            <FadeIn delay={0.05}>
              <ScriptTitle className="mb-2">Pasión #1</ScriptTitle>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded mb-4 text-xs font-bold tracking-widest uppercase"
                style={{
                  background: 'rgba(124,58,237,0.18)',
                  border: '1px solid rgba(124,58,237,0.45)',
                  color: '#ddb6ff',
                  letterSpacing: '0.14em',
                }}
              >
                El Vóley <HeartDoodle size={13} color="#f472b6" fill="none" />
              </div>
              <p
                className="text-sm leading-loose"
                style={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.95 }}
              >
                Amo este deporte.<br />
                Me enseña disciplina,<br />
                me reta cada día y me<br />
                regala amistades increíbles.<br />
                Ver partidos también<br />
                es mi plan favorito.
              </p>
            </FadeIn>

            {/* Col 2: foto vóley */}
            <FadeIn delay={0.1} className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_03-2bpjLQ5VJvtepMZ7az4eFGvJ9UBxqE.png"
                alt="Isabella con uniforme de vóley sosteniendo un balón"
                style={{
                  width: '100%',
                  maxWidth: 230,
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.7))',
                }}
              />
            </FadeIn>

            {/* Col 3: lista + collage blog_04 */}
            <FadeIn delay={0.16} className="flex flex-col gap-5">
              <div>
                <ScriptTitle className="mb-3">
                  Pequeñas cosas<br />que me hacen feliz
                </ScriptTitle>
                <ul className="space-y-1.5">
                  {[
                    'Escuchar música',
                    'Dibujar y ser creativa',
                    'Disney (soy fan total)',
                    'Comics y series',
                    'Atardeceres',
                    'Detalles bonitos',
                    'Viajar y conocer lugares nuevos',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <HeartDoodle size={11} color="#f472b6" fill="none" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Collage "pequeñas cosas que me gustan" */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_04-DdSw739X0YRjjwG1in0Vr5kTc39Nmz.png"
                alt="Pequeñas cosas que me gustan: Arte, Disney y Peluches"
                style={{
                  width: '100%',
                  maxWidth: 280,
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.65))',
                }}
              />
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* SECCIÓN 3 — COLORES | STICKY NOTE | MI MOOD                    */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_1fr] gap-8 items-start">

            {/* Col 1: Colores que me representan */}
            <FadeIn delay={0.05}>
              <ScriptTitle className="mb-5">
                Colores que me representan <HeartDoodle size={14} color="#c084fc" fill="none" />
              </ScriptTitle>
              <div className="flex flex-wrap gap-5">
                {COLORS.map((c) => (
                  <motion.div
                    key={c.name}
                    className="flex flex-col items-center gap-2"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: '50%',
                        background: c.hex,
                        border: c.border,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                      }}
                    />
                    <p
                      className="text-xs font-sans italic"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {c.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </FadeIn>

            {/* Col 2: sticky note morada */}
            <FadeIn delay={0.12} className="flex justify-center">
              <div
                className="relative px-5 py-6 text-sm leading-relaxed"
                style={{
                  background: 'rgba(109,40,217,0.32)',
                  border: '1px solid rgba(168,85,247,0.35)',
                  borderRadius: 3,
                  boxShadow: '0 6px 24px rgba(0,0,0,0.45)',
                  transform: 'rotate(-1.2deg)',
                  maxWidth: 210,
                }}
              >
                <Tape rotate="-3deg" top="-11px" left="50%" translateX="-50%" width={50} />
                <p style={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', lineHeight: 1.8 }}>
                  Me encantan las cosas con significado, los detalles pensados y todo lo que tenga mi estilo{' '}
                  <span style={{ color: '#f472b6' }}>✦</span>
                </p>
                <HeartDoodle size={18} color="#c084fc" fill="rgba(192,132,252,0.2)" className="mt-3" />
              </div>
            </FadeIn>

            {/* Col 3: Mi mood + collage blog_05 */}
            <FadeIn delay={0.18} className="flex flex-col gap-4 items-start">
              <ScriptTitle>
                Mi mood <HeartDoodle size={14} color="#c084fc" fill="none" />
              </ScriptTitle>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_05-cGA2APUcsyudgHXq9Dr2R2uaPaHkr9.png"
                alt="Mi mood: Moda, Música y Anime en fotos polaroid"
                style={{
                  width: '100%',
                  maxWidth: 280,
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.65))',
                }}
              />
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* SECCIÓN 4 — MI ESTILO | ME GUSTA | REFERENCIAS ÚTILES          */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-8 items-start">

            {/* Col 1: Mi estilo */}
            <FadeIn delay={0.05}>
              <ScriptTitle className="mb-3">
                Mi estilo <HeartDoodle size={14} color="#c084fc" fill="none" />
              </ScriptTitle>
              <p className="text-sm leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Cómodo, relajado y siempre con un toque de personalidad.
              </p>
            </FadeIn>

            {/* Col 2: Me gusta (libreta oscura) */}
            <FadeIn delay={0.1}>
              <div
                className="relative px-5 py-6"
                style={{
                  background: 'linear-gradient(135deg, #18102e 0%, #0e0820 100%)',
                  border: '1px solid rgba(168,85,247,0.28)',
                  borderRadius: 3,
                  boxShadow: '0 6px 24px rgba(0,0,0,0.55)',
                  transform: 'rotate(0.5deg)',
                }}
              >
                <Tape rotate="-2deg" top="-11px" left="50%" translateX="-50%" width={50} />
                <p
                  className="font-sans italic font-semibold mb-4 text-base"
                  style={{ color: '#c084fc' }}
                >
                  Me gusta
                </p>
                <ul className="space-y-2">
                  {[
                    'Accesorios',
                    'Gorros',
                    'Zapatos lindos',
                    'Oversize',
                    'Colores neutros',
                    'Detalles minimalistas',
                  ].map((item) => (
                    <li
                      key={item}
                      className="text-sm text-center"
                      style={{ color: 'rgba(255,255,255,0.75)' }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Col 3: Referencias útiles (kraft) */}
            <FadeIn delay={0.16}>
              <div
                className="relative px-5 py-6"
                style={{
                  background: 'linear-gradient(135deg, #c8a870 0%, #b8915a 55%, #c4a06a 100%)',
                  borderRadius: 3,
                  boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
                  transform: 'rotate(-0.6deg)',
                }}
              >
                <Tape rotate="4deg" top="-11px" left="28%" translateX="-50%" width={50} />
                <Tape rotate="-3deg" top="-11px" left="75%" translateX="-50%" width={44} />

                {/* Header con borde morado */}
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded mb-5"
                  style={{
                    background: 'rgba(30,10,60,0.85)',
                    border: '2px solid #7c3aed',
                    display: 'inline-flex',
                  }}
                >
                  <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#c084fc', letterSpacing: '0.12em' }}>
                    Referencias útiles
                  </p>
                  <HeartDoodle size={13} color="#c084fc" fill="rgba(192,132,252,0.2)" />
                </div>

                <ul className="space-y-4">
                  {[
                    { emoji: '👕', label: 'Ropa:', val: 'Por confirmar' },
                    { emoji: '👟', label: 'Calzado:', val: 'Por confirmar' },
                    { emoji: '🎨', label: 'Colores favoritos:', val: 'Morado, lila, negro' },
                  ].map((row) => (
                    <li key={row.label} className="flex items-start gap-3">
                      <span style={{ fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>{row.emoji}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold" style={{ color: '#2d1505' }}>{row.label}</span>
                        <span className="text-sm" style={{ color: '#3a1e08' }}>{row.val}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* CIERRE — banner mensaje + botón CTA                            */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <footer className="relative px-4 sm:px-8 pt-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <FadeIn delay={0.05}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 items-center">

              {/* Tira de papel con mensaje */}
              <div
                className="relative px-8 py-8"
                style={{
                  background: 'linear-gradient(to bottom, #f8f0e3, #f0e4cc)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
                }}
              >
                <Tape rotate="-4deg" top="-12px" left="18%" translateX="-50%" width={58} />
                <Tape rotate="4deg" top="-12px" left="82%" translateX="-50%" width={50} />

                {/* Heart doodles decorativos */}
                <HeartDoodle
                  size={22}
                  color="#7c3aed"
                  fill="rgba(192,132,252,0.3)"
                  className="absolute top-3 right-4"
                />
                <HeartDoodle
                  size={16}
                  color="#f472b6"
                  fill="rgba(244,114,182,0.2)"
                  className="absolute bottom-4 left-4"
                />

                {/* Hearts + texto */}
                <div className="flex items-start gap-3">
                  <HeartDoodle size={28} color="#7c3aed" fill="rgba(192,132,252,0.3)" />
                  <p
                    className="text-sm sm:text-base leading-relaxed text-pretty"
                    style={{ color: '#2d1a45', fontFamily: 'var(--font-sans)', fontStyle: 'italic' }}
                  >
                    <span style={{ color: '#7c3aed', fontWeight: 700 }}>No se trata</span> del regalo perfecto,<br />
                    sino de un detalle hecho con cariño.<br />
                    Lo más importante será compartir esta noche<br />
                    con las personas que quiero.
                  </p>
                  <HeartDoodle size={28} color="#f472b6" fill="rgba(244,114,182,0.25)" />
                </div>
              </div>

              {/* Imagen atardecer / foto complementaria usando blog_03 rotated como accent */}
              <div
                className="relative overflow-hidden rounded-sm"
                style={{
                  boxShadow: '0 10px 32px rgba(0,0,0,0.65)',
                  transform: 'rotate(1.5deg)',
                  border: '6px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_01-bgxvL7KJUFxdMOtPGfBZy7L44lUCZY.png"
                  alt="Isabella"
                  style={{
                    width: '100%',
                    height: 220,
                    objectFit: 'cover',
                    objectPosition: 'top',
                    display: 'block',
                  }}
                />
              </div>

            </div>

            {/* CTA Button */}
            <div className="flex justify-center mt-10">
              <motion.button
                type="button"
                onClick={() => router.push('/')}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded font-semibold text-sm tracking-wide"
                style={{
                  background: '#7c3aed',
                  color: '#fff',
                  boxShadow: '0 0 26px rgba(124,58,237,0.45), 0 4px 16px rgba(0,0,0,0.4)',
                  letterSpacing: '0.04em',
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
