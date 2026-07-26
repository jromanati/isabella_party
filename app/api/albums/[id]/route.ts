import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/client'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string | string[] }> }
) {
  try {
    const resolvedParams = await params
    console.log('GET /api/albums/[id] - params.id:', resolvedParams.id)
    const supabase = getSupabaseClient()
    const id = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id
    console.log('GET /api/albums/[id] - id after processing:', id)
    const albumId = parseInt(id)
    console.log('GET /api/albums/[id] - albumId:', albumId)
    
    if (isNaN(albumId)) {
      return NextResponse.json(
        { error: 'ID de álbum inválido' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('id', albumId)
      .single()
    
    if (error) throw error
    
    if (!data) {
      return NextResponse.json(
        { error: 'Álbum no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ album: data })
  } catch (error) {
    console.error('Error in GET /api/albums/[id]:', error)
    return NextResponse.json(
      { error: 'Error al cargar álbum' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string | string[] }> }
) {
  try {
    const resolvedParams = await params
    const supabase = getSupabaseClient()
    const id = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id
    const albumId = parseInt(id)
    const body = await request.json()
    const { name, description, type } = body
    
    if (isNaN(albumId)) {
      return NextResponse.json(
        { error: 'ID de álbum inválido' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('albums')
      .update({
        name,
        description,
        type,
        updated_at: new Date().toISOString(),
      })
      .eq('id', albumId)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ album: data })
  } catch (error) {
    console.error('Error in PUT /api/albums/[id]:', error)
    return NextResponse.json(
      { error: 'Error al actualizar álbum' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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
    
    // Primero eliminar el contenido del álbum
    const { error: contentError } = await supabase
      .from('album_content')
      .delete()
      .eq('album_id', albumId)
    
    if (contentError) {
      console.error('Error deleting album content:', contentError)
    }
    
    // Luego eliminar el álbum
    const { error: albumError } = await supabase
      .from('albums')
      .delete()
      .eq('id', albumId)
    
    if (albumError) throw albumError
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/albums/[id]:', error)
    return NextResponse.json(
      { error: 'Error al eliminar álbum' },
      { status: 500 }
    )
  }
}
