'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Film, Image as ImageIcon, X, ArrowLeft, Edit, Trash2, GripVertical } from 'lucide-react'
import Link from 'next/link'

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

export default function AlbumesPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [reordering, setReordering] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'gallery' as 'gallery' | 'video',
  })

  useEffect(() => {
    loadAlbums()
  }, [])

  const loadAlbums = async () => {
    try {
      const response = await fetch('/api/albums')
      if (!response.ok) throw new Error('Error al cargar álbumes')
      const data = await response.json()
      const sortedAlbums = (data.albums || []).sort((a: Album, b: Album) => a.sort_order - b.sort_order)
      setAlbums(sortedAlbums)
    } catch (error) {
      console.error('Error loading albums:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (e: any, index: number) => {
    setDraggedItem(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: any) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: any, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null)
      return
    }

    setReordering(true)
    
    // Reordenar el array localmente
    const newAlbums = [...albums]
    const [movedItem] = newAlbums.splice(draggedItem, 1)
    newAlbums.splice(dropIndex, 0, movedItem)
    
    // Actualizar sort_order para todos los elementos
    const updates = newAlbums.map((item, index) => ({
      id: item.id,
      sort_order: index,
    }))

    try {
      // Enviar actualizaciones al servidor
      await fetch('/api/albums/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ albums: updates }),
      })
      
      setAlbums(newAlbums)
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
    } catch (error) {
      console.error('Error reordering albums:', error)
      // Revertir si hay error
      setAlbums(albums)
    } finally {
      setReordering(false)
      setDraggedItem(null)
    }
  }

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear álbum')
      }
      
      await loadAlbums()
      setShowCreateModal(false)
      setFormData({ name: '', description: '', type: 'gallery' })
    } catch (error) {
      console.error('Error creating album:', error)
      alert(error instanceof Error ? error.message : 'Error al crear álbum')
    }
  }

  const handleDeleteAlbum = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este álbum?')) return
    try {
      const response = await fetch(`/api/albums/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Error al eliminar álbum')
      await loadAlbums()
    } catch (error) {
      console.error('Error deleting album:', error)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#050308' }}>
      {/* Navigation */}
      <nav
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 py-4"
        style={{
          background: 'rgba(5,3,8,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(168,85,247,0.1)',
        }}
      >
        <Link href="/admin">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: '#c084fc' }} />
            <span className="text-sm font-medium" style={{ color: '#f9a8d4' }}>
              Volver
            </span>
          </motion.button>
        </Link>

        <h1
          className="font-sans font-black italic text-xl"
          style={{
            background: 'linear-gradient(135deg, #f9a8d4, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Gestión de Álbumes
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          }}
        >
          <Plus className="w-4 h-4" style={{ color: '#4ade80' }} />
          <span className="text-sm font-medium" style={{ color: '#4ade80' }}>
            Nuevo Álbum
          </span>
        </motion.button>
      </nav>

      {/* Main Content */}
      <div className="relative pt-24 pb-20 px-5 max-w-6xl mx-auto">
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
        ) : albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Film className="w-24 h-24 mb-6" style={{ color: 'rgba(168, 85, 247, 0.3)' }} />
            <h2 className="text-2xl font-bold text-white mb-2">
              No hay álbumes aún
            </h2>
            <p className="text-white/60 max-w-md mb-6">
              Crea tu primer álbum para organizar las fotos y videos de la fiesta.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full"
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              <Plus className="w-5 h-5" style={{ color: '#4ade80' }} />
              <span className="font-medium" style={{ color: '#4ade80' }}>
                Crear Primer Álbum
              </span>
            </motion.button>
          </div>
        ) : (
          <div className="relative">
            {reordering && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-2xl">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 rounded-full"
                  style={{
                    border: '3px solid rgba(168, 85, 247, 0.2)',
                    borderTopColor: '#c084fc',
                  }}
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album, index) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="relative rounded-2xl overflow-hidden cursor-move group"
                  style={{
                    background: 'rgba(10,5,20,0.8)',
                    border: draggedItem === index 
                      ? '2px solid rgba(168, 85, 247, 0.6)' 
                      : '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(24px)',
                    opacity: draggedItem === index ? 0.5 : 1,
                  }}
                >
                  {/* Drag handle icon */}
                  <div className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <GripVertical className="w-4 h-4 text-white" />
                    </div>
                  </div>
                {/* Cover Image */}
                <div className="relative aspect-video">
                  {album.cover_thumbnail ? (
                    <img
                      src={album.cover_thumbnail}
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                      {album.type === 'gallery' ? (
                        <ImageIcon className="w-16 h-16" style={{ color: 'rgba(168, 85, 247, 0.3)' }} />
                      ) : (
                        <Film className="w-16 h-16" style={{ color: 'rgba(168, 85, 247, 0.3)' }} />
                      )}
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                      }}
                    >
                      {album.type === 'gallery' ? (
                        <>
                          <ImageIcon className="w-3 h-3" />
                          Galería
                        </>
                      ) : (
                        <>
                          <Film className="w-3 h-3" />
                          Video
                        </>
                      )}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Link href={`/admin/albumes/${album.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(0,0,0,0.6)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        <Edit className="w-4 h-4 text-white" />
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteAlbum(album.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      <Trash2 className="w-4 h-4" style={{ color: '#f87171' }} />
                    </motion.button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-lg mb-2">{album.name}</h3>
                  <p className="text-white/60 text-sm mb-3 line-clamp-2">{album.description}</p>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>
                      Creado: {new Date(album.created_at).toLocaleDateString('es-ES')}
                    </span>
                    {album.is_featured && (
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(251, 191, 36, 0.15)',
                          border: '1px solid rgba(251, 191, 36, 0.3)',
                          color: '#fbbf24',
                        }}
                      >
                        Destacado
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-md w-full rounded-2xl p-6"
              style={{
                background: 'rgba(10, 5, 20, 0.95)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                backdropFilter: 'blur(24px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                }}
              >
                <X className="w-4 h-4" style={{ color: '#c084fc' }} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">Crear Nuevo Álbum</h2>

              <form onSubmit={handleCreateAlbum} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Nombre del Álbum
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(168, 85, 247, 0.1)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      color: 'white',
                    }}
                    placeholder="Ej: El Vals"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl resize-none"
                    style={{
                      background: 'rgba(168, 85, 247, 0.1)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      color: 'white',
                    }}
                    placeholder="Ej: Revive este lindo momento del vals"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Tipo de Álbum
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, type: 'gallery' })}
                      className={`p-4 rounded-xl flex flex-col items-center gap-2 ${
                        formData.type === 'gallery' ? 'ring-2 ring-purple-500' : ''
                      }`}
                      style={{
                        background: formData.type === 'gallery'
                          ? 'rgba(168, 85, 247, 0.2)'
                          : 'rgba(168, 85, 247, 0.1)',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                      }}
                    >
                      <ImageIcon className="w-8 h-8" style={{ color: '#c084fc' }} />
                      <span className="text-sm font-medium text-white">Galería</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, type: 'video' })}
                      className={`p-4 rounded-xl flex flex-col items-center gap-2 ${
                        formData.type === 'video' ? 'ring-2 ring-purple-500' : ''
                      }`}
                      style={{
                        background: formData.type === 'video'
                          ? 'rgba(168, 85, 247, 0.2)'
                          : 'rgba(168, 85, 247, 0.1)',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                      }}
                    >
                      <Film className="w-8 h-8" style={{ color: '#c084fc' }} />
                      <span className="text-sm font-medium text-white">Video</span>
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #c084fc, #a855f7)',
                    color: 'white',
                  }}
                >
                  Crear Álbum
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div
              className="px-6 py-3 rounded-full flex items-center gap-2"
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: '#4ade80' }} />
              <span className="text-sm font-medium" style={{ color: '#4ade80' }}>
                Orden actualizado correctamente
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
