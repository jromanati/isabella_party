import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/client'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string | string[]; contentId: string | string[] }> }
) {
  try {
    const resolvedParams = await params
    const supabase = getSupabaseClient()
    const id = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id
    const contentIdStr = Array.isArray(resolvedParams.contentId) ? resolvedParams.contentId[0] : resolvedParams.contentId
    const albumId = parseInt(id)
    const contentId = parseInt(contentIdStr)
    
    if (isNaN(albumId) || isNaN(contentId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    
    const { error } = await supabase
      .from('album_content')
      .update(body as any)
      .eq('id', contentId)
      .eq('album_id', albumId)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in PATCH /api/albums/[id]/content/[contentId]:', error)
    return NextResponse.json(
      { error: 'Error al actualizar contenido' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string | string[]; contentId: string | string[] }> }
) {
  try {
    const resolvedParams = await params
    const supabase = getSupabaseClient()
    const id = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id
    const contentIdStr = Array.isArray(resolvedParams.contentId) ? resolvedParams.contentId[0] : resolvedParams.contentId
    const albumId = parseInt(id)
    const contentId = parseInt(contentIdStr)
    
    if (isNaN(albumId) || isNaN(contentId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }
    
    // Primero obtener el contenido para obtener el cloudinary_public_id
    const { data: contentData, error: fetchError } = await supabase
      .from('album_content')
      .select('cloudinary_public_id, content_type')
      .eq('id', contentId)
      .eq('album_id', albumId)
      .single()
    
    if (fetchError) throw fetchError
    if (!contentData) {
      return NextResponse.json(
        { error: 'Contenido no encontrado' },
        { status: 404 }
      )
    }
    
    // Eliminar de Cloudinary solo si tiene cloudinary_public_id (no es URL externa)
    if ((contentData as any).cloudinary_public_id) {
      const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY
      const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET
      
      if (cloudinaryName && cloudinaryApiKey && cloudinaryApiSecret) {
        const resourceType = (contentData as any).content_type === 'video' ? 'video' : 'image'
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryName}/${resourceType}/destroy`
        
        try {
          const cloudinaryResponse = await fetch(cloudinaryUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              public_id: (contentData as any).cloudinary_public_id,
              api_key: cloudinaryApiKey,
              api_secret: cloudinaryApiSecret,
            }),
          })
          
          if (!cloudinaryResponse.ok) {
            const errorData = await cloudinaryResponse.json()
            console.error('Cloudinary delete error:', errorData)
            // Continuamos con la eliminación de la DB aunque falle Cloudinary
          }
        } catch (error) {
          console.error('Error deleting from Cloudinary:', error)
          // Continuamos con la eliminación de la DB aunque falle Cloudinary
        }
      } else {
        console.warn('Cloudinary credentials not configured, skipping Cloudinary deletion')
      }
    }
    
    // Eliminar de la base de datos
    const { error } = await supabase
      .from('album_content')
      .delete()
      .eq('id', contentId)
      .eq('album_id', albumId)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/albums/[id]/content/[contentId]:', error)
    return NextResponse.json(
      { error: 'Error al eliminar contenido' },
      { status: 500 }
    )
  }
}
