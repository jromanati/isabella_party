'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

/* ─── Fade-in on scroll ─────────────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  className = '',
  style = {},
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/* ─── Tape strip ────────────────────────────────────────────────── */
function Tape({
  rotate = '-2deg',
  top = '-12px',
  left = '50%',
  tx = '-50%',
  w = 58,
}: {
  rotate?: string
  top?: string
  left?: string
  tx?: string
  w?: number
}) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top,
        left,
        transform: `translateX(${tx}) rotate(${rotate})`,
        width: w,
        height: 22,
        background: 'rgba(210,175,115,0.55)',
        borderRadius: 3,
        boxShadow: '0 1px 5px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(2px)',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    />
  )
}

/* ─── Heart SVG ─────────────────────────────────────────────────── */
function Heart({ color = '#f472b6', size = 14 }: { color?: string; size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
      <path d="M7 12C7 12 1 8 1 4C1 2.3 2.3 1 4 1C5.4 1 6.4 1.9 7 3C7.6 1.9 8.6 1 10 1C11.7 1 13 2.3 13 4C13 8 7 12 7 12Z" fill={color} opacity="0.9" />
    </svg>
  )
}

/* ─── Sparkle doodle ────────────────────────────────────────────── */
function Sparkle({ size = 16, color = '#c084fc', style = {} }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: 'inline', ...style }}>
      <path d="M8 1 L8.8 6.2 L14 8 L8.8 9.8 L8 15 L7.2 9.8 L2 8 L7.2 6.2 Z" fill={color} opacity="0.7" />
    </svg>
  )
}

/* ─── Doodle heart outline ──────────────────────────────────────── */
function HeartOutline({ size = 32, color = '#c084fc', style = {} }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 32 28" fill="none" style={style}>
      <path d="M16 25C16 25 2 17 2 8.5C2 5.1 4.9 2 8.5 2C11.4 2 13.9 3.8 16 6.5C18.1 3.8 20.6 2 23.5 2C27.1 2 30 5.1 30 8.5C30 17 16 25 16 25Z" stroke={color} strokeWidth="1.8" fill="none" opacity="0.6" />
    </svg>
  )
}

/* ─── Color swatches ────────────────────────────────────────────── */
const COLORS = [
  { name: 'Morado', hex: '#7c3aed', glow: 'rgba(124,58,237,0.75)' },
  { name: 'Lila', hex: '#c084fc', glow: 'rgba(192,132,252,0.7)' },
  { name: 'Negro', hex: '#111118', glow: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.22)' },
  { name: 'Blanco', hex: '#f0eeff', glow: 'rgba(240,238,255,0.5)' },
  { name: 'Rosado', hex: '#f472b6', glow: 'rgba(244,114,182,0.7)' },
]

