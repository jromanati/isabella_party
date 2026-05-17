'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Lock, X, ZoomIn, Check, ImageIcon, Camera } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabase/client'
import {
  formatUploadDate,
  type GalleryPhoto,
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
    name: string,
    file: File,
  ) => Promise<{ status: 'approved' | 'pending' | 'rejected' }>
}) {
  const [guestName, setGuestName] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [success, setSuccess] = useState<{ status: 'approved' | 'pending' | 'rejected' } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

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

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setCameraOpen(false)
  }, [])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }
  }, [])

  const openCamera = useCallback(async () => {
    setCameraError(null)

    const mediaDevices = typeof navigator !== 'undefined' ? navigator.mediaDevices : undefined
    if (!mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click()
      return
    }

    try {
      const stream = await mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })

      streamRef.current = stream
      setCameraOpen(true)

      const v = videoRef.current
      if (v) {
        v.srcObject = stream
        await v.play().catch(() => null)
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setCameraError(message)
      cameraInputRef.current?.click()
    }
  }, [])

  const captureFromCamera = useCallback(async () => {
    const v = videoRef.current
    if (!v) return

    const width = v.videoWidth
    const height = v.videoHeight
    if (!width || !height) return

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(v, 0, 0, width, height)

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
    if (!blob) return

    const captured = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' })
    handleFile(captured)
    stopCamera()
  }, [stopCamera])

  const handleSubmit = async () => {
    if (!guestName.trim() || !file) return
    setUploading(true)
    setError(null)
    try {
      const result = await onUpload(guestName.trim(), file)
      setSuccess(result)
      setTimeout(() => {
        setSuccess(null)
        setGuestName('')
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
        <AnimatePresence>
          {cameraOpen && (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              style={{ background: 'rgba(5,3,8,0.92)', backdropFilter: 'blur(16px)' }}
            >
              <div
                className="w-full max-w-lg rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(168,85,247,0.25)', background: 'rgba(10,5,20,0.85)' }}
              >
                <div className="relative aspect-[3/4] bg-black">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                    autoPlay
                  />
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <X className="w-5 h-5 text-white/80" />
                  </button>
                </div>

                <div className="p-4 flex flex-col gap-3">
                  {cameraError && (
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)' }}>
                      {cameraError}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={captureFromCamera}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, rgba(236,72,153,0.85), rgba(168,85,247,0.85))',
                        border: '1px solid rgba(236,72,153,0.4)',
                        color: '#fff',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Capturar
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={stopCamera}
                      className="px-4 py-3 rounded-xl text-sm font-semibold"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.7)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Cancelar
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
          <input
            id="guest-name"
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="¿Cómo te llamas?"
            disabled={uploading}
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'var(--font-body)',
              fontSize: '16px', // prevents iOS zoom on focus
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = '1px solid rgba(168,85,247,0.5)'
              e.currentTarget.style.boxShadow = '0 0 16px rgba(168,85,247,0.15)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
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
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
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
              onClick={openCamera}
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
              whileHover={guestName && file ? { scale: 1.02 } : {}}
              whileTap={guestName && file ? { scale: 0.97 } : {}}
              onClick={handleSubmit}
              disabled={!guestName.trim() || !file || uploading}
              className="group relative overflow-hidden w-full py-4 rounded-xl text-sm font-semibold tracking-wider transition-all duration-300"
              style={{
                background: guestName && file
                  ? 'linear-gradient(135deg, rgba(236,72,153,0.85), rgba(168,85,247,0.85))'
                  : 'rgba(255,255,255,0.04)',
                border: guestName && file
                  ? '1px solid rgba(236,72,153,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                color: guestName && file ? '#fff' : 'rgba(255,255,255,0.25)',
                fontFamily: 'var(--font-body)',
                boxShadow: guestName && file ? '0 0 30px rgba(236,72,153,0.2)' : 'none',
                cursor: guestName && file ? 'pointer' : 'not-allowed',
              }}
            >
              {guestName && file && (
                <span
                  className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
                />
              )}
              <span className="relative flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                {uploading ? 'Analizando foto…' : 'Enviar foto'}
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
          src={photo.url}
          alt={`Foto de ${photo.guestName}`}
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
              {photo.guestName}
            </p>
            <p
              className="text-xs"
              style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}
            >
              {formatUploadDate(photo.uploadedAt)}
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
        src={photo.thumbnailUrl}
        alt={`Foto de ${photo.guestName}`}
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
          {photo.guestName}
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
  const [galleryLocked, setGalleryLocked] = useState(true)
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

        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from('photos')
          .select('id, guest_name, image_url, public_id, status, created_at')
          .order('created_at', { ascending: false })

        if (error) throw error
        if (cancelled) return

        const mapped: GalleryPhoto[] = (data ?? []).map((r) => {
          const thumbnailUrl =
            cloudName && r.public_id
              ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_400/${r.public_id}`
              : r.image_url

          return {
            id: r.id,
            guestName: r.guest_name,
            url: r.image_url,
            thumbnailUrl,
            status: r.status,
            uploadedAt: r.created_at,
          }
        })

        setPhotos(mapped)
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

        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from('gallery_settings')
          .select('uploads_enabled')
          .eq('id', 1)
          .single()

        if (error) throw error
        if (!cancelled) {
          setGalleryLocked(!data.uploads_enabled)
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        if (!cancelled) {
          setSettingsError(message)
          // Fail closed: if settings cannot be loaded, keep uploads locked.
          setGalleryLocked(true)
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
    name: string,
    file: File,
  ): Promise<{ status: 'approved' | 'pending' | 'rejected' }> => {
    if (galleryLocked) {
      throw new Error('La galería está bloqueada')
    }
    setUploadError(null)

    if (!cloudName) {
      throw new Error('Falta NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME en .env.local')
    }
    if (!uploadPreset) {
      throw new Error('Falta NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET en .env.local')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    const body: unknown = await res.json().catch(() => null)
    if (!res.ok) {
      const message =
        body && typeof body === 'object' && 'error' in body
          ? String((body as { error?: { message?: string } }).error?.message ?? 'Error subiendo a Cloudinary')
          : 'Error subiendo a Cloudinary'
      throw new Error(message)
    }

    if (!body || typeof body !== 'object') {
      throw new Error('Respuesta inválida de Cloudinary')
    }

    const { secure_url, public_id, format } = body as {
      secure_url?: string
      public_id?: string
      format?: string
    }

    if (!secure_url || !public_id) {
      throw new Error('Cloudinary no devolvió secure_url/public_id')
    }

    const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_400/${public_id}${format ? `.${format}` : ''}`

    type ModerateApiResponse = {
      photo: {
        id: string
        guest_name: string
        image_url: string
        public_id: string | null
        status: 'pending' | 'approved' | 'rejected'
        created_at: string
      }
    }

    const moderateRes = await fetch('/api/moderate-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guestName: name,
        imageUrl: secure_url,
        publicId: public_id,
      }),
    })

    const moderateBody: unknown = await moderateRes.json().catch(() => null)
    if (!moderateRes.ok) {
      const message =
        moderateBody && typeof moderateBody === 'object' && 'error' in moderateBody
          ? String((moderateBody as { error?: unknown }).error ?? 'Error analizando la foto')
          : 'Error analizando la foto'
      throw new Error(message)
    }

    if (!moderateBody || typeof moderateBody !== 'object' || !('photo' in moderateBody)) {
      throw new Error('Respuesta inválida del servidor')
    }

    const { photo } = moderateBody as ModerateApiResponse
    if (!photo || typeof photo !== 'object') {
      throw new Error('Respuesta inválida del servidor')
    }

    const newPhoto: GalleryPhoto = {
      id: photo.id,
      guestName: photo.guest_name,
      url: photo.image_url,
      thumbnailUrl,
      status: photo.status,
      uploadedAt: photo.created_at,
    }

    setPhotos((prev) => [newPhoto, ...prev])

    return { status: photo.status }
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
        <Link href="/">
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

        <UploadCard locked={galleryLocked} onUpload={handleUpload} />

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
          <Link href="/">
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
              ← Volver a la invitación
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
