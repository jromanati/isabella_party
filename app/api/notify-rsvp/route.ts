import { NextRequest, NextResponse } from 'next/server'
import { notifyRsvpConfirmed } from '@/lib/notifications/notifyRsvpConfirmed'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guestName, tableNumber, status, message } = body

    await notifyRsvpConfirmed({
      guestName,
      tableNumber,
      status,
      message,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
