'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Camera, Sparkles, ChevronRight, Film } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Album {
  id: number
  name: string
  description: string
  type: 'gallery' | 'video'
  cover_image: string | null
  cover_thumbnail: string | null
  is_public: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export default function AlbumPage() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; opacity: number; duration: number; delay: number }>>([])
  const [mounted, setMounted] = useState(false)
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    const newParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: 0.3 + Math.random() * 0.4,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)
    
    // Cargar álbumes
    loadAlbums()
  }, [])

  const loadAlbums = async () => {
    try {
      const response = await fetch('/api/albums')
      if (response.ok) {
        const data = await response.json()
        const sortedAlbums = (data.albums || []).sort((a: Album, b: Album) => a.sort_order - b.sort_order)
        setAlbums(sortedAlbums)
      }
    } catch (error) {
      console.error('Error loading albums:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAlbumIcon = (type: string) => {
    return type === 'video' ? Film : Camera
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #050211 0%, #1a0a2e 50%, #050211 100%)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Ambient particles */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: `rgba(168, 85, 247, ${particle.opacity})`,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-6xl w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{
              background: 'rgba(168, 85, 247, 0.15)',
              border: '2px solid rgba(168, 85, 247, 0.3)',
              boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)',
            }}
          >
            <Camera className="w-10 h-10" style={{ color: '#c084fc' }} />
          </motion.div>
          <h1
            className="text-4xl md:text-5xl font-black italic mb-3"
            style={{
              background: 'linear-gradient(135deg, #f9a8d4, #c084fc, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Álbumes de la Fiesta
          </h1>
          <p className="text-white/60 text-lg">Los mejores momentos de Isabella XV</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 rounded-full"
              style={{
                border: '3px solid rgba(168, 85, 247, 0.2)',
                borderTopColor: '#c084fc',
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card de Fotos de los Invitados (siempre primera) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/album/galeria">
                <motion.div
                  className="relative overflow-hidden rounded-3xl cursor-pointer h-full flex flex-col"
                  style={{
                    background: 'rgba(168, 85, 247, 0.08)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 0 60px rgba(168, 85, 247, 0.15)',
                    minHeight: '280px',
                  }}
                  whileHover={{
                    boxShadow: '0 0 80px rgba(168, 85, 247, 0.25)',
                    borderColor: 'rgba(168, 85, 247, 0.4)',
                  }}
                >
                  {/* Icono grande como "portada" */}
                  <div className="relative aspect-video w-full flex items-center justify-center" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-16 h-16" style={{ color: 'rgba(168, 85, 247, 0.4)' }} />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Contenido */}
                  <div className="relative z-10 p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-5 h-5" style={{ color: '#f9a8d4' }} />
                      </motion.div>
                      <h2 className="text-lg font-bold text-white leading-tight">
                        Fotos de los Invitados
                      </h2>
                    </div>

                    <p className="text-white/70 text-sm leading-relaxed flex-grow">
                      Explora las fotos capturadas por nuestros invitados durante la celebración.
                    </p>

                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="mt-3 self-end"
                    >
                      <ChevronRight className="w-5 h-5" style={{ color: '#c084fc' }} />
                    </motion.div>
                  </div>

                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{
                      background: 'linear-gradient(90deg, rgba(168,85,247,0.1) 0%, rgba(236,72,153,0.1) 50%, rgba(168,85,247,0.1) 100%)',
                      backgroundSize: '200% 200%',
                    }}
                  />

                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
                    whileHover={{ opacity: 1 }}
                    style={{
                      background: 'radial-gradient(circle at center, rgba(168,85,247,0.15) 0%, transparent 70%)',
                    }}
                  />
                </motion.div>
              </Link>
            </motion.div>

            {/* Cards dinámicas de álbumes */}
            {albums.map((album, index) => {
              const Icon = getAlbumIcon(album.type)
              return (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={`/album/galeria/${album.id}`}>
                    <motion.div
                      className="relative overflow-hidden rounded-3xl cursor-pointer h-full flex flex-col"
                      style={{
                        background: 'rgba(168, 85, 247, 0.08)',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 0 60px rgba(168, 85, 247, 0.15)',
                        minHeight: '280px',
                      }}
                      whileHover={{
                        boxShadow: '0 0 80px rgba(168, 85, 247, 0.25)',
                        borderColor: 'rgba(168, 85, 247, 0.4)',
                      }}
                    >
                      {/* Foto de portada */}
                      {album.cover_thumbnail ? (
                        <div className="relative aspect-video w-full">
                          <img
                            src={album.cover_thumbnail}
                            alt={album.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                      ) : (
                        <div className="relative aspect-video w-full flex items-center justify-center" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                          <Icon className="w-12 h-12" style={{ color: 'rgba(168, 85, 247, 0.4)' }} />
                        </div>
                      )}

                      {/* Contenido */}
                      <div className="relative z-10 p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                          >
                            <Icon className="w-5 h-5" style={{ color: '#f9a8d4' }} />
                          </motion.div>
                          <h2 className="text-lg font-bold text-white leading-tight">
                            {album.name}
                          </h2>
                        </div>

                        <p className="text-white/70 text-sm leading-relaxed flex-grow">
                          {album.description}
                        </p>

                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="mt-3 self-end"
                        >
                          <ChevronRight className="w-5 h-5" style={{ color: '#c084fc' }} />
                        </motion.div>
                      </div>

                      {/* Animated gradient background */}
                      <motion.div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        style={{
                          background: 'linear-gradient(90deg, rgba(168,85,247,0.1) 0%, rgba(236,72,153,0.1) 50%, rgba(168,85,247,0.1) 100%)',
                          backgroundSize: '200% 200%',
                        }}
                      />

                      {/* Glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
                        whileHover={{ opacity: 1 }}
                        style={{
                          background: 'radial-gradient(circle at center, rgba(168,85,247,0.15) 0%, transparent 70%)',
                        }}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-white/40 text-sm mt-6"
        >
          Toca la card para ver la galería completa
        </motion.p>
      </div>
    </div>
  )
}