/* ══════════════════════════════════════════════════════════════════ */
export default function ConocienzoAIsabellaPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <main
      className="overflow-x-hidden"
      style={{ background: '#050308', minHeight: '100vh' }}
    >
      {/* Ambient glow background */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(124,58,237,0.22) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 10% 30%, rgba(244,114,182,0.1) 0%, transparent 55%), radial-gradient(ellipse 45% 35% at 90% 60%, rgba(168,85,247,0.1) 0%, transparent 55%)',
        }}
      />

      {/* ── HEADER sticky ─────────────────────────────────────────── */}
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 sm:px-10 py-3"
        style={{
          background: 'rgba(5,3,8,0.88)',
          borderBottom: '1px solid rgba(168,85,247,0.22)',
          backdropFilter: 'blur(22px)',
        }}
      >
        <a
          href="/"
          style={{ textDecoration: 'none', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.01em', fontSize: '1.05rem' }}
        >
          Isabella{' '}
          <span style={{ color: '#c084fc', textShadow: '0 0 16px rgba(192,132,252,0.85)' }}>XV</span>
        </a>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)', color: '#fff', boxShadow: '0 0 22px rgba(147,51,234,0.45)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Volver a la invitación</span>
          <span className="sm:hidden">Volver</span>
        </button>
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ROW 1 — HERO                                               */}
      {/* foto grande + título neon + cuaderno "Sobre mí"            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-4 px-4 sm:px-8">
        {/* Floating sparkles decorativos */}
        {[
          { s: '✦', x: '6%', y: '14%', size: 13, delay: 0 },
          { s: '✧', x: '92%', y: '9%', size: 10, delay: 0.6 },
          { s: '⋆', x: '14%', y: '62%', size: 16, delay: 1.2 },
          { s: '✦', x: '82%', y: '50%', size: 11, delay: 0.3 },
          { s: '✧', x: '50%', y: '80%', size: 9, delay: 0.9 },
          { s: '✦', x: '38%', y: '18%', size: 8, delay: 1.5 },
        ].map((d, i) => (
          <motion.span
            key={i}
            aria-hidden
            style={{ position: 'absolute', left: d.x, top: d.y, fontSize: d.size, color: '#c084fc', opacity: 0.45, pointerEvents: 'none', zIndex: 1 }}
            animate={{ y: [-5, 5, -5], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
          >
            {d.s}
          </motion.span>
        ))}

        <div
          className="max-w-6xl mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1.3fr) minmax(0,1fr)',
            gap: '0px 12px',
            alignItems: 'flex-start',
          }}
        >
          {/* Col 1 — Foto Isabella (blog_01 ya tiene tape y paper tear) */}
          <FadeIn delay={0.06} style={{ zIndex: 3, position: 'relative', marginTop: '8px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_01-bgxvL7KJUFxdMOtPGfBZy7L44lUCZY.png"
              alt="Isabella, protagonista de la fiesta de XV"
              style={{
                width: '100%',
                maxWidth: 360,
                height: 'auto',
                display: 'block',
                transform: 'rotate(-5deg) translateX(-8px)',
                filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.75))',
              }}
            />
          </FadeIn>

          {/* Col 2 — Título central */}
          <FadeIn
            delay={0.12}
            style={{ zIndex: 4, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '12px', textAlign: 'center' }}
          >
            {/* Doodle stars arriba del título */}
            <div style={{ position: 'absolute', top: 0, left: '8%', display: 'flex', gap: 4, opacity: 0.6 }}>
              <Sparkle size={14} color="#c084fc" />
              <Sparkle size={10} color="#f472b6" style={{ marginTop: 6 }} />
              <Sparkle size={16} color="#c084fc" style={{ marginTop: 2 }} />
            </div>
            <div style={{ position: 'absolute', top: 4, right: '6%', opacity: 0.5 }}>
              <HeartOutline size={28} color="#f472b6" />
            </div>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(1.2rem, 3.2vw, 2rem)',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: 2,
                letterSpacing: '0.01em',
              }}
            >
              Conociendo a
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontStyle: 'italic',
                fontWeight: 900,
                fontSize: 'clamp(3.5rem, 10vw, 7rem)',
                background: 'linear-gradient(135deg, #f9a8d4 0%, #c084fc 50%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 0.95,
                filter: 'drop-shadow(0 0 35px rgba(192,132,252,0.6))',
                margin: '0 0 6px',
              }}
            >
              Isabella
            </h1>

            {/* Línea marcador cursivo */}
            <svg aria-hidden width="78%" height="14" viewBox="0 0 300 14" fill="none" style={{ marginBottom: 14 }}>
              <path d="M4 10 Q75 3 150 8 Q225 13 296 6" stroke="#a855f7" strokeWidth="5.5" strokeLinecap="round" opacity="0.72" />
            </svg>

            {/* Chip subtítulo con estilo brush */}
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(168,85,247,0.15)',
                border: '1px solid rgba(168,85,247,0.42)',
                borderRadius: 999,
                padding: '6px 18px',
                marginBottom: 16,
              }}
            >
              <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontSize: '0.88rem', color: '#dbb6ff', letterSpacing: '0.02em' }}>
                Algunas cosas que me hacen feliz
              </span>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.52)', lineHeight: 1.7, maxWidth: 280, marginBottom: 16 }}>
              Para que me conozcan un poquito más y puedan sorprenderme con algo que tenga que ver conmigo{' '}
              <span style={{ color: '#f472b6' }}>✨</span>
            </p>

            <HeartOutline size={36} color="#c084fc" />
          </FadeIn>

          {/* Col 3 — Nota "Sobre mí" (blog_02 ya tiene estilo cuaderno) */}
          <FadeIn
            delay={0.22}
            style={{ zIndex: 3, position: 'relative', marginTop: '24px', marginLeft: '-20px' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_02-TCluLuwzzghMmZki7QEIUVEF4ewjNI.png"
              alt="Nota de cuaderno 'Sobre mí': Soy soñadora, creativa y súper curiosa"
              style={{
                width: '100%',
                maxWidth: 310,
                height: 'auto',
                display: 'block',
                transform: 'rotate(3.5deg)',
                filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.68))',
              }}
            />
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ROW 2 — PASIÓN #1 VÓLEY + foto + "Pequeñas cosas"         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-8 pt-2 pb-4">
        <div
          className="max-w-6xl mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr) minmax(0,1.1fr)',
            gap: '0 16px',
            alignItems: 'flex-start',
          }}
        >
          {/* Col 1 — Pasión texto */}
          <FadeIn delay={0.04} style={{ paddingTop: 32, paddingRight: 8 }}>
            <p
              style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontWeight: 600, color: '#c084fc', fontSize: '1.05rem', marginBottom: 8 }}
            >
              Pasión #1
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(168,85,247,0.14)',
                border: '1px solid rgba(168,85,247,0.45)',
                borderRadius: 999,
                padding: '5px 14px',
                marginBottom: 16,
                color: '#ddb6ff',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              El Vóley <Heart color="#f472b6" size={12} />
            </div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.68)', lineHeight: 2.1 }}>
              Amo este deporte.<br />
              Me enseña disciplina,<br />
              me reta cada día y me<br />
              regala amistades increíbles.<br />
              Ver partidos también<br />
              es mi plan favorito.
            </p>
          </FadeIn>

          {/* Col 2 — Foto vóley (blog_03 ya tiene polaroid + tape) */}
          <FadeIn delay={0.1} style={{ zIndex: 3, position: 'relative', marginTop: '-10px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_03-2bpjLQ5VJvtepMZ7az4eFGvJ9UBxqE.png"
              alt="Isabella con uniforme de vóley sosteniendo un balón"
              style={{
                width: '100%',
                maxWidth: 340,
                height: 'auto',
                display: 'block',
                transform: 'rotate(2.5deg)',
                filter: 'drop-shadow(0 14px 42px rgba(0,0,0,0.72))',
              }}
            />
            {/* Heart doodle encima de la foto en la esquina inferior */}
            <div style={{ position: 'absolute', bottom: '14%', right: '4%', opacity: 0.7 }}>
              <HeartOutline size={30} color="#f472b6" />
            </div>
          </FadeIn>

          {/* Col 3 — "Pequeñas cosas" lista + blog_04 superpuesto parcialmente */}
          <FadeIn delay={0.18} style={{ position: 'relative', paddingTop: 16 }}>
            <p
              style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontWeight: 600, color: '#c084fc', fontSize: '1rem', lineHeight: 1.4, marginBottom: 14 }}
            >
              Pequeñas cosas<br />que me hacen feliz
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Escuchar música',
                'Dibujar y ser creativa',
                'Disney (soy fan total)',
                'Comics y series',
                'Atardeceres',
                'Detalles bonitos',
                'Viajar y conocer lugares nuevos',
              ].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)' }}>
                  <Heart color="#f472b6" size={12} />
                  {item}
                </li>
              ))}
            </ul>
            {/* blog_04 como collage flotando abajo-derecha */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_04-DdSw739X0YRjjwG1in0Vr5kTc39Nmz.png"
              alt="Pequeñas cosas que me gustan: Arte, Disney y Peluches en fotos polaroid"
              style={{
                width: '110%',
                maxWidth: 360,
                height: 'auto',
                display: 'block',
                transform: 'rotate(-2.5deg) translateX(8px)',
                filter: 'drop-shadow(0 12px 36px rgba(0,0,0,0.7))',
                marginRight: '-16px',
              }}
            />
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ROW 3 — COLORES + quote sticky + MI MOOD                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-8 pt-4 pb-4">
        <div
          className="max-w-6xl mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,0.85fr) minmax(0,1fr)',
            gap: '0 16px',
            alignItems: 'flex-start',
          }}
        >
          {/* Col 1 — Colores */}
          <FadeIn delay={0.04} style={{ paddingTop: 24, paddingRight: 8 }}>
            <p
              style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontWeight: 600, color: '#c084fc', fontSize: '1.05rem', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Colores que me representan <Heart color="#f472b6" size={16} />
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {COLORS.map((c, i) => (
                <motion.div
                  key={c.name}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.04 + i * 0.06 }}
                  whileHover={{ scale: 1.12 }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: c.hex,
                      boxShadow: `0 0 0 2px ${c.border ?? 'rgba(255,255,255,0.06)'}, 0 0 22px ${c.glow}`,
                    }}
                  />
                  <p style={{ fontSize: '0.74rem', fontStyle: 'italic', fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.72)', margin: 0 }}>{c.name}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Col 2 — Sticky quote */}
          <FadeIn delay={0.12} style={{ position: 'relative', zIndex: 4, marginTop: 16 }}>
            <div
              style={{
                position: 'relative',
                background: 'rgba(90,50,170,0.25)',
                border: '1px solid rgba(168,85,247,0.32)',
                borderRadius: 4,
                boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
                padding: '28px 20px 24px',
                transform: 'rotate(-2deg)',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.9rem',
                fontStyle: 'italic',
                lineHeight: 1.75,
              }}
            >
              <Tape rotate="4deg" top="-12px" left="50%" tx="-50%" w={56} />
              Me encantan las cosas con significado, los detalles pensados y todo lo que tenga mi estilo{' '}
              <Sparkle size={13} color="#f472b6" />
              {/* Heart doodle esquina */}
              <HeartOutline size={24} color="#c084fc" style={{ position: 'absolute', bottom: 10, right: 12, opacity: 0.5 }} />
            </div>
          </FadeIn>

          {/* Col 3 — Mi mood label + blog_05 */}
          <FadeIn delay={0.2} style={{ position: 'relative', marginTop: 8 }}>
            <p
              style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontWeight: 600, color: '#c084fc', fontSize: '1.05rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Mi mood <Heart color="#f472b6" size={16} />
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blog_05-cGA2APUcsyudgHXq9Dr2R2uaPaHkr9.png"
              alt="Mi mood: Moda, Música y Anime en polaroids"
              style={{
                width: '108%',
                maxWidth: 400,
                height: 'auto',
                display: 'block',
                transform: 'rotate(2.5deg) translateX(6px)',
                filter: 'drop-shadow(0 12px 36px rgba(0,0,0,0.72))',
              }}
            />
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ROW 4 — MI ESTILO + ME GUSTA + REFERENCIAS ÚTILES         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-8 pt-4 pb-4">
        <div
          className="max-w-6xl mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,0.9fr) minmax(0,1.1fr)',
            gap: '0 16px',
            alignItems: 'flex-start',
          }}
        >
          {/* Col 1 — Mi estilo texto */}
          <FadeIn delay={0.04} style={{ paddingTop: 20, paddingRight: 8 }}>
            <p
              style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontWeight: 600, color: '#c084fc', fontSize: '1.05rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Mi estilo <Heart color="#f472b6" size={14} />
            </p>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', marginBottom: 18, lineHeight: 1.65 }}>
              Cómodo, relajado y<br />siempre con un toque<br />de personalidad.
            </p>
            {/* Doodle sparkle decorativo */}
            <div style={{ marginBottom: 8, opacity: 0.5, display: 'flex', gap: 6, alignItems: 'center' }}>
              <Sparkle size={12} color="#f472b6" />
              <Sparkle size={10} color="#c084fc" />
              <Sparkle size={14} color="#a78bfa" />
            </div>
          </FadeIn>

          {/* Col 2 — Libreta "Me gusta" */}
          <FadeIn delay={0.1} style={{ position: 'relative', zIndex: 3, marginTop: 10 }}>
            <div
              style={{
                position: 'relative',
                background: 'linear-gradient(135deg, #12091f 0%, #0d0620 100%)',
                border: '1px solid rgba(168,85,247,0.38)',
                borderRadius: 4,
                boxShadow: '0 8px 30px rgba(0,0,0,0.65), 0 0 28px rgba(168,85,247,0.07)',
                padding: '26px 22px',
                transform: 'rotate(-1.5deg)',
              }}
            >
              <Tape rotate="-3deg" top="-12px" left="50%" tx="-50%" w={54} />
              <p
                style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontWeight: 600, color: '#c084fc', fontSize: '1rem', marginBottom: 14, textAlign: 'center' }}
              >
                Me gusta
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Accesorios', 'Gorros', 'Zapatos lindos', 'Oversize', 'Colores neutros', 'Detalles minimalistas'].map((item) => (
                  <li key={item} style={{ textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.72)' }}>
                    {item}
                  </li>
                ))}
              </ul>
              {/* Heart doodle bottom */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, opacity: 0.5 }}>
                <HeartOutline size={22} color="#c084fc" />
              </div>
            </div>
          </FadeIn>

          {/* Col 3 — Kraft "Referencias útiles" */}
          <FadeIn delay={0.18} style={{ position: 'relative', zIndex: 3, marginTop: 20 }}>
            <div
              style={{
                position: 'relative',
                background: 'linear-gradient(135deg, #c8a870, #b8915a 50%, #c4a26c)',
                borderRadius: 4,
                boxShadow: '0 8px 30px rgba(0,0,0,0.55)',
                padding: '22px 20px',
                transform: 'rotate(2deg)',
              }}
            >
              <Tape rotate="3deg" top="-12px" left="24%" tx="-50%" w={56} />
              <Tape rotate="-5deg" top="-12px" left="76%" tx="-50%" w={48} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', color: '#2d1605', margin: 0 }}>
                  Referencias Útiles
                </p>
                <Heart color="#7c3aed" size={13} />
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '👕', label: 'Ropa:', val: 'Por confirmar' },
                  { icon: '👟', label: 'Calzado:', val: 'Por confirmar' },
                  { icon: '🎨', label: 'Colores favoritos:', val: 'Morado, lila, negro' },
                ].map((row) => (
                  <li key={row.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.88rem' }}>
                    <span style={{ fontSize: 15, lineHeight: 1.5 }}>{row.icon}</span>
                    <div>
                      <span style={{ color: '#5a3a10', fontWeight: 700 }}>{row.label}</span>{' '}
                      <span style={{ color: '#2d1605' }}>{row.val}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CIERRE — papel rasgado + CTA                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="relative px-4 sm:px-8 pt-6 pb-20">
        {/* Línea decorativa */}
        <div
          aria-hidden
          style={{
            maxWidth: 480,
            margin: '0 auto 24px',
            height: 1,
            background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.5), transparent)',
            boxShadow: '0 0 12px rgba(168,85,247,0.28)',
          }}
        />

        <div
          className="max-w-6xl mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,0.15fr) minmax(0,1fr) minmax(0,0.15fr)',
            gap: '0 12px',
            alignItems: 'center',
          }}
        >
          {/* Doodle corazón izquierda */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', opacity: 0.65 }}>
            <HeartOutline size={40} color="#a855f7" />
          </div>

          {/* Papel rasgado con texto emocional */}
          <FadeIn delay={0.06}>
            <div
              style={{
                position: 'relative',
                background: 'linear-gradient(to bottom, #faf2e4, #f4ead0)',
                borderRadius: 3,
                boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                padding: '32px 36px',
                textAlign: 'center',
              }}
            >
              <Tape rotate="-4deg" top="-13px" left="22%" tx="-50%" w={62} />
              <Tape rotate="5deg" top="-13px" left="78%" tx="-50%" w={54} />

              <HeartOutline size={22} color="#7c3aed" style={{ position: 'absolute', top: 14, right: 18, opacity: 0.45 }} />
              <HeartOutline size={18} color="#f472b6" style={{ position: 'absolute', bottom: 14, left: 16, opacity: 0.4 }} />

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  color: '#2d1a45',
                  lineHeight: 1.85,
                }}
              >
                <span style={{ color: '#7c3aed', fontWeight: 700 }}>No se trata</span> del regalo perfecto,<br />
                sino de un detalle hecho con cariño.<br />
                Lo más importante será compartir esta noche<br />
                con las personas que quiero.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <motion.button
                onClick={() => router.push('/')}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 28px',
                  borderRadius: 16,
                  background: '#7c3aed',
                  boxShadow: '0 0 30px rgba(124,58,237,0.5)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft style={{ width: 16, height: 16 }} />
                Volver a la invitación
              </motion.button>
            </div>
          </FadeIn>

          {/* Doodle corazón derecha */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', opacity: 0.6 }}>
            <HeartOutline size={36} color="#f472b6" />
          </div>
        </div>
      </footer>

      {/* Responsive: en mobile apilamos en columna */}
      <style>{`
        @media (max-width: 768px) {
          section > div[class*="max-w"] > div,
          footer > div[class*="max-w"] > div {
            display: flex !important;
            flex-direction: column !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </main>
  )
}
