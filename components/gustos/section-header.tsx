'use client'

import { motion } from 'framer-motion'

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      {eyebrow ? (
        <p
          className="text-xs font-semibold tracking-[0.35em] uppercase mb-3"
          style={{ color: '#c084fc', fontFamily: 'var(--font-body)' }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className="font-sans font-black italic leading-tight text-3xl sm:text-4xl"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f9a8d4 45%, #c084fc 85%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 22px rgba(192,132,252,0.35))',
        }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className="mt-4 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.58)', fontFamily: 'var(--font-body)' }}
        >
          {subtitle}
        </p>
      ) : null}
      <div
        className="mx-auto mt-5 h-px w-24"
        style={{
          background: 'linear-gradient(to right, transparent, #ec4899, transparent)',
          boxShadow: '0 0 8px #ec4899',
        }}
      />
    </motion.div>
  )
}
