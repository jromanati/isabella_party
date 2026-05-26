'use client'

import { motion } from 'framer-motion'

export default function GlassCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-3xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(10,5,25,0.78)',
        border: '1px solid rgba(168,85,247,0.22)',
        boxShadow: '0 0 34px rgba(168,85,247,0.10), 0 18px 55px rgba(0,0,0,0.45)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.9), transparent)',
          boxShadow: '0 0 10px rgba(168,85,247,0.4)',
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}
