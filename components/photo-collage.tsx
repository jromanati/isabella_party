'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

// Isabella photos — 5 panels
const PHOTOS = [
  { src: "/2.jpeg", alt: 'Isabella 1' },
  { src: "/1.jpeg", alt: 'Isabella 2' },
  { src: "/5.jpeg", alt: 'Isabella 3' },
  { src: "/4.jpeg", alt: 'Isabella 4' },
  { src: "/3.jpeg", alt: 'Isabella 5' },
]

export default function PhotoCollage() {
  return (
    <section className="relative w-full py-8">
      {/* ══════════════════════════════════════════════════════════════════
          GALLERY EXHIBITION — Immersive luxury photo gallery
          Panels are SIDE BY SIDE with spacing, NOT overlapping
          Perspective creates depth like a corridor exhibition
      ══════════════════════════════════════════════════════════════════ */}

      {/* Ambient neon lighting from behind */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 50% 100%, rgba(168,85,247,0.15), transparent 70%),
            radial-gradient(ellipse 80% 50% at 50% 80%, rgba(236,72,153,0.08), transparent 60%)
          `,
        }}
      />

      {/* Perspective container — creates gallery corridor depth */}
      <div
        className="relative mx-auto px-4"
        style={{
          perspective: '1400px',
          perspectiveOrigin: '50% 45%',
          maxWidth: '1200px',
        }}
      >
        {/* Gallery floor plane — creates the 3D exhibition space */}
        <div
          className="relative flex items-end justify-center gap-3 sm:gap-4 md:gap-5"
          style={{
            transform: 'rotateX(2deg)',
            transformStyle: 'preserve-3d',
            height: 'clamp(380px, 55vh, 520px)',
          }}
        >
          {PHOTOS.map((photo, i) => {
            // Panel heights — center is tallest, sides shorter for perspective
            const heights = ['88%', '94%', '100%', '94%', '88%']
            // Subtle rotation for depth — outer panels angled inward
            const rotations = [4, 2, 0, -2, -4]
            // Delays for staggered entrance
            const delays = [0.15, 0.08, 0, 0.08, 0.15]

            return (
              <motion.div
                key={i}
                className="relative flex-shrink-0"
                style={{
                  width: 'clamp(60px, 16vw, 180px)',
                  height: heights[i],
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${rotations[i]}deg)`,
                }}
                initial={{ opacity: 0, y: 80, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 1.1,
                  delay: delays[i],
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  y: -12,
                  scale: 1.04,
                  rotateY: 0,
                  transition: { duration: 0.4, ease: 'easeOut' },
                }}
              >
                {/* Panel frame — illuminated gallery frame */}
                <div
                  className="relative w-full h-full overflow-hidden"
                  style={{
                    borderRadius: '6px',
                    boxShadow: `
                      0 0 0 1px rgba(168,85,247,0.3),
                      0 0 30px rgba(168,85,247,0.15),
                      0 25px 50px -12px rgba(0,0,0,0.6),
                      0 12px 24px -8px rgba(0,0,0,0.4)
                    `,
                    background: 'linear-gradient(180deg, rgba(20,10,30,0.9), rgba(10,5,20,0.95))',
                  }}
                >
                  {/* Inner padding for frame effect */}
                  <div
                    className="absolute inset-0 m-[3px] overflow-hidden"
                    style={{ borderRadius: '4px' }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      style={{ objectPosition: 'center 25%' }}
                      sizes="(max-width: 768px) 20vw, 180px"
                      priority={i === 2}
                    />

                    {/* Top highlight — glossy glass effect */}
                    <div
                      className="absolute inset-x-0 top-0 h-1/4 pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.08), transparent)',
                      }}
                    />

                    {/* Bottom vignette */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to top, rgba(5,2,16,0.5), transparent)',
                      }}
                    />
                  </div>

                  {/* Frame neon edge glow */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      borderRadius: '6px',
                      boxShadow: 'inset 0 0 12px rgba(168,85,247,0.15)',
                    }}
                  />
                </div>

                {/* Floor reflection — mirrored panel below */}
                <div
                  className="absolute top-full left-0 right-0 overflow-hidden pointer-events-none"
                  style={{
                    height: '45%',
                    transform: 'scaleY(-1) translateY(-2px)',
                    transformOrigin: 'top',
                    borderRadius: '6px',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 80%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 80%)',
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: 'center 25%',
                        filter: 'blur(1px) brightness(0.6)',
                      }}
                      sizes="(max-width: 768px) 20vw, 180px"
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Gallery floor — reflective surface */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: `
              linear-gradient(180deg, 
                transparent 0%,
                rgba(168,85,247,0.03) 30%,
                rgba(168,85,247,0.06) 60%,
                rgba(5,2,16,0.9) 100%
              )
            `,
            transform: 'translateY(65%)',
          }}
        />

        {/* Ambient floor glow spots */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.12), transparent 70%)',
            filter: 'blur(16px)',
            transform: 'translateY(80%)',
          }}
        />
      </div>

      {/* Subtle floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => {
          const colors = ['#f472b6', '#c084fc', '#818cf8']
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 2,
                height: 2,
                left: `${15 + i * 10}%`,
                top: `${30 + (i % 3) * 20}%`,
                background: colors[i % 3],
                boxShadow: `0 0 8px ${colors[i % 3]}`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            />
          )
        })}
      </div>
    </section>
  )
}
