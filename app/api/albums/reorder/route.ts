import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { albums } = body
    
    if (!albums || !Array.isArray(albums)) {
      return NextResponse.json(
        { error: 'Formato inválido' },
        { status: 400 }
      )
    }
    
    const supabase = getSupabaseClient()
    
    // Actualizar sort_order para cada álbum
    for (const album of albums) {
      // @ts-ignore - Supabase client typing issue
      const { error } = await supabase
        .from('albums')
        .update({ sort_order: album.sort_order })
        .eq('id', album.id)
      
      if (error) {
        console.error('Error updating album sort_order:', error)
        throw error
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in POST /api/albums/reorder:', error)
    return NextResponse.json(
      { error: 'Error al reordenar álbumes' },
      { status: 500 }
    )
  }
}
