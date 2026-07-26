'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'

interface AlbumContent {
  id: number
  album_id: number
  cloudinary_public_id: string
  cloudinary_secure_url: string
  thumbnail_url: string
  caption: string
  description: string
  content_type: 'image' | 'video'
  duration: number | null
  file_size: number | null
  width: number | null
  height: number | null
  format: string | null
  sort_order: number
  is_cover: boolean
  metadata: Record<string, any>
  uploaded_at: string
  uploaded_by: number | null
  status: string
}

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

export default function AlbumGalleryPage() {
  const params = useParams()
  const albumId = params.id ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id) : NaN
  
  const [content, setContent] = useState<AlbumContent[]>([])
  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<AlbumContent | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (isNaN(albumId)) return
      
      try {
        // Cargar datos del álbum
        const albumResponse = await fetch(`/api/albums/${albumId}`)
        if (albumResponse.ok) {
          const albumData = await albumResponse.json()
          setAlbum(albumData.album)
        }

        // Cargar contenido del álbum
        const contentResponse = await fetch(`/api/albums/${albumId}/content`)
        if (contentResponse.ok) {
          const contentData = await contentResponse.json()
          const contentArray = contentData.content || []
          console.log('Loaded content:', contentArray)
          // Ordenar por sort_order de la base de datos
          contentArray.sort((a: AlbumContent, b: AlbumContent) => a.sort_order - b.sort_order)
          setContent(contentArray)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [albumId])

  const goToPrevious = useCallback(() => {
    if (!selectedContent || content.length === 0) return
    const currentIndex = content.findIndex(c => c.id === selectedContent.id)
    const previousIndex = currentIndex === 0 ? content.length - 1 : currentIndex - 1
    setSelectedContent(content[previousIndex])
  }, [selectedContent, content])

  const goToNext = useCallback(() => {
    if (!selectedContent || content.length === 0) return
    const currentIndex = content.findIndex(c => c.id === selectedContent.id)
    const nextIndex = currentIndex === content.length - 1 ? 0 : currentIndex + 1
    setSelectedContent(content[nextIndex])
  }, [selectedContent, content])

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
            {album?.name || 'Galería'}
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
        ) : content.length === 0 ? (
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
              Sin contenido
            </h2>
            <p className="text-white/60 max-w-md">
              Este álbum aún no tiene fotos o videos.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {content.map((item, index) => (
              <motion.div
                key={item.id}
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
                  onClick={() => setSelectedContent(item)}
                  whileHover={{
                    boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)',
                    borderColor: 'rgba(168, 85, 247, 0.5)',
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.thumbnail_url}
                      alt={item.caption || item.description || 'Contenido'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        console.error('Error loading thumbnail:', item.thumbnail_url, e)
                      }}
                      onLoad={() => {
                        console.log('Thumbnail loaded successfully:', item.thumbnail_url)
                      }}
                    />
                    
                    {/* Video indicator */}
                    {item.content_type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <Play className="w-8 h-8 text-white" />
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Overlay on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        {item.caption && (
                          <p className="text-white font-semibold text-sm mb-1">
                            {item.caption}
                          </p>
                        )}
                        {item.content_type === 'video' && item.duration && (
                          <p className="text-white/60 text-xs">
                            {Math.floor(item.duration / 60)}:{String(Math.floor(item.duration % 60)).padStart(2, '0')}
                          </p>
                        )}
                        <p className="text-white/60 text-xs">
                          {new Date(item.uploaded_at).toLocaleDateString('es-ES', {
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

      {/* Content Modal */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center md:p-4"
            style={{ background: 'rgba(0, 0, 0, 0.95)' }}
            onClick={() => setSelectedContent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full h-full md:max-w-5xl md:max-h-[90vh] md:h-auto"
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x
                if (swipe < -50) {
                  goToNext()
                } else if (swipe > 50) {
                  goToPrevious()
                }
              }}
            >
              <button
                onClick={() => setSelectedContent(null)}
                className="absolute top-4 right-4 md:-top-12 md:right-0 w-10 h-10 rounded-full flex items-center justify-center z-10 hidden md:flex"
                style={{
                  background: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                }}
              >
                <X className="w-5 h-5" style={{ color: '#c084fc' }} />
              </button>

              <div className="relative w-full h-full md:rounded-2xl md:overflow-hidden" style={{ background: 'rgba(10, 5, 20, 0.8)' }}>
                <div className="relative w-full h-full">
                  {selectedContent.content_type === 'video' ? (
                    selectedContent.cloudinary_secure_url.includes('drive.google.com') ? (
                      <iframe
                        src={selectedContent.cloudinary_secure_url.replace('/preview', '/preview?autoplay=1&controls=0')}
                        className="w-full h-full"
                        style={{ border: 'none' }}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={selectedContent.cloudinary_secure_url}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                      />
                    )
                  ) : (
                    <Image
                      src={selectedContent.cloudinary_secure_url}
                      alt={selectedContent.caption || selectedContent.description || 'Contenido'}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>

                {/* Navigation buttons - centered on each side */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10 hidden md:flex"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10 hidden md:flex"
                  style={{
                    background: 'rgba(168, 85, 247, 0.2)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                  }}
                >
                  <ChevronRight className="w-6 h-6" style={{ color: '#c084fc' }} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
