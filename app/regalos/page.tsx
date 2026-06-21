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
  {
    name: 'Negro',
    hex: '#111118',
    glow: 'rgba(255,255,255,0.18)',
    border: '1px solid rgba(255,255,255,0.22)',
  },
  {
    name: 'Azul Marino',
    hex: '#1e3a8a',
    glow: 'rgba(30,58,138,0.65)',
  },
  {
    name: 'Azul Eléctrico',
    hex: '#2563eb',
    glow: 'rgba(37,99,235,0.75)',
  },
  {
    name: 'Azul Celeste',
    hex: '#60a5fa',
    glow: 'rgba(96,165,250,0.70)',
  },
  {
    name: 'Lila',
    hex: '#c084fc',
    glow: 'rgba(192,132,252,0.70)',
  },
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

      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0.07,
          mixBlendMode: 'overlay',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.8) 0px, transparent 1px, transparent 3px)',
        }}
      />

      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="fixed rounded-full pointer-events-none"
          style={{
            left: `${(i * 19) % 100}%`,
            top: `${(i * 13) % 100}%`,
            width: i % 4 === 0 ? 3 : 2,
            height: i % 4 === 0 ? 3 : 2,
            background: i % 3 === 0 ? 'rgba(244,114,182,0.55)' : i % 2 === 0 ? 'rgba(192,132,252,0.5)' : 'rgba(59,130,246,0.35)',
            boxShadow:
              i % 3 === 0
                ? '0 0 14px rgba(244,114,182,0.35)'
                : i % 2 === 0
                  ? '0 0 16px rgba(192,132,252,0.3)'
                  : '0 0 14px rgba(59,130,246,0.22)',
            opacity: 0.65,
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.25, 0.7, 0.25],
          }}
          transition={{
            duration: 7 + (i % 6),
            repeat: Infinity,
            delay: (i % 9) * 0.25,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ── HEADER sticky ─────────────────────────────────────────── */}
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-10 py-2"
        style={{
          background: 'rgba(5,3,8,0.62)',
          borderBottom: '1px solid rgba(168,85,247,0.16)',
          backdropFilter: 'blur(26px)',
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
          className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, rgba(147,51,234,0.92), rgba(236,72,153,0.9))', color: '#fff', boxShadow: '0 0 18px rgba(147,51,234,0.35)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Volver a la invitación</span>
          <span className="sm:hidden">Volver</span>
        </button>
      </header>

      <div className="md:hidden">
        <section className="relative pt-16 pb-6 px-4">
          <div className="max-w-md mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FadeIn delay={0.04}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  alignItems: 'center',
                }}
              >
                <motion.div
                  aria-hidden
                  style={{
                    gridArea: '1 / 1',
                    width: '100%',
                    height: 320,
                    justifySelf: 'center',
                    background:
                      'radial-gradient(circle at 55% 35%, rgba(236,72,153,0.22) 0%, rgba(124,58,237,0.18) 34%, transparent 70%)',
                    filter: 'blur(18px)',
                    opacity: 0.95,
                    pointerEvents: 'none',
                  }}
                  animate={{ scale: [0.98, 1.03, 0.98], opacity: [0.72, 0.95, 0.72] }}
                  transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  src="/blog_01.png"
                  alt="Isabella, protagonista de la fiesta de XV"
                  style={{
                    gridArea: '1 / 1',
                    width: '100%',
                    maxWidth: 520,
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto',
                    transform: 'rotate(-3.8deg)',
                    filter: 'drop-shadow(0 18px 60px rgba(0,0,0,0.82))',
                  }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div
                  style={{
                    gridArea: '1 / 1',
                    alignSelf: 'end',
                    justifySelf: 'center',
                    width: '92%',
                    marginBottom: 14,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                      padding: '10px 14px 12px',
                      borderRadius: 18,
                      background: 'rgba(5,3,8,0.55)',
                      border: '1px solid rgba(168,85,247,0.22)',
                      boxShadow: '0 0 26px rgba(192,132,252,0.16)',
                      backdropFilter: 'blur(18px)',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        fontSize: '1.05rem',
                        color: 'rgba(255,255,255,0.78)',
                        margin: 0,
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
                        fontSize: 'clamp(3.2rem, 13.5vw, 4.8rem)',
                        background: 'linear-gradient(135deg, #f9a8d4 0%, #c084fc 50%, #a78bfa 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 0.9,
                        filter: 'drop-shadow(0 0 46px rgba(192,132,252,0.72))',
                        margin: 0,
                      }}
                    >
                      Isabella
                    </h1>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontSize: '0.82rem', color: '#dbb6ff', letterSpacing: '0.02em' }}>
                        Algunas cosas que me hacen feliz
                      </span>
                      <Sparkle size={14} color="#f472b6" />
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} style={{ display: 'flex', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                src="/blog_02.png"
                alt="Nota de cuaderno 'Sobre mí': Soy soñadora, creativa y súper curiosa"
                style={{
                  width: '100%',
                  maxWidth: 360,
                  height: 'auto',
                  display: 'block',
                  transform: 'rotate(4.2deg)',
                  filter: 'drop-shadow(0 16px 46px rgba(0,0,0,0.78))',
                }}
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </FadeIn>
          </div>
        </section>

        <section className="relative px-4 pt-2 pb-6">
          <div className="max-w-md mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FadeIn delay={0.04} style={{ position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                src="/blog_03.png"
                alt="Isabella con uniforme de vóley sosteniendo un balón"
                style={{
                  width: '100%',
                  maxWidth: 520,
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                  transform: 'rotate(2.1deg)',
                  filter: 'drop-shadow(0 18px 62px rgba(0,0,0,0.82))',
                }}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </FadeIn>

            <FadeIn delay={0.08}>
              <div>
                <p style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontWeight: 600, color: '#c084fc', fontSize: '1.05rem', marginBottom: 8 }}>
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
                    padding: '6px 14px',
                    marginBottom: 10,
                    color: '#ddb6ff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  El Vóley <Heart color="#f472b6" size={12} />
                </div>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.68)', lineHeight: 1.95, margin: 0 }}>
                  Amo este deporte. Me enseña disciplina, me reta cada día y me regala amistades increíbles. Ver partidos también es mi plan favorito.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="relative px-4 pt-1 pb-6">
          <div className="max-w-md mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <FadeIn delay={0.04}>
              <p style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontWeight: 600, color: '#c084fc', fontSize: '1.02rem', lineHeight: 1.4, marginBottom: 10 }}>
                Pequeñas cosas
                <br />que me hacen feliz
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                {[
                  'Escuchar música',
                  'Dibujar y ser creativa',
                  'Disney (soy fan total)',
                  'Comics y series',
                  'Detalles bonitos',
                  'Viajar y conocer lugares nuevos',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'rgba(255,255,255,0.72)' }}>
                    <Heart color="#f472b6" size={12} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.1} style={{ display: 'flex', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                src="/blog_04.png"
                alt="Pequeñas cosas que me gustan: Arte, Disney y Peluches en fotos polaroid"
                style={{
                  width: '100%',
                  maxWidth: 520,
                  height: 'auto',
                  display: 'block',
                  transform: 'rotate(-2.1deg)',
                  filter: 'drop-shadow(0 18px 58px rgba(0,0,0,0.82))',
                }}
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              />
            </FadeIn>
          </div>
        </section>

        <section className="relative px-4 pt-1 pb-6">
          <div className="max-w-md mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <FadeIn delay={0.04}>
              <p style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontWeight: 600, color: '#c084fc', fontSize: '1.05rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                Colores que me representan <Heart color="#f472b6" size={16} />
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  paddingBottom: 6,
                  paddingRight: 10,
                  alignItems: 'center',
                  maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 88%, transparent 100%)',
                }}
              >
                {COLORS.map((c, i) => (
                  <motion.div
                    key={c.name}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.03 + i * 0.05 }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: c.hex,
                        boxShadow: `0 0 0 2px ${c.border ?? 'rgba(255,255,255,0.06)'}, 0 0 18px ${c.glow}`,
                      }}
                    />
                    <p style={{ fontSize: '0.82rem', fontStyle: 'italic', fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.76)', margin: 0, whiteSpace: 'nowrap' }}>
                      {c.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div
                style={{
                  position: 'relative',
                  background: 'rgba(90,50,170,0.22)',
                  border: '1px solid rgba(168,85,247,0.28)',
                  borderRadius: 4,
                  boxShadow: '0 8px 26px rgba(0,0,0,0.48)',
                  padding: '18px 16px 16px',
                  transform: 'rotate(-1deg)',
                  color: 'rgba(255,255,255,0.76)',
                  fontSize: '0.92rem',
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                }}
              >
                <Tape rotate="4deg" top="-12px" left="50%" tx="-50%" w={54} />
                Me encantan las cosas con significado, los detalles pensados y todo lo que tenga mi estilo <Sparkle size={13} color="#f472b6" />
              </div>
            </FadeIn>

            <FadeIn delay={0.12} style={{ display: 'flex', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                src="/blog_05.png"
                alt="Mi mood: Moda, Música y Anime en polaroids"
                style={{
                  width: '100%',
                  maxWidth: 520,
                  height: 'auto',
                  display: 'block',
                  transform: 'rotate(2deg)',
                  filter: 'drop-shadow(0 18px 64px rgba(0,0,0,0.84))',
                }}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 10.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </FadeIn>
          </div>
        </section>

        <section className="relative px-4 pt-1 pb-7">
          <div className="max-w-md mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <FadeIn delay={0.04}>
              <p style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontWeight: 600, color: '#c084fc', fontSize: '1.05rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                Mi estilo <Heart color="#f472b6" size={14} />
              </p>
              <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.7 }}>
                Cómodo, relajado y siempre con un toque de personalidad.
              </p>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div
                style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, #12091f 0%, #0d0620 100%)',
                  border: '1px solid rgba(168,85,247,0.34)',
                  borderRadius: 4,
                  boxShadow: '0 8px 28px rgba(0,0,0,0.62), 0 0 28px rgba(168,85,247,0.06)',
                  padding: '16px 16px',
                  transform: 'rotate(-0.8deg)',
                }}
              >
                <Tape rotate="-3deg" top="-12px" left="50%" tx="-50%" w={52} />
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontStyle: 'italic',
                    fontWeight: 700,
                    color: '#c084fc',
                    fontSize: '0.98rem',
                    margin: '0 0 12px',
                    textAlign: 'center'
                  }}
                >
                  Cosas que me hacen feliz ✨
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {['💄 Maquillaje', '🧸 Peluches', '👕 Ropa', '🧴 Productos para el pelo', '🎨 Materiales de arte', '✨ Accesorios dorados'].map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{ fontSize: 12 }}>{item.split(' ')[0]}</span>
                      <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.72)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.split(' ').slice(1).join(' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <div
                style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, #c8a870, #b8915a 50%, #c4a26c)',
                  borderRadius: 4,
                  boxShadow: '0 8px 26px rgba(0,0,0,0.55)',
                  padding: '18px 16px',
                  transform: 'rotate(1.2deg)',
                }}
              >
                <Tape rotate="3deg" top="-12px" left="26%" tx="-50%" w={54} />
                <Tape rotate="-5deg" top="-12px" left="74%" tx="-50%" w={46} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.72rem', color: '#2d1605', margin: 0 }}>
                    Guía para acertar 🎁
                  </p>
                  <Heart color="#7c3aed" size={13} />
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { icon: '👕', label: 'Camisa', val: 'Talla S (90)' },
                    { icon: '👖', label: 'Pantalón', val: 'Talla 36' },
                    { icon: '👟', label: 'Zapatos', val: 'Talla 36' },
                    { icon: '💍', label: 'Accesorios', val: 'Color Oro' },
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

            <FadeIn delay={0.16}>
              <div
                style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, #12091f 0%, #0d0620 100%)',
                  border: '1px solid rgba(168,85,247,0.34)',
                  borderRadius: 4,
                  boxShadow: '0 8px 28px rgba(0,0,0,0.62), 0 0 28px rgba(168,85,247,0.06)',
                  padding: '16px 16px',
                  transform: 'rotate(0.8deg)',
                }}
              >
                <Tape rotate="-2deg" top="-12px" left="50%" tx="-50%" w={52} />
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontStyle: 'italic',
                    fontWeight: 700,
                    color: '#c084fc',
                    fontSize: '0.98rem',
                    margin: '0 0 12px',
                    textAlign: 'center'
                  }}
                >
                  También me encantaría...
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {['💄 Un maquillaje bonito', '🧸 Un peluche tierno', '🎨 Materiales para dibujar o pintar', '👗 Alguna prenda de ropa', '🧴 Productos para cuidar mi cabello', '✨ Algún accesorio dorado'].map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{ fontSize: 12 }}>{item.split(' ')[0]}</span>
                      <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.72)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.split(' ').slice(1).join(' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <footer className="relative px-4 pt-1 pb-20">
          <div aria-hidden style={{ maxWidth: 360, margin: '0 auto 18px', height: 1, background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.5), transparent)', boxShadow: '0 0 12px rgba(168,85,247,0.28)' }} />
          <div className="max-w-md mx-auto">
            <FadeIn delay={0.06}>
              <div
                style={{
                  position: 'relative',
                  background: 'linear-gradient(to bottom, #faf2e4, #f4ead0)',
                  borderRadius: 3,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                  padding: '22px 18px',
                  textAlign: 'center',
                }}
              >
                <Tape rotate="-4deg" top="-13px" left="24%" tx="-50%" w={58} />
                <Tape rotate="5deg" top="-13px" left="76%" tx="-50%" w={50} />
                <p style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontSize: '0.98rem', color: '#2d1a45', lineHeight: 1.85, margin: 0 }}>
                  El mejor regalo será compartir este día tan especial contigo. 💜
                  <br />
                  Si además decides sorprenderme con un detalle, estas ideas pueden ayudarte a escoger algo que realmente disfrutaré.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
                <motion.button
                  onClick={() => router.push('/')}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 22px',
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
          </div>
        </footer>
      </div>

      <div className="hidden md:block">

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ROW 1 — HERO                                               */}
      {/* foto grande + título neon + cuaderno "Sobre mí"            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-20 pb-3 px-4 sm:px-8">
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
          className="max-w-6xl mx-auto scrapbook-hero"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1.3fr) minmax(0,1fr)',
            gap: '0px 8px',
            alignItems: 'flex-start',
          }}
        >
          {/* Col 1 — Foto Isabella (blog_01 ya tiene tape y paper tear) */}
          <FadeIn delay={0.06} className="scrap-hero-photo" style={{ zIndex: 6, position: 'relative', marginTop: '-6px' }}>
            <motion.div
              aria-hidden
              className="absolute"
              style={{
                left: '34%',
                top: '58%',
                width: 280,
                height: 280,
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(circle at 50% 50%, rgba(236,72,153,0.25) 0%, rgba(124,58,237,0.18) 35%, transparent 70%)',
                filter: 'blur(14px)',
                opacity: 0.9,
                pointerEvents: 'none',
                zIndex: -1,
              }}
              animate={{ scale: [0.98, 1.03, 0.98], opacity: [0.75, 0.95, 0.75] }}
              transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/blog_01.png"
              alt="Isabella, protagonista de la fiesta de XV"
              style={{
                width: '100%',
                maxWidth: 520,
                height: 'auto',
                display: 'block',
                transform: 'rotate(-6deg) translateX(-18px) translateY(-6px)',
                filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.82))',
              }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.012, rotate: -5.6, x: -14, y: -8 }}
            />
          </FadeIn>

          {/* Col 2 — Título central */}
          <FadeIn
            delay={0.12}
            className="scrap-hero-title"
            style={{ zIndex: 7, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2px', textAlign: 'center', marginLeft: '-22px' }}
          >
            <div
              aria-hidden
              className="absolute -z-10"
              style={{
                left: '50%',
                top: '18%',
                width: '120%',
                height: 260,
                transform: 'translateX(-50%)',
                background:
                  'radial-gradient(ellipse 55% 60% at 50% 40%, rgba(124,58,237,0.35) 0%, rgba(192,132,252,0.18) 35%, transparent 70%)',
                filter: 'blur(6px)',
                opacity: 0.9,
              }}
            />
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
                fontSize: 'clamp(3.9rem, 11.5vw, 7.4rem)',
                background: 'linear-gradient(135deg, #f9a8d4 0%, #c084fc 50%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 0.95,
                filter: 'drop-shadow(0 0 46px rgba(192,132,252,0.72))',
                margin: '0 0 6px',
              }}
            >
              Isabella
            </h1>

            <motion.div
              aria-hidden
              style={{
                position: 'absolute',
                left: '12%',
                top: '66%',
                transform: 'rotate(-10deg)',
                opacity: 0.55,
              }}
              animate={{ y: [0, -2, 0], opacity: [0.45, 0.65, 0.45] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkle size={18} color="#f472b6" />
            </motion.div>

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

            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.6, maxWidth: 320, margin: '0 auto 16px', textAlign: 'center', fontStyle: 'italic' }}>
              No hay compromiso de regalar nada 💜, pero si estabas pensando en hacerlo, aquí encontrarás algunas ideas para ayudarte a elegir algo que realmente me haga feliz.
            </p>

            <motion.div
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              animate={{ opacity: [0.55, 0.85, 0.55] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <HeartOutline size={36} color="#c084fc" />
            </motion.div>
          </FadeIn>

          {/* Col 3 — Nota "Sobre mí" (blog_02 ya tiene estilo cuaderno) */}
          <FadeIn
            delay={0.22}
            className="scrap-hero-note"
            style={{ zIndex: 8, position: 'relative', marginTop: '10px', marginLeft: '-18px' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/blog_02.png"
              alt="Nota de cuaderno 'Sobre mí': Soy soñadora, creativa y súper curiosa"
              style={{
                width: '100%',
                maxWidth: 350,
                height: 'auto',
                display: 'block',
                transform: 'rotate(7deg) translateY(10px) translateX(10px)',
                filter: 'drop-shadow(0 16px 46px rgba(0,0,0,0.78))',
              }}
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.012, rotate: 5.4, x: -6, y: 6 }}
            />
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ROW 2 — PASIÓN #1 VÓLEY + foto + "Pequeñas cosas"         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-8 pt-2 pb-4">
        <div
          aria-hidden
          className="absolute"
          style={{
            left: '50%',
            top: -22,
            width: '76%',
            height: 1,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.45), transparent)',
            boxShadow: '0 0 16px rgba(168,85,247,0.22)',
            opacity: 0.55,
          }}
        />
        <div
          className="max-w-6xl mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr) minmax(0,1.1fr)',
            gap: '0 12px',
            alignItems: 'flex-start',
          }}
        >
          {/* Col 1 — Pasión texto */}
          <FadeIn delay={0.04} style={{ paddingTop: 42, paddingRight: 8, transform: 'rotate(-0.6deg)' }}>
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
          <FadeIn delay={0.1} style={{ zIndex: 5, position: 'relative', marginTop: '-22px', marginLeft: '-24px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/blog_03.png"
              alt="Isabella con uniforme de vóley sosteniendo un balón"
              style={{
                width: '100%',
                maxWidth: 420,
                height: 'auto',
                display: 'block',
                transform: 'rotate(3.2deg) translateX(-10px)',
                filter: 'drop-shadow(0 18px 62px rgba(0,0,0,0.82))',
              }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.012, rotate: 3.7, x: 14, y: -10 }}
            />
            {/* Heart doodle encima de la foto en la esquina inferior */}
            <div style={{ position: 'absolute', bottom: '14%', right: '4%', opacity: 0.7 }}>
              <HeartOutline size={30} color="#f472b6" />
            </div>
          </FadeIn>

          {/* Col 3 — "Pequeñas cosas" lista + blog_04 superpuesto parcialmente */}
          <FadeIn delay={0.18} style={{ position: 'relative', paddingTop: 0, marginTop: '-10px', marginLeft: '-18px' }}>
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
            <motion.img
              src="/blog_04.png"
              alt="Pequeñas cosas que me gustan: Arte, Disney y Peluches en fotos polaroid"
              style={{
                width: '104%',
                maxWidth: 360,
                height: 'auto',
                display: 'block',
                transform: 'rotate(-3.2deg) translateX(8px) translateY(-6px)',
                filter: 'drop-shadow(0 18px 58px rgba(0,0,0,0.82))',
                marginRight: '-16px',
              }}
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.012, rotate: -3.7, x: 20, y: -14 }}
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
            <div className="mobile-colors" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
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
          <FadeIn delay={0.12} style={{ position: 'relative', zIndex: 7, marginTop: -8, marginLeft: -18 }}>
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
          <FadeIn delay={0.2} style={{ position: 'relative', marginTop: -12, marginLeft: -10, zIndex: 6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/blog_05.png"
              alt="Mi mood: Moda, Música y Anime en polaroids"
              style={{
                width: '108%',
                maxWidth: 470,
                height: 'auto',
                display: 'block',
                transform: 'rotate(2.9deg) translateX(12px) translateY(-6px)',
                filter: 'drop-shadow(0 18px 64px rgba(0,0,0,0.84))',
              }}
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.012, rotate: 3.3, x: 14, y: -10 }}
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
          <FadeIn delay={0.1} style={{ position: 'relative', zIndex: 6, marginTop: -6, marginLeft: -10 }}>
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
                Cosas que me hacen feliz ✨
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['💄 Maquillaje', '🧸 Peluches', '👕 Ropa', '🧴 Productos para el pelo', '🎨 Materiales de arte', '✨ Accesorios dorados'].map((item) => (
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
          <FadeIn delay={0.18} style={{ position: 'relative', zIndex: 5, marginTop: 34, marginLeft: -26 }}>
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
                  Guía para acertar 🎁
                </p>
                <Heart color="#7c3aed" size={13} />
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '👕', label: 'Camisa', val: 'Talla S (90)' },
                  { icon: '👖', label: 'Pantalón', val: 'Talla 36' },
                  { icon: '👟', label: 'Zapatos', val: 'Talla 36' },
                  { icon: '💍', label: 'Accesorios', val: 'Color Oro' },
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
      {/* ROW 5 — TAMBIÉN ME ENCANTARÍA...                           */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-8 pt-4 pb-4">
        <div
          className="max-w-6xl mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr)',
            gap: '0 16px',
            alignItems: 'flex-start',
            justifyContent: 'center'
          }}
        >
          <FadeIn delay={0.04} style={{ position: 'relative', zIndex: 6, maxWidth: 500, margin: '0 auto' }}>
            <div
              style={{
                position: 'relative',
                background: 'linear-gradient(135deg, #12091f 0%, #0d0620 100%)',
                border: '1px solid rgba(168,85,247,0.38)',
                borderRadius: 4,
                boxShadow: '0 8px 30px rgba(0,0,0,0.65), 0 0 28px rgba(168,85,247,0.07)',
                padding: '26px 22px',
                transform: 'rotate(-0.8deg)',
              }}
            >
              <Tape rotate="2deg" top="-12px" left="50%" tx="-50%" w={56} />
              <p
                style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontWeight: 600, color: '#c084fc', fontSize: '1rem', marginBottom: 14, textAlign: 'center' }}
              >
                También me encantaría...
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {['💄 Un maquillaje bonito', '🧸 Un peluche tierno', '🎨 Materiales para dibujar o pintar', '👗 Alguna prenda de ropa', '🧴 Productos para cuidar mi cabello', '✨ Algún accesorio dorado'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <span style={{ fontSize: 14 }}>{item.split(' ')[0]}</span>
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.72)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.split(' ').slice(1).join(' ')}
                    </span>
                  </div>
                ))}
              </div>
              {/* Heart doodle bottom */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, opacity: 0.5 }}>
                <HeartOutline size={22} color="#c084fc" />
              </div>
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
                El mejor regalo será compartir este día tan especial contigo. 💜<br />
                Si además decides sorprenderme con un detalle, estas ideas pueden ayudarte a escoger algo que realmente disfrutaré.
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
      </div>
    </main>
  )
}
