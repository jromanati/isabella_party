'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Lock, X, ZoomIn, Check, ImageIcon, Camera } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { AuthService } from '@/services/auth.service'
import { EventService } from '@/services/event.service'
import { GuestService } from '@/services/guest.service'
import { GalleryAdapter } from '@/services/gallery-adapter.service'
import { OpenAIService } from '@/services/openai.service'
import type { EventProfile } from '@/types/event'
import type { Guest } from '@/types/guest'
import type { GalleryPhoto } from '@/types/gallery-photo'
import GuestSelector from '@/components/guest-selector'
import {
  formatUploadDate,
  type GalleryPhoto as LegacyGalleryPhoto,
} from '@/lib/gallery-store'

// ── Neon particle background ──────────────────────────────────
function NeonAmbience() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[50vw] h-[40vh]"
        style={{
          background: 'radial-gradient(ellipse, rgba(236,72,153,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[40vw] h-[30vh]"
        style={{
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}

function UploadCard({
  locked,
  onUpload,
}: {
  locked: boolean
  onUpload: (
    guest: Guest,
    file: File,
    initialStatus?: 'approved' | 'pending'
  ) => Promise<{ status: 'approved' | 'pending' | 'rejected' }>
}) {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [success, setSuccess] = useState<{ status: 'approved' | 'pending' | 'rejected' } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) handleFile(f)
  }, [])

  const handleSubmit = async () => {
    if (!selectedGuest || !file) return
    setUploading(true)
    setError(null)
    try {
      // Step 1: Analyze photo with OpenAI
      const analysis = await OpenAIService.analyzePhoto(file)
      
      // Step 2: Upload with appropriate status based on analysis
      const result = await onUpload(selectedGuest, file, analysis.isValid ? 'approved' : 'pending')
      setSuccess(result)
      setTimeout(() => {
        setSuccess(null)
        setSelectedGuest(null)
        setPreview(null)
        setFile(null)
      }, 3000)
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
    } finally {
      setUploading(false)
    }
  }

  if (locked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative rounded-2xl overflow-hidden p-8 text-center"
        style={{
          background: 'rgba(10,5,20,0.75)',
          border: '1px solid rgba(168,85,247,0.2)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.04) 0%, transparent 60%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex justify-center mb-5"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(168,85,247,0.12)',
              border: '1px solid rgba(168,85,247,0.3)',
              boxShadow: '0 0 24px rgba(168,85,247,0.2)',
            }}
          >
            <Lock className="w-7 h-7" style={{ color: '#c084fc' }} />
          </div>
        </motion.div>
        <h3
          className="font-sans font-black italic text-2xl mb-2"
          style={{
            background: 'linear-gradient(135deg, #f9a8d4, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Galería bloqueada
        </h3>
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}
        >
          La galería se habilitará durante la fiesta
        </p>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-widest uppercase"
          style={{
            background: 'rgba(168,85,247,0.08)',
            border: '1px solid rgba(168,85,247,0.2)',
            color: 'rgba(192,132,252,0.7)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#a855f7', boxShadow: '0 0 6px #a855f7' }} />
          Próximamente
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative rounded-2xl overflow-hidden w-full"
      style={{
        background: 'rgba(10,5,20,0.75)',
        border: '1px solid rgba(236,72,153,0.25)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 0 40px rgba(236,72,153,0.08)',
      }}
    >
      {/* Top accent line */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(to right, transparent, #ec4899, #a855f7, transparent)' }}
      />

      <div className="p-4 sm:p-6 flex flex-col gap-5">
        {error && (
          <div
            className="rounded-xl px-4 py-3"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <p className="text-xs font-semibold">Error al subir</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{error}</p>
          </div>
        )}

        {/* Name input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="guest-name"
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: 'rgba(192,132,252,0.8)', fontFamily: 'var(--font-body)' }}
          >
            Tu nombre
          </label>
          <GuestSelector
            value={selectedGuest?.id?.toString() || ''}
            onChange={setSelectedGuest}
            disabled={uploading}
          />
        </div>

        {/* Source selector — Galería / Cámara */}
        {!preview && (
          <div className="grid grid-cols-2 gap-3">
            {/* Hidden inputs */}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />

            {/* Gallery button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploading}
              className="flex flex-col items-center justify-center gap-3 rounded-xl py-6 px-3 transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1.5px dashed rgba(168,85,247,0.35)',
                opacity: uploading ? 0.6 : 1,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)' }}
              >
                <ImageIcon className="w-5 h-5" style={{ color: '#c084fc' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white/80" style={{ fontFamily: 'var(--font-body)' }}>
                  Galería
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
                  Elige una foto
                </p>
              </div>
            </motion.button>

            {/* Camera button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploading}
              className="flex flex-col items-center justify-center gap-3 rounded-xl py-6 px-3 transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1.5px dashed rgba(236,72,153,0.35)',
                opacity: uploading ? 0.6 : 1,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.3)' }}
              >
                <Camera className="w-5 h-5" style={{ color: '#f472b6' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white/80" style={{ fontFamily: 'var(--font-body)' }}>
                  Cámara
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
                  Tomar foto ahora
                </p>
              </div>
            </motion.button>
          </div>
        )}

        {/* Drop zone — desktop drag support, shown only when no source buttons */}
        {!preview && (
          <div
            className="hidden sm:flex relative rounded-xl overflow-hidden cursor-pointer items-center justify-center flex-col gap-2 py-4 transition-all duration-300"
            style={{
              border: dragging ? '1.5px dashed rgba(236,72,153,0.7)' : '1.5px dashed rgba(255,255,255,0.08)',
              background: dragging ? 'rgba(236,72,153,0.04)' : 'transparent',
            }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-body)' }}>
              {dragging ? 'Suelta aquí tu foto' : 'o arrastra una foto aquí'}
            </p>
          </div>
        )}

        {/* Preview */}
        <AnimatePresence>
          {preview && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="relative rounded-xl overflow-hidden"
              style={{ border: '1.5px solid rgba(168,85,247,0.4)' }}
            >
              <Image
                src={preview}
                alt="Vista previa"
                width={600}
                height={400}
                className="w-full object-cover"
                style={{ maxHeight: '60vw', minHeight: 160 }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(5,3,8,0.5), transparent 60%)' }}
              />
              <button
                className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.2)' }}
                onClick={() => { setPreview(null); setFile(null) }}
              >
                <X className="w-4 h-4 text-white/80" />
              </button>
              <p
                className="absolute bottom-2.5 left-0 right-0 text-center text-xs"
                style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}
              >
                Toca la X para cambiar la foto
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notice */}
        <p
          className="text-xs text-center"
          style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}
        >
          Tu foto será revisada antes de aparecer en la galería.
        </p>

        {/* Submit */}
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 py-4 rounded-xl"
              style={{
                background:
                  success.status === 'approved'
                    ? 'rgba(34,197,94,0.1)'
                    : success.status === 'rejected'
                    ? 'rgba(239,68,68,0.1)'
                    : 'rgba(251,191,36,0.12)',
                border:
                  success.status === 'approved'
                    ? '1px solid rgba(34,197,94,0.3)'
                    : success.status === 'rejected'
                    ? '1px solid rgba(239,68,68,0.35)'
                    : '1px solid rgba(251,191,36,0.35)',
              }}
            >
              <Check
                className="w-5 h-5"
                style={{ color: success.status === 'approved' ? '#4ade80' : success.status === 'rejected' ? '#f87171' : '#fbbf24' }}
              />
              <span
                className="text-sm font-medium"
                style={{
                  color: success.status === 'approved' ? '#4ade80' : success.status === 'rejected' ? '#f87171' : '#fbbf24',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {success.status === 'approved'
                  ? 'Foto aprobada y publicada'
                  : success.status === 'rejected'
                  ? 'Foto rechazada por seguridad'
                  : 'Foto enviada a revisión'}
              </span>
            </motion.div>
          ) : (
            <motion.button
              key="submit"
              whileHover={selectedGuest && file ? { scale: 1.02 } : {}}
              whileTap={selectedGuest && file ? { scale: 0.97 } : {}}
              onClick={handleSubmit}
              disabled={!selectedGuest || !file || uploading}
              className="group relative overflow-hidden w-full py-4 rounded-xl text-sm font-semibold tracking-wider transition-all duration-300"
              style={{
                background: selectedGuest && file
                  ? 'linear-gradient(135deg, rgba(236,72,153,0.85), rgba(168,85,247,0.85))'
                  : 'rgba(255,255,255,0.04)',
                border: selectedGuest && file
                  ? '1px solid rgba(236,72,153,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                color: selectedGuest && file ? '#fff' : 'rgba(255,255,255,0.25)',
                fontFamily: 'var(--font-body)',
                boxShadow: selectedGuest && file ? '0 0 30px rgba(236,72,153,0.2)' : 'none',
                cursor: selectedGuest && file ? 'pointer' : 'not-allowed',
              }}
            >
              {selectedGuest && file && (
                <span
                  className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
                />
              )}
              <span className="relative flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                {uploading ? 'Analizando con IA…' : 'Enviar foto'}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── Fullscreen Modal ──────────────────────────────────────────
function PhotoModal({
  photo,
  onClose,
}: {
  photo: GalleryPhoto
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,3,8,0.95)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative max-w-2xl w-full rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(168,85,247,0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.cloudinary_secure_url}
          alt={`Foto de ${photo.uploaded_by_name}`}
          width={800}
          height={600}
          className="w-full object-cover"
          style={{ maxHeight: '75vh' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between"
          style={{
            background: 'linear-gradient(to top, rgba(5,3,8,0.9) 0%, transparent 100%)',
          }}
        >
          <div>
            <p
              className="font-sans font-bold italic text-lg text-white"
            >
              {photo.uploaded_by_name}
            </p>
            <p
              className="text-xs"
              style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}
            >
              {formatUploadDate(photo.uploaded_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Masonry Photo Card ────────────────────────────────────────
function PhotoCard({
  photo,
  onClick,
  index,
}: {
  photo: GalleryPhoto
  onClick: () => void
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      whileHover={{ scale: 1.02, y: -3 }}
      onClick={onClick}
      className="group relative rounded-xl overflow-hidden cursor-pointer"
      style={{
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      <Image
        src={photo.thumbnail_url}
        alt={`Foto de ${photo.uploaded_by_name}`}
        width={400}
        height={300}
        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ aspectRatio: index % 3 === 0 ? '3/4' : '4/3' }}
      />
      {/* Hover overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: 'rgba(5,3,8,0.55)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(168,85,247,0.3)',
            border: '1px solid rgba(168,85,247,0.5)',
            boxShadow: '0 0 20px rgba(168,85,247,0.3)',
          }}
        >
          <ZoomIn className="w-4 h-4 text-white" />
        </div>
      </motion.div>
      {/* Guest name bottom */}
      <div
        className="absolute inset-x-0 bottom-0 px-3 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to top, rgba(5,3,8,0.9), transparent)',
        }}
      >
        <p
          className="text-xs font-medium text-white/80 truncate"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {photo.uploaded_by_name}
        </p>
      </div>
      {/* Glow border hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(168,85,247,0.35)' }}
      />
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function FotosPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [photosLoading, setPhotosLoading] = useState(true)
  const [photosError, setPhotosError] = useState<string | null>(null)
  const [eventProfile, setEventProfile] = useState<EventProfile | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [settingsError, setSettingsError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [modalPhoto, setModalPhoto] = useState<GalleryPhoto | null>(null)

  const approvedPhotos = photos.filter((p) => p.status === 'approved')
  const approvedMoments = approvedPhotos.slice(0, 5)

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  useEffect(() => {
    let cancelled = false

    const loadPhotos = async () => {
      try {
        setPhotosLoading(true)
        setPhotosError(null)

        // Usar Supabase directamente - no requiere autenticación para leer fotos
        const response = await GalleryAdapter.getPhotos()
        
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Error al cargar fotos')
        }
        
        // Limitar a 5 fotos más recientes (el backend ya ordena descendente)
        const limitedPhotos = response.data.slice(0, 5)
        
        if (!cancelled) {
          setPhotos(limitedPhotos)
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        if (!cancelled) setPhotosError(message)
      } finally {
        if (!cancelled) setPhotosLoading(false)
      }
    }

    loadPhotos()

    return () => {
      cancelled = true
    }
  }, [cloudName])

  useEffect(() => {
    let cancelled = false

    const loadSettings = async () => {
      try {
        setSettingsLoading(true)
        setSettingsError(null)

        // EventProfile no se necesita más - configuración por defecto
        setEventProfile({ 
          photo_uploads_enabled: true,
          gallery_enabled: true,
          playlist_enabled: true,
          guest_messages_enabled: true,
          memory_album_enabled: true,
          public_gallery_enabled: true,
          photo_ai_enabled: true
        } as any)
        setSettingsLoading(false)
        
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        if (!cancelled) {
          setSettingsError(message)
          // Fail closed: if settings cannot be loaded, keep uploads locked.
          setEventProfile({ 
            photo_uploads_enabled: false,
            gallery_enabled: true,
            playlist_enabled: true,
            guest_messages_enabled: true,
            memory_album_enabled: true,
            public_gallery_enabled: true,
            photo_ai_enabled: true
          } as any)
        }
      } finally {
        if (!cancelled) setSettingsLoading(false)
      }
    }

    loadSettings()

    return () => {
      cancelled = true
    }
  }, [])

  const handleUpload = async (
    guest: Guest,
    file: File,
    initialStatus?: 'approved' | 'pending',
  ): Promise<{ status: 'approved' | 'pending' | 'rejected' }> => {
    if (!eventProfile?.photo_uploads_enabled) {
      throw new Error('La galería está bloqueada')
    }
    setUploadError(null)

    // Usar Supabase directamente - no requiere autenticación para subir fotos
    // Subir foto usando GalleryService
    const uploadRequest = {
      file,
      uploaded_by_guest: guest.id,
      uploaded_by_name: guest.full_name,
      source: 'guest_upload',
      status: initialStatus,
    }

    const response = await GalleryAdapter.uploadPhoto(uploadRequest)

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Error subiendo foto')
    }

    const uploadedPhoto = response.data

    // Añadir a la lista localmente
    setPhotos(prev => [uploadedPhoto, ...prev])

    return {
      status: uploadedPhoto.status,
    }
  }

  return (
    <main className="min-h-screen" style={{ background: '#050308' }}>
      <NeonAmbience />

      {/* ── Nav ── */}
      <nav
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 py-4"
        style={{
          background: 'rgba(5,3,8,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(168,85,247,0.1)',
        }}
      >
        <Link href="/guest">
          <span
            className="font-sans font-black italic text-lg"
            style={{
              background: 'linear-gradient(135deg, #f9a8d4, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Isabella XV
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}
          >
            Galería
          </span>
        </div>
      </nav>

      <div className="relative pt-24 pb-20 px-5 max-w-lg mx-auto flex flex-col gap-10">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center pt-4"
        >
          <p
            className="text-xs font-semibold tracking-[0.35em] uppercase mb-3"
            style={{ color: '#c084fc', fontFamily: 'var(--font-body)' }}
          >
            Galería de la noche
          </p>
          <h1
            className="font-sans font-black italic leading-tight"
            style={{
              fontSize: 'clamp(2.4rem, 12vw, 4.5rem)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #c084fc 70%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(192,132,252,0.4))',
            }}
          >
            Recuerdos de
            <br />
            la noche
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mt-4 h-px w-32"
            style={{
              background: 'linear-gradient(to right, transparent, #ec4899, #a855f7, transparent)',
              boxShadow: '0 0 10px #a855f7',
            }}
          />
          <p
            className="mt-4 text-sm"
            style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}
          >
            Comparte tus mejores momentos
          </p>
        </motion.div>

        {/* ── Upload Card ── */}
        {uploadError && (
          <div
            className="rounded-2xl px-4 py-3"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <p className="text-xs font-semibold">Error al subir foto</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{uploadError}</p>
          </div>
        )}

        {settingsError && (
          <div
            className="rounded-2xl px-4 py-3"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <p className="text-xs font-semibold">Error</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{settingsError}</p>
          </div>
        )}

        <UploadCard locked={!eventProfile?.photo_uploads_enabled} onUpload={handleUpload} />

        {/* ── Approved Grid ── */}
        {approvedMoments.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div
                className="h-px flex-1"
                style={{
                  background: 'linear-gradient(to right, rgba(168,85,247,0.4), transparent)',
                }}
              />
              <p
                className="text-xs tracking-[0.25em] uppercase"
                style={{ color: 'rgba(192,132,252,0.7)', fontFamily: 'var(--font-body)' }}
              >
                {approvedMoments.length} momentos
              </p>
              <div
                className="h-px flex-1"
                style={{
                  background: 'linear-gradient(to left, rgba(236,72,153,0.4), transparent)',
                }}
              />
            </div>

            {/* Masonry grid */}
            <div className="columns-2 gap-3">
              {approvedMoments.map((photo, i) => (
                <div key={photo.id} className="mb-3 break-inside-avoid">
                  <PhotoCard
                    photo={photo}
                    index={i}
                    onClick={() => setModalPhoto(photo)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {photosLoading && (
          <div
            className="rounded-2xl px-4 py-3"
            style={{
              background: 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.2)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <p className="text-xs font-semibold">Cargando fotos…</p>
          </div>
        )}

        {/* ── Footer nav ── */}
        <div className="flex justify-center pb-4">
          <Link href="/guest">
            <motion.span
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300"
              style={{
                background: 'rgba(168,85,247,0.08)',
                border: '1px solid rgba(168,85,247,0.4)',
                color: '#c084fc',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 0 18px rgba(168,85,247,0.2), inset 0 0 18px rgba(168,85,247,0.04)',
                cursor: 'pointer',
                textShadow: '0 0 12px rgba(192,132,252,0.6)',
              }}
            >
              ← Volver al menú
            </motion.span>
          </Link>
        </div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modalPhoto && (
          <PhotoModal photo={modalPhoto} onClose={() => setModalPhoto(null)} />
        )}
      </AnimatePresence>
    </main>
  )
}
