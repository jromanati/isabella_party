'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowLeft,
  ChevronDown,
  Palette,
  Sparkles,
  Heart,
  Star,
  Pencil,
  BookOpen,
  Music,
  Dumbbell,
  Gift,
  Shirt,
  Home,
  Smile,
} from 'lucide-react'
import PageShell from '@/components/gustos/page-shell'
import SectionHeader from '@/components/gustos/section-header'
import GlassCard from '@/components/gustos/glass-card'

/* ─── Data ─────────────────────────────────────────────────────────── */

const STYLE_CARDS = [
  {
    icon: <Palette className="w-5 h-5" />,
    title: 'Artística y creativa',
    desc: 'Le encanta lo diferente, lo hecho a mano y lo que lleva personalidad propia.',
  },
  {
    icon: <Shirt className="w-5 h-5" />,
    title: 'Estilo juvenil y cómodo',
    desc: 'Ropa que se sienta suya: cómoda, con carácter y siempre con un detalle especial.',
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Detalles con presentación bonita',
    desc: 'Ama los colores lindos, el packaging cuidado y las cosas que entran por los ojos.',
  },
]

const FAVORITE_COLORS = [
  { name: 'Morado', hex: '#7c3aed', glow: 'rgba(168,85,247,0.6)' },
  { name: 'Lila', hex: '#c084fc', glow: 'rgba(192,132,252,0.55)' },
  { name: 'Negro', hex: '#0b0b10', glow: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.2)' },
  { name: 'Blanco', hex: '#f5f5ff', glow: 'rgba(255,255,255,0.4)' },
  { name: 'Rosado', hex: '#f472b6', glow: 'rgba(244,114,182,0.6)' },
  { name: 'Azul', hex: '#3b82f6', glow: 'rgba(59,130,246,0.5)' },
]

const ENJOYS = [
  { icon: <Pencil className="w-5 h-5" />, label: 'Dibujar / Arte' },
  { icon: <BookOpen className="w-5 h-5" />, label: 'Cómics' },
  { icon: <Star className="w-5 h-5" />, label: 'Disney' },
  { icon: <Dumbbell className="w-5 h-5" />, label: 'Vóley' },
  { icon: <Music className="w-5 h-5" />, label: 'Música' },
  { icon: <Sparkles className="w-5 h-5" />, label: 'Detalles personalizados' },
  { icon: <Heart className="w-5 h-5" />, label: 'Accesorios bonitos' },
  { icon: <Smile className="w-5 h-5" />, label: 'Cosas útiles para su día a día' },
]

const REFERENCE_IDEAS = [
  { icon: <Pencil className="w-5 h-5" />, title: 'Papelería linda', desc: 'Cuadernos, lápices de colores, stickers y cositas de escritorio aesthetic.' },
  { icon: <Heart className="w-5 h-5" />, title: 'Accesorios', desc: 'Aretes, vinchas, pulseras y detalles que complementen su estilo.' },
  { icon: <Shirt className="w-5 h-5" />, title: 'Ropa cómoda', desc: 'Prendas oversized, hoodies suaves, buenas vibes y colores que la representen.' },
  { icon: <Dumbbell className="w-5 h-5" />, title: 'Cosas de vóley', desc: 'Detalles deportivos funcionales para su pasión favorita.' },
  { icon: <Star className="w-5 h-5" />, title: 'Detalles Disney', desc: 'Un guiño a los personajes y la magia que siempre la ha acompañado.' },
  { icon: <Home className="w-5 h-5" />, title: 'Decoración para su pieza', desc: 'Luces, pósters, objetos cute que hagan su espacio más suyo.' },
  { icon: <Gift className="w-5 h-5" />, title: 'Experiencias o recuerdos', desc: 'Un momento especial queda en la memoria mucho más que cualquier objeto.' },
]

/* ─── Helpers ───────────────────────────────────────────────────────── */

