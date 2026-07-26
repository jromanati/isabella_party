import { getResendClient } from '@/lib/resend'
import { parseAdminEmails } from '@/lib/notifications/notifyPendingPhoto'

export type RsvpConfirmedNotification = {
  guestName: string
  tableNumber: number | null
  status: 'confirmed' | 'declined'
  message?: string | null
}

function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderEmailHtml(payload: RsvpConfirmedNotification) {
  const table = payload.tableNumber != null ? String(payload.tableNumber).padStart(2, '0') : '—'
  const isConfirmed = payload.status === 'confirmed'
  const title = isConfirmed ? 'Asistencia confirmada' : 'Asistencia rechazada'
  const subtitle = isConfirmed 
    ? 'Un invitado acaba de confirmar su asistencia.' 
    : 'Un invitado ha rechazado la invitación.'
  const statusColor = isConfirmed ? '#4ade80' : '#fbbf24'
  const statusBg = isConfirmed ? 'rgba(34,197,94,0.12)' : 'rgba(251,191,36,0.12)'
  const statusBorder = isConfirmed ? 'rgba(34,197,94,0.28)' : 'rgba(251,191,36,0.3)'

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>RSVP ${isConfirmed ? 'Confirmado' : 'Rechazado'}</title>
  </head>
  <body style="margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
    <div style="max-width:640px;margin:0 auto;padding:28px;">
      <div style="border:1px solid rgba(168,85,247,0.25);background:#050308;border-radius:18px;overflow:hidden;">
        <div style="height:2px;background:linear-gradient(90deg, transparent, #ec4899, #a855f7, transparent);"></div>
        <div style="padding:22px;">
          <div style="letter-spacing:0.25em;text-transform:uppercase;font-size:11px;color:rgba(192,132,252,0.85);font-weight:700;">Isabella XV</div>
          <h1 style="margin:10px 0 0;font-size:22px;line-height:1.25;color:#ffffff;font-weight:900;font-style:italic;">${escapeHtml(title)}</h1>
          <p style="margin:10px 0 0;color:rgba(255,255,255,0.65);font-size:14px;">${escapeHtml(subtitle)}</p>

          <div style="margin-top:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px;">
            <div style="color:rgba(255,255,255,0.5);font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Invitado</div>
            <div style="margin-top:6px;color:#ffffff;font-size:16px;font-weight:700;">${escapeHtml(payload.guestName)}</div>
          </div>

          <div style="margin-top:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px;">
            <div style="color:rgba(255,255,255,0.5);font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Mesa</div>
            <div style="margin-top:6px;color:#ffffff;font-size:16px;font-weight:700;">${escapeHtml(table)}</div>
          </div>

          <div style="margin-top:12px;background:${statusBg};border:1px solid ${statusBorder};border-radius:14px;padding:14px;">
            <div style="color:rgba(255,255,255,0.5);font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Estado</div>
            <div style="margin-top:6px;color:${statusColor};font-size:16px;font-weight:700;">${isConfirmed ? 'Confirmado' : 'Rechazado'}</div>
          </div>

          ${payload.message ? `
          <div style="margin-top:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px;">
            <div style="color:rgba(255,255,255,0.5);font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Mensaje</div>
            <div style="margin-top:6px;color:rgba(255,255,255,0.8);font-size:14px;line-height:1.5;">${escapeHtml(payload.message)}</div>
          </div>
          ` : ''}

        </div>
      </div>
    </div>
  </body>
</html>`
}

let warnedMissingRecipients = false

export async function notifyRsvpConfirmed(payload: RsvpConfirmedNotification): Promise<void> {
  const recipients = parseAdminEmails(process.env.ADMIN_EMAILS)
  if (recipients.length === 0) {
    if (!warnedMissingRecipients) {
      warnedMissingRecipients = true
      // eslint-disable-next-line no-console
      console.warn('[notifyRsvpConfirmed] ADMIN_EMAILS is empty/invalid. Skipping notification.')
    }
    return
  }

  const resend = getResendClient()
  if (!resend) return

  const html = renderEmailHtml(payload)
  const isConfirmed = payload.status === 'confirmed'

  try {
    await resend.emails.send({
      from: 'Isabella XV <jose.roman@metrasolutions.com>',
      to: recipients,
      subject: `${isConfirmed ? 'Confirmado' : 'Rechazado'} - ${payload.guestName}`,
      html,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    // eslint-disable-next-line no-console
    console.warn(`[notifyRsvpConfirmed] Failed to send email: ${message}`)
  }
}
