import { NextResponse } from 'next/server'
import { notifyRsvpConfirmed } from '@/lib/notifications/notifyRsvpConfirmed'

type Body = {
  guestName?: unknown
  tableNumber?: unknown
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body
    const guestName = typeof body.guestName === 'string' ? body.guestName.trim() : ''

    const tableNumber =
      typeof body.tableNumber === 'number' && Number.isFinite(body.tableNumber)
        ? body.tableNumber
        : body.tableNumber == null
          ? null
          : null

    if (!guestName) {
      return NextResponse.json({ error: 'guestName is required' }, { status: 400 })
    }

    await notifyRsvpConfirmed({ guestName, tableNumber })

    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
