'use client'

import { motion } from 'framer-motion'

const SCHEDULE = [
  { time: '6:00 PM', label: 'Recepción de invitados', col: '#60a5fa', icon: '✦' },
  { time: '7:00 PM', label: 'Entrada de la quinceañera', col: '#f472b6', icon: '♛' },
  { time: '7:15 PM', label: 'Vals de honor', col: '#c084fc', icon: '♫' },
  { time: '7:45 PM', label: 'Apertura de la pista (Comienza la rumba)', col: '#ec4899', icon: '💃' },
  { time: '10:30 PM', label: 'Baile sorpresa', col: '#818cf8', icon: '★' },
  { time: '11:45 AM', label: 'Torta y cierre de noche', col: '#a855f7', icon: '◉' },
]

export default function EventSchedule() {
  return (
    <section className="relative px-5 py-20 overflow-hidden">
      {/* Background ambient */}
      <div
        className="absolute inset-x-0 top-0 h-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)',
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
            style={{ color: '#60a5fa', fontFamily: 'var(--font-body)' }}
          >
            11 de Julio · 2025
          </p>
          <h2
            className="font-sans font-black text-4xl sm:text-5xl italic leading-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #bfdbfe 50%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 24px rgba(96,165,250,0.4))',
            }}
          >
            La noche de Isabella
          </h2>
          <div
            className="mx-auto mt-4 h-px w-24"
            style={{
              background: 'linear-gradient(to right, transparent, #60a5fa, transparent)',
              boxShadow: '0 0 8px #60a5fa',
            }}
          />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical spine */}
          <div
            className="absolute left-6 top-3 bottom-3 w-px"
            style={{
              background:
                'linear-gradient(to bottom, #60a5fa, #a855f7, #ec4899, #a855f7, #60a5fa)',
              boxShadow: '0 0 10px rgba(168,85,247,0.5)',
            }}
          />

          <div className="flex flex-col gap-2">
            {SCHEDULE.map((item, i) => (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4"
              >
                {/* Dot */}
                <div
                  className="relative z-10 flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-base"
                  style={{
                    background: `${item.col}18`,
                    border: `1.5px solid ${item.col}55`,
                    boxShadow: `0 0 16px ${item.col}44`,
                    color: item.col,
                  }}
                >
                  {item.icon}
                </div>

                {/* Card */}
                <div
                  className="flex-1 flex items-center justify-between rounded-2xl px-5 py-4"
                  style={{
                    background: 'rgba(8,4,18,0.7)',
                    border: `1px solid ${item.col}22`,
                    boxShadow: `0 0 20px ${item.col}0d`,
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <p
                    className="font-semibold text-sm text-white leading-snug"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {item.label}
                  </p>
                  <span
                    className="flex-shrink-0 ml-3 text-xs font-bold tabular-nums"
                    style={{
                      color: item.col,
                      textShadow: `0 0 10px ${item.col}`,
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {item.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