function NeonLine() {
  return (
    <div className="relative flex items-center justify-center py-2 px-5">
      <div
        className="w-full max-w-md h-px"
        style={{
          background: 'linear-gradient(to right, transparent, #ec4899, #a855f7, transparent)',
          boxShadow: '0 0 10px rgba(168,85,247,0.5)',
        }}
      />
    </div>
  )
}

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

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function ConoceAIsabellaPage() {
  const router = useRouter()
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll()
  const heroParallax = useTransform(scrollYProgress, [0, 0.4], [0, 20])
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const handleExplore = () =>
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <PageShell>
      {/* ── Topbar ── */}
      <div
        className="fixed top-0 inset-x-0 z-50"
        style={{
          background: 'rgba(5,3,12,0.82)',
          borderBottom: '1px solid rgba(168,85,247,0.18)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.78)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-body)' }}>
              Volver
            </span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className="text-sm font-black italic"
              style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-body)' }}
            >
              Conoce a Isabella
            </span>
            <span
              className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(168,85,247,0.15)',
                border: '1px solid rgba(168,85,247,0.35)',
                color: '#c084fc',
                fontFamily: 'var(--font-body)',
              }}
            >
              Isabella XV
            </span>
          </div>
        </div>
      </div>

      <div className="pt-20">
        {/* ── Hero ── */}
        <section className="relative min-h-[88svh] flex items-center overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: heroParallax }} aria-hidden>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 90% 70% at 50% 10%, rgba(168,85,247,0.32) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 80% 60%, rgba(236,72,153,0.18) 0%, transparent 60%), #050308',
              }}
            />
            {/* Floating glow orbs */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 200 + i * 60,
                  height: 200 + i * 60,
                  left: `${(i * 18 + 5) % 95}%`,
                  top: `${(i * 22 + 8) % 80}%`,
                  background:
                    i % 2 === 0
                      ? 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
              />
            ))}
          </motion.div>

          <div className="relative w-full px-5">
            <div className="max-w-3xl mx-auto text-center pt-16 pb-14">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-xs font-semibold tracking-[0.35em] uppercase"
                style={{ color: '#c084fc', fontFamily: 'var(--font-body)' }}
              >
                Isabella XV
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 font-sans font-black italic leading-tight text-balance"
                style={{
                  fontSize: 'clamp(2.6rem, 8vw, 5rem)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9a8d4 38%, #c084fc 70%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 30px rgba(192,132,252,0.5))',
                }}
              >
                Conoce a Isabella
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.35 }}
                className="mt-5 text-sm sm:text-base leading-relaxed max-w-xl mx-auto text-pretty"
                style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-body)' }}
              >
                Algunas pistas sobre sus gustos, colores, estilo y cosas que la hacen feliz.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.48 }}
                className="mt-4 text-sm leading-relaxed max-w-lg mx-auto text-pretty"
                style={{ color: 'rgba(255,255,255,0.42)', fontFamily: 'var(--font-body)' }}
              >
                No se trata de elegir el regalo perfecto, sino de conocer un poquito más a Isabella y sorprenderla con algo pensado para ella.
              </motion.p>

              <motion.button
                onClick={handleExplore}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.58 }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="mt-10 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm"
                style={{
                  background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                  boxShadow: '0 0 28px rgba(236,72,153,0.38), 0 0 56px rgba(168,85,247,0.22)',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <Sparkles className="w-4 h-4" />
                Explorar
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="mt-12 flex flex-col items-center gap-2"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(10,5,25,0.6)',
                    border: '1px solid rgba(168,85,247,0.22)',
                    backdropFilter: 'blur(18px)',
                  }}
                >
                  <ChevronDown className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.7)' }} />
                </div>
                <p className="text-[11px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
                  desliza
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div ref={sectionRef} />

        {/* ── Su estilo ── */}
        <section className="relative px-5 pt-16 pb-12">
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <SectionHeader
                eyebrow="Su estilo"
                title="Así es Isabella"
                subtitle="Tres cosas que definen su personalidad y la forma en que vive el mundo."
              />
            </FadeIn>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {STYLE_CARDS.map((card, i) => (
                <FadeIn key={card.title} delay={i * 0.1}>
                  <GlassCard className="p-7 h-full">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
                      style={{
                        background: 'rgba(168,85,247,0.14)',
                        border: '1px solid rgba(168,85,247,0.3)',
                        color: '#c084fc',
                      }}
                    >
                      {card.icon}
                    </div>
                    <p className="font-sans font-semibold text-white text-base leading-snug">
                      {card.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.52)', fontFamily: 'var(--font-body)' }}>
                      {card.desc}
                    </p>
                  </GlassCard>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <NeonLine />

        {/* ── Colores ── */}
        <section className="relative px-5 pt-14 pb-12">
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <SectionHeader
                eyebrow="Colores que le gustan"
                title="Su paleta favorita"
                subtitle="Los colores que más la representan y que combinan con su energía."
              />
            </FadeIn>

            <div className="mt-10 grid grid-cols-3 sm:grid-cols-6 gap-4">
              {FAVORITE_COLORS.map((c, i) => (
                <FadeIn key={c.name} delay={i * 0.07}>
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.22 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
                      style={{
                        background: c.hex,
                        boxShadow: `0 0 0 1px ${c.border ?? 'rgba(255,255,255,0.07)'}, 0 0 28px ${c.glow}`,
                      }}
                    />
                    <p
                      className="text-xs font-semibold text-center"
                      style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)' }}
                    >
                      {c.name}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <NeonLine />

        {/* ── Cosas que disfruta ── */}
        <section className="relative px-5 pt-14 pb-12">
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <SectionHeader
                eyebrow="Cosas que disfruta"
                title="Su mundo en 8 cosas"
                subtitle="Pequeñas ventanas a lo que hace a Isabella, Isabella."
              />
            </FadeIn>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ENJOYS.map((item, i) => (
                <FadeIn key={item.label} delay={i * 0.07}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    transition={{ duration: 0.22 }}
                    className="relative rounded-2xl p-4 flex items-center gap-3 overflow-hidden"
                    style={{
                      background: 'rgba(10,5,25,0.72)',
                      border: '1px solid rgba(168,85,247,0.2)',
                      boxShadow: '0 0 20px rgba(168,85,247,0.08)',
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    <div
                      className="absolute top-0 inset-x-0 h-px"
                      style={{
                        background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.7), transparent)',
                      }}
                    />
                    <div
                      className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'rgba(236,72,153,0.12)',
                        border: '1px solid rgba(236,72,153,0.25)',
                        color: '#f472b6',
                      }}
                    >
                      {item.icon}
                    </div>
                    <p className="text-sm font-semibold text-white leading-snug" style={{ fontFamily: 'var(--font-body)' }}>
                      {item.label}
                    </p>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <NeonLine />

        {/* ── Ideas de referencia ── */}
        <section className="relative px-5 pt-14 pb-12">
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <SectionHeader
                eyebrow="Ideas de referencia"
                title="Categorías que le encantan"
                subtitle="No son regalos obligatorios, solo ideas que conectan con su estilo."
              />
            </FadeIn>

            <FadeIn delay={0.1}>
              <div
                className="mt-6 mx-auto max-w-2xl text-center px-5 py-3 rounded-2xl text-xs"
                style={{
                  background: 'rgba(168,85,247,0.08)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Estas son referencias generales, sin marcas ni precios. Solo pistas para inspirarte.
              </div>
            </FadeIn>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REFERENCE_IDEAS.map((idea, i) => (
                <FadeIn key={idea.title} delay={i * 0.08}>
                  <GlassCard className="p-6 h-full">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background: 'rgba(168,85,247,0.12)',
                        border: '1px solid rgba(168,85,247,0.28)',
                        color: '#c084fc',
                      }}
                    >
                      {idea.icon}
                    </div>
                    <p className="font-sans font-semibold text-white text-base leading-snug">{idea.title}</p>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                      {idea.desc}
                    </p>
                  </GlassCard>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <NeonLine />

        {/* ── Tallas ── */}
        <section className="relative px-5 pt-14 pb-12">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <SectionHeader
                eyebrow="Referencias"
                title="Tallas (por si te sirve)"
                subtitle="Solo para orientar, con cariño y sin presión."
              />
            </FadeIn>

            <FadeIn delay={0.12}>
              <GlassCard className="mt-10 p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: 'Ropa', value: 'por confirmar' },
                    { label: 'Calzado', value: 'por confirmar' },
                    { label: 'Colores favoritos', value: 'Morado, Lila, Negro' },
                    { label: 'Una guía suave', value: 'no es una regla 💜' },
                  ].map((row) => (
                    <div key={row.label} className="flex flex-col gap-1">
                      <p
                        className="text-xs font-semibold tracking-[0.25em] uppercase"
                        style={{ color: '#c084fc', fontFamily: 'var(--font-body)' }}
                      >
                        {row.label}
                      </p>
                      <p
                        className="text-base font-semibold"
                        style={{ color: 'rgba(255,255,255,0.88)', fontFamily: 'var(--font-body)' }}
                      >
                        {row.value}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </FadeIn>
          </div>
        </section>

        <NeonLine />

        {/* ── Cierre emocional ── */}
        <footer className="relative px-5 pt-14 pb-20">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <GlassCard className="p-10 text-center">
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.2))',
                    border: '1px solid rgba(168,85,247,0.3)',
                    boxShadow: '0 0 30px rgba(168,85,247,0.2)',
                  }}
                >
                  <Heart className="w-6 h-6" style={{ color: '#f472b6' }} />
                </div>

                <p
                  className="text-base sm:text-lg leading-relaxed text-pretty"
                  style={{ color: 'rgba(255,255,255,0.78)', fontFamily: 'var(--font-body)' }}
                >
                  Lo más importante para Isabella será compartir esta noche con las personas que quiere. Cualquier detalle hecho con cariño será especial.
                </p>

                <div
                  className="mx-auto mt-6 mb-8 h-px w-24"
                  style={{
                    background: 'linear-gradient(to right, transparent, rgba(236,72,153,0.6), transparent)',
                    boxShadow: '0 0 8px rgba(236,72,153,0.4)',
                  }}
                />

                <motion.button
                  onClick={() => router.push('/')}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                    boxShadow: '0 0 24px rgba(236,72,153,0.35), 0 0 50px rgba(168,85,247,0.2)',
                    color: '#fff',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver a la invitación
                </motion.button>
              </GlassCard>
            </FadeIn>
          </div>
        </footer>
      </div>
    </PageShell>
  )
}
