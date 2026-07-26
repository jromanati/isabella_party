import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/client'

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ albums: data || [] })
  } catch (error) {
    console.error('Error in GET /api/albums:', error)
    return NextResponse.json(
      { error: 'Error al cargar álbumes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, type } = body
    
    console.log('POST /api/albums - Request body:', { name, description, type })
    
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Nombre y tipo son requeridos' },
        { status: 400 }
      )
    }
    
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('albums')
      .insert({
        name,
        description: description || '',
        type,
        is_public: true,
        is_featured: false,
        sort_order: 0,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message || 'Error al crear álbum en Supabase' },
        { status: 500 }
      )
    }
    
    console.log('Album created successfully:', data)
    return NextResponse.json({ album: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/albums:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear álbum' },
      { status: 500 }
    )
  }
}
