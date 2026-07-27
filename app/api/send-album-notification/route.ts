import { NextRequest, NextResponse } from 'next/server'
import { sendAlbumNotification } from '@/lib/notifications/sendInvitation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guestName, guestEmail } = body

    if (!guestEmail) {
      return NextResponse.json(
        { success: false, error: 'El invitado no tiene email' },
        { status: 400 }
      )
    }

    const result = await sendAlbumNotification({
      guestName,
      guestEmail,
    })

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
