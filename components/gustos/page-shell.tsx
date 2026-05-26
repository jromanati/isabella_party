'use client'

import { motion } from 'framer-motion'

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: '#050308' }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(168,85,247,0.22) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 20% 20%, rgba(59,130,246,0.10) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 80% 35%, rgba(236,72,153,0.08) 0%, transparent 60%)',
        }}
      />
      <FloatingParticles />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        {children}
      </motion.div>
    </main>
  )
}

function FloatingParticles() {
  const particles = Array.from({ length: 16 }).map((_, i) => i)

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 6 : 4,
            height: i % 3 === 0 ? 6 : 4,
            left: `${(i * 13) % 100}%`,
            top: `${(i * 17) % 100}%`,
            background: i % 2 === 0 ? 'rgba(168,85,247,0.35)' : 'rgba(59,130,246,0.22)',
            filter: 'blur(0.2px)',
            boxShadow: i % 2 === 0 ? '0 0 18px rgba(168,85,247,0.22)' : '0 0 16px rgba(59,130,246,0.16)',
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -18, 0],
          }}
          transition={{
            duration: 7 + (i % 5),
            repeat: Infinity,
            delay: (i % 7) * 0.6,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
