'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import GlassCard from './glass-card'
import type { VibeCard } from '@/lib/isabella-gustos'

export default function PinterestCard({ vibe }: { vibe: VibeCard }) {
  return (
    <GlassCard className="group">
      <div className="relative aspect-[4/5]">
        <Image
          src={vibe.imageSrc}
          alt={vibe.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={false}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.72) 100%)',
          }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 p-5"
          initial={{ opacity: 0.9, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.25 }}
        >
          {vibe.tag ? (
            <div
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{
                background: 'rgba(168,85,247,0.18)',
                border: '1px solid rgba(168,85,247,0.28)',
                color: '#c084fc',
              }}
            >
              {vibe.tag}
            </div>
          ) : null}
          <p className="mt-3 text-white font-semibold text-base leading-snug font-sans">{vibe.title}</p>
          <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
            Una vibra que la define.
          </p>
        </motion.div>
      </div>
    </GlassCard>
  )
}
