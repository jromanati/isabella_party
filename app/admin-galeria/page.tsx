
'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Eye, Lock, Unlock, Clock, LayoutGrid, Image as ImageIcon, Trash2, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { GalleryAdapter } from '@/services/gallery-adapter.service'
import { AuthService } from '@/services/auth.service'
import { GuestService } from '@/services/guest.service'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useAutoMarkAsReviewed } from '@/hooks/useAutoMarkAsReviewed'
import {
  formatUploadDate,
  type GalleryPhoto as AdminGalleryPhoto,
  type PhotoStatus,
} from '@/lib/gallery-store'
import type { GalleryPhoto } from '@/types/gallery-photo'

// ── Mapeo entre tipos GalleryPhoto ─────────────────────────────
function mapToAdminGalleryPhoto(photo: GalleryPhoto): AdminGalleryPhoto {
  return {
    id: photo.id.toString(),
    guestName: photo.uploaded_by_name || 'Invitado',
    url: photo.cloudinary_secure_url || '',
    thumbnailUrl: photo.thumbnail_url || photo.cloudinary_secure_url || '',
    status: photo.status as PhotoStatus,
    uploadedAt: photo.uploaded_at
  }
}

// ── Neon ambience (same pattern as /fotos) ────────────────────
function NeonAmbience() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh]"
        style={{
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
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

// ── Neon Toggle Switch ────────────────────────────────────────
function NeonToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="relative w-16 h-8 rounded-full transition-all duration-500 focus:outline-none flex-shrink-0"
      style={{
        background: enabled
          ? 'linear-gradient(135deg, #ec4899, #a855f7)'
          : 'rgba(255,255,255,0.08)',
        border: enabled ? '1px solid rgba(236,72,153,0.5)' : '1px solid rgba(255,255,255,0.12)',
        boxShadow: enabled ? '0 0 20px rgba(236,72,153,0.3)' : 'none',
      }}
      aria-label={enabled ? 'Deshabilitar galería' : 'Habilitar galería'}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-6 h-6 rounded-full"
        style={{
          left: enabled ? '34px' : '4px',
          background: '#fff',
          boxShadow: enabled ? '0 0 10px rgba(236,72,153,0.5)' : '0 2px 4px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  )
}

// ── Tab button ────────────────────────────────────────────────
function TabButton({
  label,
  count,
  active,
  color,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  color: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden"
      style={{
        background: active ? `rgba(${color},0.12)` : 'transparent',
        border: active ? `1px solid rgba(${color},0.3)` : '1px solid rgba(255,255,255,0.06)',
        color: active ? `rgb(${color})` : 'rgba(255,255,255,0.4)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {active && (
        <motion.div
          layoutId="tab-glow"
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ boxShadow: `inset 0 0 20px rgba(${color},0.08)` }}
        />
      )}
      <span className="relative">{label}</span>
      <span
        className="relative text-xs px-1.5 py-0.5 rounded-full"
        style={{
          background: active ? `rgba(${color},0.2)` : 'rgba(255,255,255,0.06)',
          color: active ? `rgb(${color})` : 'rgba(255,255,255,0.3)',
        }}
      >
        {count}
      </span>
    </button>
  )
}

// ── Moderation Photo Card ─────────────────────────────────────
function ModerationCard({
  photo,
  onApprove,
  onReject,
  showActions,
}: {
  photo: GalleryPhoto
  onApprove?: () => void
  onReject?: () => void
  showActions: boolean
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-xl overflow-hidden"
      style={{
        background: 'rgba(10,5,20,0.7)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Status accent top line */}
      <div
        className="h-px w-full"
        style={{
          background:
            photo.status === 'approved'
              ? 'linear-gradient(to right, transparent, rgba(34,197,94,0.6), transparent)'
              : photo.status === 'rejected'
              ? 'linear-gradient(to right, transparent, rgba(239,68,68,0.5), transparent)'
              : 'linear-gradient(to right, transparent, rgba(168,85,247,0.5), transparent)',
        }}
      />

      {/* Photo */}
      <div className="relative aspect-video">
        <Image
          src={photo.thumbnailUrl}
          alt={`Foto de ${photo.guestName}`}
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(5,3,8,0.7) 0%, transparent 50%)' }}
        />
        {/* Status badge */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background:
                photo.status === 'approved'
                  ? 'rgba(34,197,94,0.2)'
                  : photo.status === 'rejected'
                  ? 'rgba(239,68,68,0.2)'
                  : 'rgba(168,85,247,0.2)',
              border:
                photo.status === 'approved'
                  ? '1px solid rgba(34,197,94,0.4)'
                  : photo.status === 'rejected'
                  ? '1px solid rgba(239,68,68,0.35)'
                  : '1px solid rgba(168,85,247,0.35)',
              color:
                photo.status === 'approved'
                  ? '#4ade80'
                  : photo.status === 'rejected'
                  ? '#f87171'
                  : '#c084fc',
              fontFamily: 'var(--font-body)',
            }}
          >
            {photo.status === 'approved'
              ? 'Aprobada'
              : photo.status === 'rejected'
              ? 'Rechazada'
              : 'Pendiente'}
          </span>
        </div>
      </div>

      {/* Info + actions */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className="font-sans font-bold italic text-base text-white"
            >
              {photo.guestName}
            </p>
            <p
              className="text-xs flex items-center gap-1.5 mt-0.5"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}
            >
              <Clock className="w-3 h-3" />
              {formatUploadDate(photo.uploadedAt)}
            </p>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onApprove}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300"
              style={{
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: '#4ade80',
                fontFamily: 'var(--font-body)',
              }}
            >
              <Check className="w-3.5 h-3.5" />
              Aprobar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onReject}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171',
                fontFamily: 'var(--font-body)',
              }}
            >
              <X className="w-3.5 h-3.5" />
              Rechazar
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Gallery Control Card ──────────────────────────────────────
function GalleryControlCard({
  enabled,
  lastActivated,
  onToggle,
}: {
  enabled: boolean
  lastActivated: string | null
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(10,5,20,0.8)',
        border: enabled
          ? '1px solid rgba(236,72,153,0.3)'
          : '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(24px)',
        boxShadow: enabled ? '0 0 40px rgba(236,72,153,0.08)' : 'none',
        transition: 'all 0.5s ease',
      }}
    >
      {/* Animated top accent */}
      <div
        className="h-px w-full transition-all duration-700"
        style={{
          background: enabled
            ? 'linear-gradient(to right, transparent, #ec4899, #a855f7, transparent)'
            : 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
          boxShadow: enabled ? '0 0 12px rgba(236,72,153,0.4)' : 'none',
        }}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500"
              style={{
                background: enabled ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.05)',
                border: enabled ? '1px solid rgba(236,72,153,0.3)' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: enabled ? '0 0 16px rgba(236,72,153,0.2)' : 'none',
              }}
            >
              {enabled ? (
                <Unlock className="w-5 h-5" style={{ color: '#f472b6' }} />
              ) : (
                <Lock className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.35)' }} />
              )}
            </div>
            <div>
              <p
                className="text-sm font-semibold text-white"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Subida de fotos
              </p>
              <p
                className="text-xs"
                style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}
              >
                Controla el acceso de los invitados
              </p>
            </div>
          </div>
          <NeonToggle enabled={enabled} onToggle={onToggle} />
        </div>

        {/* Status indicator */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: enabled ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
            border: enabled ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <motion.div
            animate={enabled ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: enabled ? '#4ade80' : 'rgba(255,255,255,0.2)',
              boxShadow: enabled ? '0 0 8px #4ade80' : 'none',
            }}
          />
          <div className="flex-1">
            <p
              className="text-xs font-semibold"
              style={{
                color: enabled ? '#4ade80' : 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {enabled ? 'Galería habilitada — los invitados pueden subir fotos' : 'Galería deshabilitada'}
            </p>
            {lastActivated && (
              <p
                className="text-xs mt-0.5"
                style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-body)' }}
              >
                Última activación: {formatUploadDate(lastActivated)}
              </p>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="flex gap-2 mt-4">
          <Link href="/fotos" className="flex-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs cursor-pointer transition-all duration-300"
              style={{
                background: 'rgba(168,85,247,0.08)',
                border: '1px solid rgba(168,85,247,0.2)',
                color: 'rgba(192,132,252,0.8)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              Ver galería pública
            </motion.div>
          </Link>
          <Link href="/slideshow" className="flex-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs cursor-pointer transition-all duration-300"
              style={{
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)',
                color: 'rgba(96,165,250,0.8)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Abrir slideshow
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ── Stats Row ─────────────────────────────────────────────────
function StatsRow({
  total,
  pending,
  approved,
  rejected,
}: {
  total: number
  pending: number
  approved: number
  rejected: number
}) {
  const stats = [
    { label: 'Total', value: total, color: '168,85,247' },
    { label: 'Pendientes', value: pending, color: '234,179,8' },
    { label: 'Aprobadas', value: approved, color: '34,197,94' },
    { label: 'Rechazadas', value: rejected, color: '239,68,68' },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="rounded-xl p-3 text-center"
          style={{
            background: `rgba(${s.color},0.07)`,
            border: `1px solid rgba(${s.color},0.18)`,
          }}
        >
          <p
            className="font-sans font-black italic text-2xl"
            style={{ color: `rgb(${s.color})` }}
          >
            {s.value}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: `rgba(${s.color},0.7)`, fontFamily: 'var(--font-body)' }}
          >
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────
type Tab = 'pending' | 'approved' | 'rejected'

export default function AdminGaleriaPage() {
  // Auto-marcar fotos como revisadas cuando se entra a esta página
  useAutoMarkAsReviewed()

  const [photos, setPhotos] = useState<AdminGalleryPhoto[]>([])
  const [photosLoading, setPhotosLoading] = useState(true)
  const [photosError, setPhotosError] = useState<string | null>(null)
  const [savingPhotoId, setSavingPhotoId] = useState<string | null>(null)

  const [guests, setGuests] = useState<{
    id: number
    full_name: string
    table: number | null
    rsvp_status: string
    created_at: string
  }[]>([])
  const [guestsLoading, setGuestsLoading] = useState(true)
  const [guestsError, setGuestsError] = useState<string | null>(null)
  const [guestQuery, setGuestQuery] = useState('')
  const [guestFilter, setGuestFilter] = useState<'all' | 'confirmed' | 'pending'>('all')

  const [galleryEnabled, setGalleryEnabled] = useState(false)
  const [lastActivated, setLastActivated] = useState<string | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsError, setSettingsError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('pending')

  const pending = photos.filter((p) => p.status === 'pending')
  const approved = photos.filter((p) => p.status === 'approved')
  const rejected = photos.filter((p) => p.status === 'rejected')

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  const toGalleryPhoto = useCallback(
    (row: {
      id: string
      guest_name: string
      image_url: string
      public_id: string | null
      status: PhotoStatus
      created_at: string
    }): GalleryPhoto => {
      const thumbnailUrl =
        cloudName && row.public_id
          ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_400/${row.public_id}`
          : row.image_url

      return {
        id: row.id,
        guestName: row.guest_name,
        url: row.image_url,
        thumbnailUrl,
        status: row.status,
        uploadedAt: row.created_at,
      }
    },
    [cloudName]
  )

  useEffect(() => {
    let cancelled = false

    const loadPhotos = async () => {
      try {
        setPhotosLoading(true)
        setPhotosError(null)

        const response = await GalleryAdapter.getPhotos()
        
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Error al cargar fotos')
        }
        
        if (cancelled) return

        // Mapear al tipo que espera la página admin-galeria
        const mappedPhotos = response.data.map(mapToAdminGalleryPhoto)
        setPhotos(mappedPhotos)
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
  }, [toGalleryPhoto])

  useEffect(() => {
    let cancelled = false

    const loadSettings = async () => {
      try {
        setSettingsLoading(true)
        setSettingsError(null)

        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from('gallery_settings')
          .select('id, uploads_enabled, updated_at')
          .order('id', { ascending: true })
          .limit(1)

        if (error) throw error
        const row = data?.[0]

        if (!cancelled && row) {
          setGalleryEnabled(row.uploads_enabled)
          setLastActivated(row.updated_at)
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        if (!cancelled) setSettingsError(message)
      } finally {
        if (!cancelled) setSettingsLoading(false)
      }
    }

    loadSettings()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadGuests = async () => {
      try {
        setGuestsLoading(true)
        setGuestsError(null)

        // Asegurar autenticación antes de cargar invitados
        const token = await AuthService.getValidToken()
        if (!token) {
          throw new Error('No se pudo autenticar con la API')
        }

        const response = await GuestService.getGuests()

        if (!response.success || !response.data) {
          throw new Error(response.error || 'Error al cargar invitados')
        }
        if (cancelled) return

        // Mapear al formato esperado por el componente
        const mappedGuests = response.data.map(guest => ({
          id: guest.id,
          full_name: guest.full_name,
          table: guest.table,
          rsvp_status: guest.rsvp_status,
          created_at: guest.created_at,
        }))

        setGuests(mappedGuests)
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        if (!cancelled) setGuestsError(message)
      } finally {
        if (!cancelled) setGuestsLoading(false)
      }
    }

    loadGuests()

    return () => {
      cancelled = true
    }
  }, [])

  const handleToggle = async () => {
    if (settingsSaving) return

    const next = !galleryEnabled
    const previousEnabled = galleryEnabled
    const previousActivated = lastActivated

    setGalleryEnabled(next)
    setSettingsSaving(true)
    setSettingsError(null)

    try {
      const supabase = getSupabaseClient()

      const { data: saved, error: saveError } = await supabase
        .from('gallery_settings')
        .upsert({ id: 1, uploads_enabled: next }, { onConflict: 'id' })
        .select('uploads_enabled, updated_at')
        .single()

      if (saveError) throw saveError
      setLastActivated(saved.updated_at)
      setGalleryEnabled(saved.uploads_enabled)
    } catch (e) {
      setGalleryEnabled(previousEnabled)
      setLastActivated(previousActivated)
      const message = e instanceof Error ? e.message : String(e)
      setSettingsError(message)
    } finally {
      setSettingsSaving(false)
    }
  }

  const updateStatus = async (id: string, status: PhotoStatus) => {
    if (savingPhotoId) return

    const prev = photos
    setSavingPhotoId(id)
    setPhotos((p) => p.map((x) => (x.id === id ? { ...x, status } : x)))

    try {
      const response = await GalleryAdapter.updatePhotoStatus(id, status)
      
      if (!response.success) {
        throw new Error(response.error || 'Error actualizando status de foto')
      }
    } catch (e) {
      setPhotos(prev)
      const message = e instanceof Error ? e.message : String(e)
      setPhotosError(message)
    } finally {
      setSavingPhotoId(null)
    }
  }

  const tabPhotos: Record<Tab, AdminGalleryPhoto[]> = {
    pending,
    approved,
    rejected,
  }

  const tabConfig: { key: Tab; label: string; count: number; color: string }[] = [
    { key: 'pending', label: 'Pendientes', count: pending.length, color: '168,85,247' },
    { key: 'approved', label: 'Aprobadas', count: approved.length, color: '34,197,94' },
    { key: 'rejected', label: 'Rechazadas', count: rejected.length, color: '239,68,68' },
  ]

  const guestsConfirmed = guests.filter((g) => g.rsvp_status === 'confirmed')
  const guestsPending = guests.filter((g) => g.rsvp_status !== 'confirmed')

  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()

  const filteredGuests = guests.filter((g) => {
    const matchesQuery = guestQuery.trim()
      ? normalize(g.full_name).includes(normalize(guestQuery))
      : true

    const isConfirmed = g.rsvp_status === 'confirmed'
    const matchesFilter =
      guestFilter === 'all'
        ? true
        : guestFilter === 'confirmed'
        ? isConfirmed
        : !isConfirmed

    return matchesQuery && matchesFilter
  })

  return (
    <main className="min-h-screen" style={{ background: '#050308' }}>
      <NeonAmbience />

      {/* ── Nav ── */}
      <nav
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 py-4"
        style={{
          background: 'rgba(5,3,8,0.85)',
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
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.2)',
            color: 'rgba(192,132,252,0.8)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#a855f7', boxShadow: '0 0 6px #a855f7' }}
          />
          Admin
        </div>
      </nav>

      <div className="relative pt-24 pb-20 px-5 max-w-lg mx-auto flex flex-col gap-6">

        {/* ── Page title ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="pt-2"
        >
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase mb-2"
            style={{ color: '#c084fc', fontFamily: 'var(--font-body)' }}
          >
            Panel de control
          </p>
          <div className="flex items-center gap-6">
            <h1
              className="font-sans font-black italic"
              style={{
                fontSize: 'clamp(2rem, 10vw, 3.5rem)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(192,132,252,0.3))',
              }}
            >
              Galería
            </h1>
            
            <div className="flex items-center gap-3">
              <Link
                href="/admin-mensajes"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all"
                style={{
                  background: 'rgba(168,85,247,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Mensajes</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Gallery Controls ── */}
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

        {settingsSaving && (
          <div
            className="rounded-2xl px-4 py-3"
            style={{
              background: 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.2)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <p className="text-xs font-semibold">Guardando…</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Actualizando configuración en Supabase
            </p>
          </div>
        )}

        <div
          style={{
            opacity: settingsLoading ? 0.6 : 1,
            pointerEvents: settingsLoading || settingsSaving ? 'none' : ('auto' as const),
          }}
        >
          <GalleryControlCard
            enabled={galleryEnabled}
            lastActivated={lastActivated}
            onToggle={handleToggle}
          />
        </div>

        {/* ── Stats ── */}
        <StatsRow
          total={photos.length}
          pending={pending.length}
          approved={approved.length}
          rejected={rejected.length}
        />

        {/* ── Tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabConfig.map((t) => (
            <TabButton
              key={t.key}
              label={t.label}
              count={t.count}
              active={activeTab === t.key}
              color={t.color}
              onClick={() => setActiveTab(t.key)}
            />
          ))}
        </div>

        {/* ── Photos grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            {tabPhotos[activeTab].length === 0 ? (
              <div
                className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl"
                style={{
                  border: '1px dashed rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(168,85,247,0.08)',
                    border: '1px solid rgba(168,85,247,0.15)',
                  }}
                >
                  <ImageIcon className="w-5 h-5" style={{ color: 'rgba(192,132,252,0.4)' }} />
                </div>
                <p
                  className="text-sm"
                  style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-body)' }}
                >
                  No hay fotos en esta sección
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <AnimatePresence>
                  {tabPhotos[activeTab].map((photo) => (
                    <ModerationCard
                      key={photo.id}
                      photo={photo}
                      showActions={activeTab === 'pending'}
                      onApprove={
                        savingPhotoId === photo.id
                          ? undefined
                          : () => updateStatus(photo.id, 'approved')
                      }
                      onReject={
                        savingPhotoId === photo.id
                          ? undefined
                          : () => updateStatus(photo.id, 'rejected')
                      }
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

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

        {/* ── Guests list ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10,5,20,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div
            className="h-px w-full"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.55), rgba(168,85,247,0.55), transparent)',
              boxShadow: '0 0 12px rgba(168,85,247,0.25)',
            }}
          />

          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p
                  className="text-xs font-semibold tracking-[0.3em] uppercase mb-2"
                  style={{ color: 'rgba(96,165,250,0.75)', fontFamily: 'var(--font-body)' }}
                >
                  Invitados
                </p>
                <p className="font-sans font-black italic text-2xl text-white">Asistencia</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: 'rgba(34,197,94,0.12)',
                    border: '1px solid rgba(34,197,94,0.28)',
                    color: '#4ade80',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {guestsConfirmed.length} confirmados
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: 'rgba(251,191,36,0.12)',
                    border: '1px solid rgba(251,191,36,0.3)',
                    color: '#fbbf24',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {guestsPending.length} pendientes
                </span>
              </div>
            </div>

            {guestsError && (
              <div
                className="rounded-xl px-4 py-3"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: 'rgba(255,255,255,0.75)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <p className="text-xs font-semibold">Error cargando invitados</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{guestsError}</p>
              </div>
            )}

            {guestsLoading ? (
              <div
                className="rounded-xl px-4 py-3"
                style={{
                  background: 'rgba(59,130,246,0.08)',
                  border: '1px solid rgba(59,130,246,0.18)',
                  color: 'rgba(255,255,255,0.75)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <p className="text-xs font-semibold">Cargando invitados…</p>
              </div>
            ) : (
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="p-3" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex flex-col gap-2">
                    <input
                      value={guestQuery}
                      onChange={(e) => setGuestQuery(e.target.value)}
                      placeholder="Buscar invitado…"
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.85)',
                        fontFamily: 'var(--font-body)',
                      }}
                    />

                    <div className="flex gap-2">
                      {(
                        [
                          { key: 'all' as const, label: 'Todos', color: '255,255,255' },
                          { key: 'confirmed' as const, label: 'Confirmados', color: '34,197,94' },
                          { key: 'pending' as const, label: 'Pendientes', color: '251,191,36' },
                        ]
                      ).map((f) => {
                        const active = guestFilter === f.key
                        return (
                          <button
                            key={f.key}
                            onClick={() => setGuestFilter(f.key)}
                            className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300"
                            style={{
                              background: active ? `rgba(${f.color},0.12)` : 'rgba(255,255,255,0.02)',
                              border: active ? `1px solid rgba(${f.color},0.3)` : '1px solid rgba(255,255,255,0.06)',
                              color: active ? `rgb(${f.color})` : 'rgba(255,255,255,0.45)',
                              fontFamily: 'var(--font-body)',
                            }}
                            type="button"
                          >
                            {f.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="max-h-[360px] overflow-y-auto">
                  {guests.length === 0 ? (
                    <div className="p-4">
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
                        No hay invitados cargados.
                      </p>
                    </div>
                  ) : filteredGuests.length === 0 ? (
                    <div className="p-4">
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
                        No se encontraron invitados con esos filtros.
                      </p>
                    </div>
                  ) : (
                    filteredGuests.map((g, idx) => {
                      const isConfirmed = g.rsvp_status === 'confirmed'
                      return (
                        <div
                          key={g.id}
                          className="flex items-center justify-between gap-3 px-4 py-3"
                          style={{
                            background: idx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                          }}
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white/85 truncate" style={{ fontFamily: 'var(--font-body)' }}>
                              {g.full_name}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
                              Mesa {g.table ? String(g.table).padStart(2, '0') : '—'}
                              {isConfirmed && g.created_at ? ` · ${formatUploadDate(g.created_at)}` : ''}
                            </p>
                          </div>

                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                            style={{
                              background: isConfirmed ? 'rgba(34,197,94,0.12)' : 'rgba(251,191,36,0.12)',
                              border: isConfirmed ? '1px solid rgba(34,197,94,0.28)' : '1px solid rgba(251,191,36,0.3)',
                              color: isConfirmed ? '#4ade80' : '#fbbf24',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            {isConfirmed ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            {isConfirmed ? 'Confirmado' : 'Pendiente'}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </main>
  )
}
