// ─────────────────────────────────────────────────────────────
// Gallery Store — Mock state (ready for Supabase + Cloudinary)
// ─────────────────────────────────────────────────────────────

export type PhotoStatus = 'pending' | 'approved' | 'rejected'

export interface GalleryPhoto {
  id: string
  guestName: string
  url: string
  thumbnailUrl: string
  status: PhotoStatus
  uploadedAt: string // ISO string
}

// ── Mock photos ──────────────────────────────────────────────
// Replace with Supabase query: supabase.from('gallery_photos').select()
export const MOCK_PHOTOS: GalleryPhoto[] = [
  {
    id: '1',
    guestName: 'Sofía R.',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=70',
    status: 'approved',
    uploadedAt: '2025-07-11T21:03:00Z',
  },
  {
    id: '2',
    guestName: 'Valentina M.',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=70',
    status: 'approved',
    uploadedAt: '2025-07-11T21:18:00Z',
  },
  {
    id: '3',
    guestName: 'Camila F.',
    url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=70',
    status: 'approved',
    uploadedAt: '2025-07-11T21:35:00Z',
  },
  {
    id: '4',
    guestName: 'Daniela T.',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=70',
    status: 'approved',
    uploadedAt: '2025-07-11T21:52:00Z',
  },
  {
    id: '5',
    guestName: 'Luciana P.',
    url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=70',
    status: 'approved',
    uploadedAt: '2025-07-11T22:10:00Z',
  },
  {
    id: '6',
    guestName: 'Martina G.',
    url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=70',
    status: 'pending',
    uploadedAt: '2025-07-11T22:28:00Z',
  },
  {
    id: '7',
    guestName: 'Isabella H.',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=70',
    status: 'pending',
    uploadedAt: '2025-07-11T22:45:00Z',
  },
  {
    id: '8',
    guestName: 'Renata V.',
    url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=70',
    status: 'rejected',
    uploadedAt: '2025-07-11T23:01:00Z',
  },
]

// ── Mock gallery locked state ─────────────────────────────────
// Replace with Supabase realtime subscription:
// supabase.from('gallery_config').select('upload_enabled').single()
export const MOCK_GALLERY_CONFIG = {
  uploadEnabled: false, // Admin toggle controls this
  lastActivated: null as string | null, // ISO string
}

// ── Helpers ───────────────────────────────────────────────────
export function formatUploadTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatUploadDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}
