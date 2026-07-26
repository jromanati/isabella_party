import { NextResponse } from 'next/server'
import { GalleryAdapter } from '@/services/gallery-adapter.service'

export async function GET() {
  try {
    const response = await GalleryAdapter.getPhotos()
    
    if (!response.success || !response.data) {
      return NextResponse.json(
        { error: response.error || 'Error al cargar fotos' },
        { status: 500 }
      )
    }

    // Filtrar solo fotos aprobadas y transformar datos
    const photos = response.data
      .filter((photo: any) => photo.status === 'approved')
      .map((photo: any) => ({
        id: photo.id,
        url: photo.cloudinary_secure_url,
        thumbnailUrl: photo.thumbnail_url,
        guestName: photo.uploaded_by_name || 'Invitado',
        uploadedAt: photo.uploaded_at,
      }))

    return NextResponse.json({ photos })
  } catch (error) {
    console.error('Error in /api/gallery/approved:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
