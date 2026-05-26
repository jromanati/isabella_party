'use client'

import { useEffect, useState } from 'react'
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Tape strip (solo para elementos que NO son imágenes con tape propio) ─ */
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

/* ─── Color swatch ────────────────────────────────────────────────── */
const COLORS = [
  { name: 'Morado', hex: '#7c3aed', glow: 'rgba(124,58,237,0.7)' },
  { name: 'Lila', hex: '#c084fc', glow: 'rgba(192,132,252,0.65)' },
  { name: 'Negro', hex: '#0d0d14', glow: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.25)' },
  { name: 'Blanco', hex: '#f0eeff', glow: 'rgba(240,238,255,0.45)' },
  { name: 'Rosado', hex: '#f472b6', glow: 'rgba(244,114,182,0.65)' },
]

/* ─── Heart SVG inline ────────────────────────────────────────────── */
function HeartIcon({ color = '#f472b6', size = 14 }: { color?: string; size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
      <path
        d="M7 12C7 12 1 8 1 4C1 2.3 2.3 1 4 1C5.4 1 6.4 1.9 7 3C7.6 1.9 8.6 1 10 1C11.7 1 13 2.3 13 4C13 8 7 12 7 12Z"
        fill={color}
        opacity="0.85"
      />
    </svg>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────── */
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
          <span style={{ color: '#c084fc', textShadow: '0 0 14px rgba(192,132,252,0.8)' }}>XV</span>
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
      {/* SECCIÓN 1 — HERO: foto + título + nota "Sobre mí"             */}
      {/* ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-10 px-5 overflow-hidden">
        {/* Floating doodles */}
        {(['⋆', '✦', '✧', '⋆', '✦'] as const).map((s, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute select-none pointer-events-none text-purple-400"
            style={{
              fontSize: [14, 10, 18, 12, 16][i],
              left: `${[8, 88, 15, 78, 55][i]}%`,
              top: `${[12, 8, 55, 45, 28][i]}%`,
              opacity: 0.45,
            }}
            animate={{ y: [-4, 4, -4], opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          >
            {s}
          </motion.span>
        ))}

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_300px] gap-6 lg:gap-4 items-start">

            {/* Col 1 — Foto de Isabella (blog_01 ya tiene tape y papel rasgado) */}
            <FadeIn delay={0.08} className="flex justify-center lg:justify-end lg:pt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_01-bgxvL7KJUFxdMOtPGfBZy7L44lUCZY.png"
                alt="Isabella, protagonista de la fiesta de XV"
                style={{
                  width: '100%',
                  maxWidth: 340,
                  height: 'auto',
                  display: 'block',
                  transform: 'rotate(-4deg)',
                  filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.7))',
                }}
              />
            </FadeIn>

            {/* Col 2 — Título central */}
            <FadeIn delay={0.14} className="text-center flex flex-col items-center justify-start pt-4">
              <h1
                className="font-sans leading-tight text-balance"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
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
                  fontSize: 'clamp(3.2rem, 11vw, 6.5rem)',
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

              {/* Subrayado marcador */}
              <svg aria-hidden width="280" height="14" viewBox="0 0 280 14" fill="none" className="mt-1 mb-4">
                <path
                  d="M4 10 Q70 4 140 8 Q210 12 276 6"
                  stroke="#a855f7"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              </svg>

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
                className="text-sm sm:text-base leading-relaxed text-pretty max-w-xs mx-auto"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                Para que me conozcan un poquito más y puedan sorprenderme con algo que tenga que ver conmigo{' '}
                <span style={{ color: '#f472b6' }}>✨</span>
              </p>

              {/* Doodle corazón debajo */}
              <svg aria-hidden width="36" height="32" viewBox="0 0 36 32" fill="none" className="mt-6 opacity-60">
                <path
                  d="M18 28C18 28 2 19 2 9C2 5.1 5.1 2 9 2C12.5 2 15.5 4 18 7.5C20.5 4 23.5 2 27 2C30.9 2 34 5.1 34 9C34 19 18 28 18 28Z"
                  stroke="#c084fc"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </FadeIn>

            {/* Col 3 — Nota "Sobre mí" (blog_02 ya tiene estilo cuaderno) */}
            <FadeIn delay={0.22} className="flex justify-center lg:justify-start lg:pt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_02-TCluLuwzzghMmZki7QEIUVEF4ewjNI.png"
                alt="Nota de cuaderno 'Sobre mí': Soy soñadora, creativa y súper curiosa"
                style={{
                  width: '100%',
                  maxWidth: 300,
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.65))',
                }}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* SECCIÓN 2 — PASIÓN: texto vóley + foto + lista "pequeñas cosas" */}
      {/* ────────────────────────────────────────────────────────────── */}
      <section className="relative px-5 py-10 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px_1fr] gap-6 md:gap-4 items-center">

            {/* Texto pasión #1 */}
            <FadeIn delay={0.05}>
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
                El Vóley <HeartIcon color="#f472b6" />
              </div>
              <p className="text-sm leading-loose" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 2 }}>
                Amo este deporte.<br />
                Me enseñó disciplina,<br />
                me reta cada día<br />
                y me regaló amistades increíbles.<br />
                Ver partidos también es mi plan favorito.
              </p>
            </FadeIn>

            {/* Foto vóley (blog_03 ya tiene polaroid + tape) */}
            <FadeIn delay={0.12} className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_03-2bpjLQ5VJvtepMZ7az4eFGvJ9UBxqE.png"
                alt="Isabella con uniforme de vóley sosteniendo un balón"
                style={{
                  width: '100%',
                  maxWidth: 300,
                  height: 'auto',
                  display: 'block',
                  transform: 'rotate(3deg)',
                  filter: 'drop-shadow(0 12px 36px rgba(0,0,0,0.7))',
                }}
              />
            </FadeIn>

            {/* Lista pequeñas cosas */}
            <FadeIn delay={0.2}>
              <p
                className="font-sans italic font-semibold mb-4"
                style={{ color: '#c084fc', fontSize: '1.05rem', lineHeight: 1.4 }}
              >
                Pequeñas cosas<br />que me hacen feliz
              </p>
              <ul className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {[
                  'Escuchar música',
                  'Dibujar y ser creativa',
                  'Disney (soy fan total)',
                  'Comics y series',
                  'Atardeceres',
                  'Detalles bonitos',
                  'Viajar y conocer lugares nuevos',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <HeartIcon color="#f472b6" size={12} />
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
        className="mx-auto my-1"
        style={{
          maxWidth: 560,
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.5), transparent)',
          boxShadow: '0 0 12px rgba(168,85,247,0.3)',
        }}
      />

      {/* ────────────────────────────────────────────────────────────── */}
      {/* SECCIÓN 3 — COLORES + NOTA QUOTE + COLLAGE "MI MOOD"         */}
      {/* ────────────────────────────────────────────────────────────── */}
      <section className="relative px-5 py-10 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_1fr] gap-6 lg:gap-4 items-start">

            {/* Colores */}
            <FadeIn delay={0.05}>
              <p
                className="font-sans italic font-semibold mb-5"
                style={{ color: '#c084fc', fontSize: '1.15rem' }}
              >
                Colores que me representan <HeartIcon color="#f472b6" size={16} />
              </p>
              <div className="flex flex-wrap gap-5">
                {COLORS.map((c, i) => (
                  <motion.div
                    key={c.name}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.05 + i * 0.07 }}
                    whileHover={{ scale: 1.12 }}
                  >
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: '50%',
                        background: c.hex,
                        boxShadow: `0 0 0 2px ${c.border ?? 'rgba(255,255,255,0.06)'}, 0 0 22px ${c.glow}`,
                      }}
                    />
                    <p className="text-xs font-semibold text-center font-sans italic" style={{ color: 'rgba(255,255,255,0.72)' }}>
                      {c.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </FadeIn>

            {/* Nota quote (libreta morada/sticky) */}
            <FadeIn delay={0.12}>
              <div
                className="relative px-5 py-6 text-sm italic leading-relaxed"
                style={{
                  background: 'rgba(100,60,180,0.22)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  borderRadius: 4,
                  boxShadow: '0 6px 24px rgba(0,0,0,0.45)',
                  color: 'rgba(255,255,255,0.72)',
                  transform: 'rotate(-1.5deg)',
                }}
              >
                <Tape rotate="3deg" top="-11px" left="50%" translateX="-50%" width={52} />
                Me encantan las cosas con significado, los detalles pensados y todo lo que tenga mi estilo{' '}
                <span style={{ color: '#f472b6' }}>✦</span>
                <svg
                  aria-hidden
                  style={{ position: 'absolute', bottom: 10, right: 12, opacity: 0.45 }}
                  width="22" height="20" viewBox="0 0 22 20" fill="none"
                >
                  <path
                    d="M11 18C11 18 1 12 1 5.5C1 3.1 3.1 1 5.5 1C7.5 1 9.2 2.2 11 4.2C12.8 2.2 14.5 1 16.5 1C18.9 1 21 3.1 21 5.5C21 12 11 18 11 18Z"
                    stroke="#c084fc"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>
            </FadeIn>

            {/* Mi mood label + blog_05 */}
            <FadeIn delay={0.2}>
              <p
                className="font-sans italic font-semibold mb-3"
                style={{ color: '#c084fc', fontSize: '1.15rem' }}
              >
                Mi mood <HeartIcon color="#f472b6" size={16} />
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_05-cGA2APUcsyudgHXq9Dr2R2uaPaHkr9.png"
                alt="Mi mood: Moda, Música y Anime en polaroids"
                style={{
                  width: '100%',
                  maxWidth: 400,
                  height: 'auto',
                  display: 'block',
                  transform: 'rotate(2deg)',
                  filter: 'drop-shadow(0 12px 36px rgba(0,0,0,0.7))',
                }}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div
        aria-hidden
        className="mx-auto my-1"
        style={{
          maxWidth: 560,
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(244,114,182,0.5), transparent)',
          boxShadow: '0 0 12px rgba(244,114,182,0.3)',
        }}
      />

      {/* ────────────────────────────────────────────────────────────── */}
      {/* SECCIÓN 4 — ESTILO + "ME GUSTA" + REFERENCIAS + COLLAGE GUSTO */}
      {/* ────────────────────────────────────────────────────────────── */}
      <section className="relative px-5 py-10 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-6 lg:gap-4 items-start">

            {/* Col 1: Mi estilo + libreta "Me gusta" */}
            <FadeIn delay={0.05}>
              <p
                className="font-sans italic font-semibold mb-2"
                style={{ color: '#c084fc', fontSize: '1.1rem' }}
              >
                Mi estilo <HeartIcon color="#f472b6" size={14} />
              </p>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Cómodo, relajado y siempre con un toque de personalidad.
              </p>
              <DarkNote>
                <p className="font-sans italic font-semibold mb-3" style={{ color: '#c084fc', fontSize: '0.95rem' }}>
                  Me gusta
                </p>
                <ul className="space-y-1.5">
                  {[
                    'Accesorios',
                    'Gorros',
                    'Zapatos lindos',
                    'Oversize',
                    'Colores neutros',
                    'Detalles minimalistas',
                  ].map((item) => (
                    <li key={item} className="text-sm" style={{ color: 'rgba(255,255,255,0.72)', textAlign: 'center' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </DarkNote>
            </FadeIn>

            {/* Col 2: Referencias útiles (kraft) */}
            <FadeIn delay={0.12} className="flex flex-col gap-4">
              <KraftPaper>
                <h2
                  className="font-sans italic font-bold mb-4 uppercase tracking-wider text-xs"
                  style={{ color: '#2d1a05' }}
                >
                  Referencias Utiles <HeartIcon color="#7c3aed" size={13} />
                </h2>
                <ul className="space-y-3">
                  {[
                    { icon: '👕', label: 'Ropa:', val: 'Por confirmar' },
                    { icon: '👟', label: 'Calzado:', val: 'Por confirmar' },
                    { icon: '🎨', label: 'Colores favoritos:', val: 'Morado, lila, negro' },
                  ].map((row) => (
                    <li key={row.label} className="flex gap-3 items-start text-sm">
                      <span style={{ fontSize: 16, lineHeight: 1.5 }}>{row.icon}</span>
                      <div>
                        <span style={{ color: '#5a3a10', fontWeight: 700 }}>{row.label}</span>{' '}
                        <span style={{ color: '#2d1a05' }}>{row.val}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </KraftPaper>
            </FadeIn>

            {/* Col 3: Collage pequeñas cosas (blog_04) */}
            <FadeIn delay={0.2}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_04-DdSw739X0YRjjwG1in0Vr5kTc39Nmz.png"
                alt="Pequeñas cosas que me gustan: Arte, Disney y Peluches en fotos polaroid"
                style={{
                  width: '100%',
                  maxWidth: 420,
                  height: 'auto',
                  display: 'block',
                  transform: 'rotate(-2deg)',
                  filter: 'drop-shadow(0 12px 36px rgba(0,0,0,0.7))',
                }}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* CIERRE                                                        */}
      {/* ────────────────────────────────────────────────────────────── */}
      <footer className="relative px-5 pt-6 pb-24 overflow-hidden">
        <div className="max-w-2xl mx-auto">
          <FadeIn delay={0.05}>
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

              <svg aria-hidden style={{ position: 'absolute', top: 14, right: 18, opacity: 0.4 }} width="24" height="22" viewBox="0 0 24 22" fill="none">
                <path d="M12 20C12 20 1 13 1 6C1 3.2 3.2 1 6 1C8.5 1 10.5 2.5 12 5C13.5 2.5 15.5 1 18 1C20.8 1 23 3.2 23 6C23 13 12 20 12 20Z" stroke="#7c3aed" strokeWidth="1.5" fill="rgba(192,132,252,0.3)" />
              </svg>
              <svg aria-hidden style={{ position: 'absolute', bottom: 14, left: 16, opacity: 0.35 }} width="18" height="16" viewBox="0 0 18 16" fill="none">
                <path d="M9 14C9 14 1 9 1 4.5C1 2.4 2.4 1 4.5 1C6.2 1 7.7 2 9 3.8C10.3 2 11.8 1 13.5 1C15.6 1 17 2.4 17 4.5C17 9 9 14 9 14Z" stroke="#f472b6" strokeWidth="1.5" fill="rgba(244,114,182,0.25)" />
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

            <div className="flex justify-center mt-8">
              <motion.button
                onClick={() => router.push('/')}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm"
                style={{
                  background: '#7c3aed',
                  boxShadow: '0 0 28px rgba(124,58,237,0.45)',
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
