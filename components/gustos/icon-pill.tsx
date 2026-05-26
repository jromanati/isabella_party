'use client'

import { motion } from 'framer-motion'
import {
  Sparkles,
  Music,
  Pencil,
  Star,
  Cpu,
  Heart,
  Book,
  Smile,
  Droplet,
  Volleyball,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  sparkles: Sparkles,
  music: Music,
  pencil: Pencil,
  star: Star,
  cpu: Cpu,
  heart: Heart,
  book: Book,
  smile: Smile,
  droplet: Droplet,
  volleyball: Volleyball,
}

export default function IconPill({ label, icon }: { label: string; icon: string }) {
  const Icon = iconMap[icon] ?? Sparkles

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{
        background: 'rgba(10,5,25,0.75)',
        border: '1px solid rgba(168,85,247,0.18)',
        boxShadow: '0 0 24px rgba(168,85,247,0.10)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center"
        style={{
          background: 'rgba(168,85,247,0.14)',
          border: '1px solid rgba(168,85,247,0.24)',
          boxShadow: '0 0 18px rgba(168,85,247,0.12)',
        }}
      >
        <Icon className="w-5 h-5" style={{ color: '#c084fc' }} />
      </div>
      <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-body)' }}>
        {label}
      </p>
    </motion.div>
  )
}
