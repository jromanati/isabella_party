'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, type MotionValue, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import PageShell from '@/components/gustos/page-shell'
import SectionHeader from '@/components/gustos/section-header'
import ColorOrb from '@/components/gustos/color-orb'
import PinterestCard from '@/components/gustos/pinterest-card'
import GlassCard from '@/components/gustos/glass-card'
import IconPill from '@/components/gustos/icon-pill'
import { ISABELLA_GUSTOS } from '@/lib/isabella-gustos'

export default function RegalosPage() {
  const router = useRouter()
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll()
  const heroParallax = useTransform(scrollYProgress, [0, 0.4], [0, 18])

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const data = useMemo(() => ISABELLA_GUSTOS, [])

  const handleExplore = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!mounted) return null

  return (
    <PageShell>
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
              style={{
                color: 'rgba(255,255,255,0.9)',
                letterSpacing: '0.02em',
                fontFamily: 'var(--font-body)',
              }}
            >
              Regalos
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
      <Hero onExplore={handleExplore} parallaxY={heroParallax} />

      <div ref={sectionRef} />

      {/* Colors */}
      <section className="relative px-5 pt-16 pb-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Pistas"
            title="Colores que la hacen sentir ella"
            subtitle="Pequeños detalles que combinan con su energía: sobrios, glow y elegantes." 
          />

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.favoriteColors.map((c) => (
              <ColorOrb key={c.name} color={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Vibes */}
      <section className="relative px-5 pt-14 pb-12">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Vibes"
            title="Estilo & mood"
            subtitle="Una mezcla juvenil y sofisticada: anime vibes, streetwear comfy y detalles aesthetic." 
          />

          <div className="mt-10 columns-2 md:columns-3 gap-4 [column-fill:_balance]">
            {data.vibes.map((v) => (
              <div key={v.title} className="mb-4 break-inside-avoid">
                <PinterestCard vibe={v} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section className="relative px-5 pt-14 pb-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="Detalles"
            title="Tallas (por si te sirve)"
            subtitle="Solo para orientar — lo importante es el cariño y que se sienta ella." 
          />

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.sizes.map((row) => (
              <GlassCard key={row.label} className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.28em] uppercase" style={{ color: '#c084fc', fontFamily: 'var(--font-body)' }}>
                      {row.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white font-sans">{row.value}</p>
                    <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                      Una guía suave, no una regla.
                    </p>
                  </div>
                  <div
                    className="w-10 h-10 rounded-2xl"
                    style={{
                      background: 'rgba(59,130,246,0.10)',
                      border: '1px solid rgba(59,130,246,0.18)',
                      boxShadow: '0 0 20px rgba(59,130,246,0.12)',
                    }}
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Loves */}
      <section className="relative px-5 pt-14 pb-12">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Esencia"
            title="Cosas que ama"
            subtitle="Pequeñas pistas que hablan de su mundo: energía, creatividad y ternura." 
          />

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.loves.map((item) => (
              <IconPill key={item.label} label={item.label} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* General ideas */}
      <section className="relative px-5 pt-14 pb-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Ideas"
            title="Ideas generales (sin marcas, sin presión)"
            subtitle="No son productos específicos, solo categorías que suelen combinar con su estilo." 
          />

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.generalIdeas.map((idea) => (
              <GlassCard key={idea.title} className="p-7">
                <p className="text-white font-semibold text-lg leading-snug font-sans">{idea.title}</p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.56)', fontFamily: 'var(--font-body)' }}>
                  {idea.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Moodboard */}
      <section className="relative px-5 pb-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Moodboard"
            title="Moodboard (pronto)"
            subtitle="Vamos a ir afinándolo con imágenes reales. Por ahora, dejamos el espacio listo." 
          />

          <div className="mt-10">
            <GlassCard className="p-10">
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)' }}>
                Aquí irá un collage tipo Pinterest con imágenes seleccionadas.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-5 pb-16">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-10">
            <p
              className="text-center text-base sm:text-lg leading-relaxed whitespace-pre-line"
              style={{ color: 'rgba(255,255,255,0.78)', fontFamily: 'var(--font-body)' }}
            >
              {data.footer.text}
            </p>
          </GlassCard>
        </div>
      </footer>
      </div>
    </PageShell>
  )
}

function Hero({
  onExplore,
  parallaxY,
}: {
  onExplore: () => void
  parallaxY: MotionValue<number>
}) {
  const data = ISABELLA_GUSTOS.hero

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ y: parallaxY }}
        aria-hidden
      >
        <Image
          src={data.imageSrc}
          alt="Isabella"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(168,85,247,0.28) 0%, transparent 60%), linear-gradient(180deg, rgba(5,3,8,0.55) 0%, rgba(5,3,8,0.88) 75%, #050308 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            boxShadow: 'inset 0 -80px 120px rgba(5,3,8,0.95)',
          }}
        />
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
            transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-sans font-black italic leading-tight"
            style={{
              fontSize: 'clamp(2.2rem, 7.6vw, 4.2rem)',
              background:
                'linear-gradient(135deg, #ffffff 0%, #f9a8d4 38%, #c084fc 70%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(192,132,252,0.45))',
            }}
          >
            {data.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.32 }}
            className="mt-6 text-sm sm:text-base leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.62)', fontFamily: 'var(--font-body)' }}
          >
            {data.subtitle}
          </motion.p>

          <motion.button
            onClick={onExplore}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="mt-10 inline-flex items-center justify-center px-6 py-3.5 rounded-2xl font-semibold text-sm text-white"
            style={{
              background: 'linear-gradient(135deg, #ec4899, #a855f7)',
              boxShadow: '0 0 24px rgba(236,72,153,0.35), 0 0 52px rgba(168,85,247,0.22)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {data.ctaLabel}
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.0 }}
            className="mt-12 flex flex-col items-center gap-2"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(10,5,25,0.6)',
                border: '1px solid rgba(168,85,247,0.22)',
                boxShadow: '0 0 24px rgba(168,85,247,0.12)',
                backdropFilter: 'blur(18px)',
              }}
            >
              <ChevronDown className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.7)' }} />
            </div>
            <p className="text-[11px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
              desliza
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
