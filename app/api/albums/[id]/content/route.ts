import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/client'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string | string[] }> }
) {
  try {
    const resolvedParams = await params
    const supabase = getSupabaseClient()
    const id = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id
    const albumId = parseInt(id)
    
    if (isNaN(albumId)) {
      return NextResponse.json(
        { error: 'ID de álbum inválido' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('album_content')
      .select('*')
      .eq('album_id', albumId)
      .eq('status', 'active')
      .order('sort_order', { ascending: true })
      .order('uploaded_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ content: data || [] })
  } catch (error) {
    console.error('Error in GET /api/albums/[id]/content:', error)
    return NextResponse.json(
      { error: 'Error al cargar contenido' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string | string[] }> }
) {
  try {
    const resolvedParams = await params
    const supabase = getSupabaseClient()
    const id = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id
    const albumId = parseInt(id)
    const body = await request.json()
    const { 
      cloudinary_public_id, 
      cloudinary_secure_url, 
      thumbnail_url,
      caption,
      description,
      content_type,
      duration,
      file_size,
      width,
      height,
      format,
      is_cover
    } = body
    
    console.log('POST /api/albums/[id]/content - albumId:', albumId)
    console.log('POST /api/albums/[id]/content - body:', body)
    
    if (isNaN(albumId)) {
      return NextResponse.json(
        { error: 'ID de álbum inválido' },
        { status: 400 }
      )
    }
    
    // Validar: o bien es de Cloudinary (tiene public_id) o bien es URL externa (solo tiene secure_url)
    if (!cloudinary_secure_url) {
      return NextResponse.json(
        { error: 'URL del contenido es requerida' },
        { status: 400 }
      )
    }
    
    // Si cloudinary_public_id es null, es una URL externa (Google Drive, etc.)
    // Si cloudinary_public_id está presente, es de Cloudinary
    if (!cloudinary_public_id && !cloudinary_secure_url.startsWith('http')) {
      return NextResponse.json(
        { error: 'URL externa inválida' },
        { status: 400 }
      )
    }
    
    // Obtener el sort_order máximo actual para asignar el siguiente
    const { data: existingContent } = await supabase
      .from('album_content')
      .select('sort_order')
      .eq('album_id', albumId)
      .order('sort_order', { ascending: false })
      .limit(1)
    
    const nextSortOrder = existingContent && existingContent.length > 0 
      ? ((existingContent[0] as any).sort_order || 0) + 1 
      : 0
    
    const insertData = {
      album_id: albumId,
      cloudinary_public_id,
      cloudinary_secure_url,
      thumbnail_url: thumbnail_url || cloudinary_secure_url,
      caption: caption || '',
      description: description || '',
      content_type: content_type || 'image',
      duration: duration || null,
      file_size: file_size || null,
      width: width || null,
      height: height || null,
      format: format || null,
      sort_order: nextSortOrder,
      is_cover: is_cover || false,
      metadata: {},
      status: 'active',
    }
    
    console.log('POST /api/albums/[id]/content - insertData:', insertData)
    
    const { data, error } = await supabase
      .from('album_content')
      .insert(insertData as any)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('POST /api/albums/[id]/content - success:', data)
    
    return NextResponse.json({ content: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/albums/[id]/content:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al subir contenido' },
      { status: 500 }
    )
  }
}
