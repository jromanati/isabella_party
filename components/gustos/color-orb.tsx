'use client'

import { motion } from 'framer-motion'
import GlassCard from './glass-card'
import type { FavoriteColor } from '@/lib/isabella-gustos'

export default function ColorOrb({ color }: { color: FavoriteColor }) {
  return (
    <GlassCard className="p-6">
      <div className="flex flex-col items-center text-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.25 }}
          className="w-20 h-20 rounded-full"
          style={{
            background: color.hex,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 0 36px ${color.glow}`,
          }}
        />
        <p
          className="mt-4 text-sm font-semibold tracking-wide"
          style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-body)' }}
        >
          {color.name}
        </p>
      </div>
    </GlassCard>
  )
}
