'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Save, Upload, Image as ImageIcon, Film, X, Trash2, Edit, Star } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { GalleryAdapter } from '@/services/gallery-adapter.service'

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
  metadata: any
  uploaded_at: string
  status: string
}

export default function AlbumEditPage() {
  const params = useParams()
  console.log('params.id:', params.id)
  const albumId = params.id ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id) : NaN
  console.log('albumId:', albumId)
  
  const [album, setAlbum] = useState<Album | null>(null)
  const [content, setContent] = useState<AlbumContent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [contentToDelete, setContentToDelete] = useState<number | null>(null)
  const [urlModalOpen, setUrlModalOpen] = useState(false)
  const [contentUrl, setContentUrl] = useState('')
  const [urlContentType, setUrlContentType] = useState<'image' | 'video'>('image')
  const [urlPreview, setUrlPreview] = useState<string | null>(null)
  const [savingUrl, setSavingUrl] = useState(false)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [reordering, setReordering] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'gallery' as 'gallery' | 'video',
  })

  useEffect(() => {
    loadAlbum()
    loadContent()
  }, [albumId])

  const loadAlbum = async () => {
    try {
      const response = await fetch(`/api/albums/${albumId}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al cargar álbum')
      }
      const data = await response.json()
      setAlbum(data.album)
      setFormData({
        name: data.album.name,
        description: data.album.description,
        type: data.album.type,
      })
      setError(null)
    } catch (error) {
      console.error('Error loading album:', error)
      setError(error instanceof Error ? error.message : 'Error al cargar álbum')
    } finally {
      setLoading(false)
    }
  }

  const loadContent = async () => {
    try {
      const response = await fetch(`/api/albums/${albumId}/content`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al cargar contenido')
      }
      const data = await response.json()
      setContent(data.content || [])
      setError(null)
    } catch (error) {
      console.error('Error loading content:', error)
      setError(error instanceof Error ? error.message : 'Error al cargar contenido')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const response = await fetch(`/api/albums/${albumId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar álbum')
      }
      
      const data = await response.json()
      setAlbum(data.album)
    } catch (error) {
      console.error('Error saving album:', error)
      setError(error instanceof Error ? error.message : 'Error al guardar álbum')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño de archivo (máximo 10 MB)
    const maxSize = 10 * 1024 * 1024 // 10 MB en bytes
    if (file.size > maxSize) {
      setError('El archivo supera el límite de 10 MB. Usa el botón "Subir contenido por url" para archivos más grandes.')
      return
    }

    setUploading(true)
    setError(null)
    try {
      // Subir a Cloudinary usando la misma lógica que SupabaseGalleryService
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

      if (!cloudName || !uploadPreset) {
        throw new Error('Configuración de Cloudinary no encontrada')
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)
      formData.append('folder', 'isabella-party/albums')
      
      // Determinar el endpoint según el tipo de archivo
      const isVideo = file.type.startsWith('video')
      const uploadEndpoint = isVideo 
        ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
        : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      
      const cloudinaryResponse = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      })
      
      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json().catch(() => ({}))
        console.error('Cloudinary error:', errorData)
        throw new Error(errorData.error?.message || `Error de Cloudinary: HTTP ${cloudinaryResponse.status}`)
      }
      
      const cloudinaryData = await cloudinaryResponse.json()
      
      // Generar thumbnail correcto según el tipo de contenido
      let thumbnailUrl: string
      if (isVideo) {
        // Para videos, usar f_jpg para generar thumbnail del primer frame
        thumbnailUrl = cloudinaryData.secure_url
          .replace('/video/upload/', '/video/upload/c_fill,w_400,h_300,f_jpg/')
      } else {
        // Para imágenes, usar transformación normal
        thumbnailUrl = cloudinaryData.secure_url
          .replace('/upload/', '/upload/c_fill,w_400,h_300/')
      }
      
      // Guardar en Supabase
      const response = await fetch(`/api/albums/${albumId}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloudinary_public_id: cloudinaryData.public_id,
          cloudinary_secure_url: cloudinaryData.secure_url,
          thumbnail_url: thumbnailUrl,
          caption: '',
          description: '',
          content_type: isVideo ? 'video' : 'image',
          duration: cloudinaryData.duration || null,
          file_size: file.size,
          width: cloudinaryData.width,
          height: cloudinaryData.height,
          format: cloudinaryData.format,
          is_cover: content.length === 0, // Primera foto como cover
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error Response:', errorData)
        throw new Error(errorData.error || 'Error al guardar contenido')
      }
      
      await loadContent()
    } catch (error) {
      console.error('Error uploading content:', error)
      setError(error instanceof Error ? error.message : 'Error al subir contenido')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteContent = async (contentId: number) => {
    setContentToDelete(contentId)
    setDeleteModalOpen(true)
  }

  const confirmDeleteContent = async () => {
    if (!contentToDelete) return
    setError(null)
    try {
      const response = await fetch(`/api/albums/${albumId}/content/${contentToDelete}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Error al eliminar contenido')
      await loadContent()
      setDeleteModalOpen(false)
      setContentToDelete(null)
    } catch (error) {
      console.error('Error deleting content:', error)
      setError(error instanceof Error ? error.message : 'Error al eliminar contenido')
    }
  }

  const cancelDeleteContent = () => {
    setDeleteModalOpen(false)
    setContentToDelete(null)
  }

  const handleSaveUrl = async () => {
    if (!contentUrl.trim()) {
      setError('Por favor ingresa una URL válida')
      return
    }

    // Convertir URLs de Google Drive según el tipo de contenido
    let urlToSave = contentUrl
    let thumbnailUrl = contentUrl
    
    if (contentUrl.includes('drive.google.com/file/d/')) {
      const match = contentUrl.match(/\/file\/d\/([^\/]+)/)
      if (match && match[1]) {
        const fileId = match[1]
        // Para videos: usar /preview para reproducción, /thumbnail para mostrar
        if (urlContentType === 'video') {
          urlToSave = `https://drive.google.com/file/d/${fileId}/preview`
          thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`
        } else {
          // Para imágenes: usar /thumbnail para ambos
          urlToSave = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`
          thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`
        }
      }
    }

    setSavingUrl(true)
    setError(null)
    try {
      const response = await fetch(`/api/albums/${albumId}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloudinary_public_id: null,
          cloudinary_secure_url: urlToSave,
          thumbnail_url: thumbnailUrl,
          caption: '',
          description: '',
          content_type: urlContentType,
          duration: null,
          file_size: null,
          width: null,
          height: null,
          format: null,
          is_cover: content.length === 0,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar contenido')
      }

      await loadContent()
      setUrlModalOpen(false)
      setContentUrl('')
      setUrlPreview(null)
    } catch (error) {
      console.error('Error saving URL content:', error)
      setError(error instanceof Error ? error.message : 'Error al guardar contenido')
    } finally {
      setSavingUrl(false)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setContentUrl(url)
    
    // Convertir URLs de Google Drive para previsualización (siempre usar thumbnail)
    let previewUrl = url
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/file\/d\/([^\/]+)/)
      if (match && match[1]) {
        const fileId = match[1]
        // Para previsualización siempre usar thumbnail (más confiable)
        previewUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`
        console.log('Google Drive URL conversion:', { original: url, fileId, previewUrl })
      }
    }
    
    console.log('Setting preview URL:', previewUrl)
    setUrlPreview(previewUrl || null)
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
    const newContent = [...content]
    const [movedItem] = newContent.splice(draggedItem, 1)
    newContent.splice(dropIndex, 0, movedItem)
    
    // Actualizar sort_order para todos los elementos
    const updates = newContent.map((item, index) => ({
      id: item.id,
      sort_order: index
    }))

    try {
      // Actualizar cada elemento en la base de datos
      for (const update of updates) {
        await fetch(`/api/albums/${albumId}/content/${update.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: update.sort_order }),
        })
      }
      
      setContent(newContent)
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
    } catch (error) {
      console.error('Error reordering content:', error)
      setError('Error al reordenar contenido')
    } finally {
      setReordering(false)
      setDraggedItem(null)
    }
  }

  const handleSetCover = async (contentId: number) => {
    setError(null)
    try {
      // Primero quitar is_cover de todos los contenidos
      for (const item of content) {
        if (item.is_cover) {
          await fetch(`/api/albums/${albumId}/content/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_cover: false }),
          })
        }
      }
      
      // Establecer nuevo cover
      const response = await fetch(`/api/albums/${albumId}/content/${contentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_cover: true }),
      })
      
      if (!response.ok) throw new Error('Error al establecer portada')
      await loadContent()
    } catch (error) {
      console.error('Error setting cover:', error)
      setError(error instanceof Error ? error.message : 'Error al establecer portada')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050308' }}>
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
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#050308' }}>
      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: '#f87171' }} />
              <span className="text-sm font-medium" style={{ color: '#f87171' }}>
                {error}
              </span>
              <button
                onClick={() => setError(null)}
                className="ml-2"
                style={{ color: 'rgba(248, 113, 113, 0.6)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navigation */}
      <nav
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 py-4"
        style={{
          background: 'rgba(5,3,8,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(168,85,247,0.1)',
        }}
      >
        <Link href="/admin/albumes">
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
          Editar Álbum
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            opacity: saving ? 0.6 : 1,
          }}
        >
          <Save className="w-4 h-4" style={{ color: '#4ade80' }} />
          <span className="text-sm font-medium" style={{ color: '#4ade80' }}>
            {saving ? 'Guardando...' : 'Guardar'}
          </span>
        </motion.button>
      </nav>

      {/* Main Content */}
      <div className="relative pt-24 pb-20 px-5 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Album Details */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(10,5,20,0.8)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(24px)',
              }}
            >
              <h2 className="text-lg font-bold text-white mb-4">Información del Álbum</h2>
              
              {/* Portada del álbum */}
              {content.find(item => item.is_cover) ? (
                <div className="mb-4 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={content.find(item => item.is_cover)?.thumbnail_url}
                    alt="Portada del álbum"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : content.length > 0 ? (
                <div className="mb-4 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={content[0].thumbnail_url}
                    alt="Primer contenido"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="mb-4 rounded-xl flex items-center justify-center" style={{ aspectRatio: '16/9', background: 'rgba(168, 85, 247, 0.1)' }}>
                  <ImageIcon className="w-12 h-12" style={{ color: 'rgba(168, 85, 247, 0.3)' }} />
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(168, 85, 247, 0.1)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      color: 'white',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl resize-none"
                    style={{
                      background: 'rgba(168, 85, 247, 0.1)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      color: 'white',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Tipo
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
              </div>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(10,5,20,0.8)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(24px)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Contenido del Álbum</h2>
                
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUrlModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                      background: 'rgba(168, 85, 247, 0.15)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                    }}
                  >
                    <Upload className="w-4 h-4" style={{ color: '#c084fc' }} />
                    <span className="text-sm font-medium" style={{ color: '#c084fc' }}>
                      Subir Contenido por url
                    </span>
                  </motion.button>
                  
                  <label className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer"
                    style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    <Upload className="w-4 h-4" style={{ color: '#4ade80' }} />
                    <span className="text-sm font-medium" style={{ color: '#4ade80' }}>
                      {uploading ? 'Subiendo...' : 'Subir Contenido'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {content.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ImageIcon className="w-16 h-16 mb-4" style={{ color: 'rgba(168, 85, 247, 0.3)' }} />
                  <p className="text-white/60">No hay contenido en este álbum</p>
                  <p className="text-white/40 text-sm mt-2">Sube fotos o videos para comenzar</p>
                </div>
              ) : reordering ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 rounded-full mb-4"
                    style={{
                      border: '3px solid rgba(168, 85, 247, 0.2)',
                      borderTopColor: '#c084fc',
                    }}
                  />
                  <p className="text-white/60">Reordenando contenido...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {content.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className="relative rounded-xl overflow-hidden group cursor-move"
                      style={{
                        background: 'rgba(168, 85, 247, 0.1)',
                        border: draggedItem === index 
                          ? '2px solid rgba(168, 85, 247, 0.6)' 
                          : '1px solid rgba(168, 85, 247, 0.2)',
                        opacity: draggedItem === index ? 0.5 : 1,
                      }}
                    >
                      <div className="relative aspect-square">
                        <img
                          src={item.thumbnail_url}
                          alt={item.caption || 'Contenido'}
                          className="w-full h-full object-cover"
                        />
                        
                        {item.content_type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)' }}>
                              <Film className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        )}
                        
                        {item.is_cover && (
                          <div className="absolute top-2 left-2">
                            <span
                              className="px-2 py-1 rounded-full text-xs font-semibold"
                              style={{
                                background: 'rgba(251, 191, 36, 0.2)',
                                border: '1px solid rgba(251, 191, 36, 0.4)',
                                color: '#fbbf24',
                              }}
                            >
                              Portada
                            </span>
                          </div>
                        )}

                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSetCover(item.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{
                              background: item.is_cover
                                ? 'rgba(251, 191, 36, 0.3)'
                                : 'rgba(251, 191, 36, 0.2)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(251, 191, 36, 0.4)',
                            }}
                            title={item.is_cover ? 'Es portada' : 'Establecer como portada'}
                          >
                            <Star className="w-4 h-4" style={{ color: '#fbbf24', fill: item.is_cover ? '#fbbf24' : 'none' }} />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteContent(item.id)}
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
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={cancelDeleteContent}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'rgba(10, 5, 20, 0.95)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  ¿Eliminar contenido?
                </h3>
                <p className="text-white/70 mb-6">
                  Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este contenido del álbum?
                </p>
                <div className="flex gap-3 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelDeleteContent}
                    className="px-4 py-2 rounded-full"
                    style={{
                      background: 'rgba(168, 85, 247, 0.15)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: '#c084fc' }}>
                      Cancelar
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmDeleteContent}
                    className="px-4 py-2 rounded-full"
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: '#f87171' }}>
                      Eliminar
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para subir contenido pesado por URL */}
      <AnimatePresence>
        {urlModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setUrlModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'rgba(10, 5, 20, 0.95)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Subir Contenido por URL
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Tipo de contenido
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setUrlContentType('image')}
                        className={`p-3 rounded-xl flex items-center justify-center gap-2 ${
                          urlContentType === 'image' ? 'ring-2 ring-purple-500' : ''
                        }`}
                        style={{
                          background: urlContentType === 'image'
                            ? 'rgba(168, 85, 247, 0.2)'
                            : 'rgba(168, 85, 247, 0.1)',
                          border: '1px solid rgba(168, 85, 247, 0.2)',
                        }}
                      >
                        <ImageIcon className="w-5 h-5" style={{ color: '#c084fc' }} />
                        <span className="text-sm font-medium text-white">Imagen</span>
                      </motion.button>
                      
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setUrlContentType('video')}
                        className={`p-3 rounded-xl flex items-center justify-center gap-2 ${
                          urlContentType === 'video' ? 'ring-2 ring-purple-500' : ''
                        }`}
                        style={{
                          background: urlContentType === 'video'
                            ? 'rgba(168, 85, 247, 0.2)'
                            : 'rgba(168, 85, 247, 0.1)',
                          border: '1px solid rgba(168, 85, 247, 0.2)',
                        }}
                      >
                        <Film className="w-5 h-5" style={{ color: '#c084fc' }} />
                        <span className="text-sm font-medium text-white">Video</span>
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      URL del contenido
                    </label>
                    <input
                      type="url"
                      value={contentUrl}
                      onChange={handleUrlChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full px-4 py-3 rounded-xl"
                      style={{
                        background: 'rgba(168, 85, 247, 0.1)',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                        color: 'white',
                      }}
                    />
                  </div>

                  {/* Previsualización */}
                  {urlPreview && (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Previsualización
                      </label>
                      <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9', background: 'rgba(168, 85, 247, 0.1)' }}>
                        <img
                          src={urlPreview}
                          alt="Previsualización"
                          className="w-full h-full object-cover"
                          onError={() => setUrlPreview(null)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setUrlModalOpen(false)
                      setContentUrl('')
                      setUrlPreview(null)
                    }}
                    className="px-4 py-2 rounded-full"
                    style={{
                      background: 'rgba(168, 85, 247, 0.15)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: '#c084fc' }}>
                      Cancelar
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveUrl}
                    disabled={savingUrl || !contentUrl.trim()}
                    className="px-4 py-2 rounded-full"
                    style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      opacity: savingUrl || !contentUrl.trim() ? 0.6 : 1,
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: '#4ade80' }}>
                      {savingUrl ? 'Guardando...' : 'Guardar'}
                </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast de éxito */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div
              className="flex items-center gap-3 px-6 py-3 rounded-full"
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: '#4ade80' }} />
              <span className="text-sm font-medium" style={{ color: '#4ade80' }}>
                Contenido reordenado exitosamente
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
