'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface GalleryPhoto {
  id: number
  url: string
  thumbnailUrl: string
  guestName: string
  uploadedAt: string
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null)

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        // Cargar fotos aprobadas del backend
        const response = await fetch('/api/gallery/approved')
        if (!response.ok) throw new Error('Error al cargar fotos')
        
        const data = await response.json()
        setPhotos(data.photos || [])
      } catch (error) {
        console.error('Error loading photos:', error)
        // Fallback con fotos de ejemplo si falla la API
        setPhotos([])
      } finally {
        setLoading(false)
      }
    }

    loadPhotos()
  }, [])

  const goToPrevious = useCallback(() => {
    if (!selectedPhoto || photos.length === 0) return
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id)
    const previousIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1
    setSelectedPhoto(photos[previousIndex])
  }, [selectedPhoto, photos])

  const goToNext = useCallback(() => {
    if (!selectedPhoto || photos.length === 0) return
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id)
    const nextIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1
    setSelectedPhoto(photos[nextIndex])
  }, [selectedPhoto, photos])

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/gallery-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85" />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4">
        <Link href="/album">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <X className="w-4 h-4" style={{ color: '#c084fc' }} />
            <span className="text-sm font-medium" style={{ color: '#f9a8d4' }}>
              Volver
            </span>
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1
            className="text-3xl md:text-4xl font-black italic"
            style={{
              background: 'linear-gradient(135deg, #f9a8d4, #c084fc, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Galería de Invitados
          </h1>
        </motion.div>

        <div className="w-24" /> {/* Spacer for centering */}
      </nav>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-full"
              style={{
                border: '3px solid rgba(168, 85, 247, 0.2)',
                borderTopColor: '#c084fc',
              }}
            />
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-24 h-24 rounded-full mb-6 flex items-center justify-center"
              style={{
                background: 'rgba(168, 85, 247, 0.15)',
                border: '2px solid rgba(168, 85, 247, 0.3)',
              }}
            >
              <ZoomIn className="w-12 h-12" style={{ color: '#c084fc' }} />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Próximamente
            </h2>
            <p className="text-white/60 max-w-md">
              Las fotos de los invitados estarán disponibles aquí después de la fiesta.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  style={{
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                  onClick={() => setSelectedPhoto(photo)}
                  whileHover={{
                    boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)',
                    borderColor: 'rgba(168, 85, 247, 0.5)',
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={photo.thumbnailUrl}
                      alt={`Foto de ${photo.guestName}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-semibold text-sm mb-1">
                          {photo.guestName}
                        </p>
                        <p className="text-white/60 text-xs">
                          {new Date(photo.uploadedAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </motion.div>

                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.95)' }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-5xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                }}
              >
                <X className="w-5 h-5" style={{ color: '#c084fc' }} />
              </button>

              <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(10, 5, 20, 0.8)' }}>
                <div className="relative aspect-[16/9] md:aspect-[4/3]">
                  <Image
                    src={selectedPhoto.url}
                    alt={`Foto de ${selectedPhoto.guestName}`}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">
                        {selectedPhoto.guestName}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {new Date(selectedPhoto.uploadedAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={goToPrevious}
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(168, 85, 247, 0.2)',
                          border: '1px solid rgba(168, 85, 247, 0.3)',
                        }}
                      >
                        <ChevronLeft className="w-6 h-6" style={{ color: '#c084fc' }} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={goToNext}
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(168, 85, 247, 0.2)',
                          border: '1px solid rgba(168, 85, 247, 0.3)',
                        }}
                      >
                        <ChevronRight className="w-6 h-6" style={{ color: '#c084fc' }} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
