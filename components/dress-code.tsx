'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ITEMS = [
  {
    label: 'Blanco',
    sub: 'Puro · Elegante',
    desc: 'Brillarás como la reina de la noche con un look completamente blanco.',
    swatch: 'radial-gradient(circle at 35% 35%, #ffffff, #d4d4d4)',
    border: 'rgba(255,255,255,0.35)',
    glow: 'rgba(255,255,255,0.3)',
    text: '#fff',
  },
  {
    label: 'Negro',
    sub: 'Misterioso · Sofisticado',
    desc: 'El negro es el lienzo perfecto para que el neón brille sobre ti.',
    swatch: 'radial-gradient(circle at 35% 35%, #2a2a2a, #060606)',
    border: 'rgba(255,255,255,0.18)',
    glow: 'rgba(255,255,255,0.1)',
    text: 'rgba(255,255,255,0.8)',
  },
  {
    label: 'Neón',
    sub: 'Accesorios · Detalles',
    desc: 'Suma accesorios de colores neón — aretes, bolsos, zapatos o cinturones vibrantes.',
    swatch: 'conic-gradient(from 0deg, #ec4899, #a855f7, #3b82f6, #10b981, #f59e0b, #ec4899)',
    border: 'rgba(236,72,153,0.5)',
    glow: 'rgba(236,72,153,0.4)',
    text: '#f9a8d4',
  },
]

export default function DressCode() {
  return (
    <section className="relative px-5 py-20 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/dress-code-bg.jpg"
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.12 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #050308 0%, rgba(5,3,8,0.4) 40%, rgba(5,3,8,0.4) 60%, #050308 100%)',
          }}
        />
      </div>

      {/* Side glow accents */}
      <div
        className="absolute -left-20 top-1/3 w-64 h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.15), transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
      <div
        className="absolute -right-20 bottom-1/3 w-64 h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      <div className="relative max-w-lg mx-auto flex flex-col gap-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p
            className="text-xs font-semibold tracking-[0.35em] uppercase mb-3"
            style={{ color: '#f472b6', fontFamily: 'var(--font-body)' }}
          >
            Viste para brillar
          </p>
          <h2
            className="font-sans font-black text-4xl sm:text-5xl italic leading-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #fda4cf 50%, #f472b6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 24px rgba(244,114,182,0.5))',
            }}
          >
            Código de vestimenta
          </h2>
          <div
            className="mx-auto mt-4 h-px w-24"
            style={{
              background: 'linear-gradient(to right, transparent, #f472b6, transparent)',
              boxShadow: '0 0 8px #f472b6',
            }}
          />
        </motion.div>

        {/* Fashion editorial cards */}
        <div className="flex flex-col gap-4">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center gap-5 rounded-3xl p-5 overflow-hidden"
              style={{
                background: 'rgba(8,4,18,0.75)',
                border: `1px solid ${item.border}`,
                boxShadow: `0 0 30px ${item.glow}, 0 12px 40px rgba(0,0,0,0.3)`,
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Swatch */}
              <div
                className="flex-shrink-0 rounded-2xl"
                style={{
                  width: 64,
                  height: 64,
                  background: item.swatch,
                  border: `1.5px solid ${item.border}`,
                  boxShadow: `0 0 20px ${item.glow}`,
                }}
              />

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span
                    className="font-sans font-black text-xl"
                    style={{ color: item.text }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-xs font-semibold tracking-wider uppercase"
                    style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}
                  >
                    {item.sub}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}
                >
                  {item.desc}
                </p>
              </div>

              {/* Right accent */}
              <div
                className="absolute right-0 inset-y-0 w-0.5"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${item.glow}, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom editorial note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-center"
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}
          >
            El look más fotografiado de la noche será tuyo.
            <br />
            <span style={{ color: '#f9a8d4' }}>Atrévete a brillar.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
