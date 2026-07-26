import { getResendClient } from '@/lib/resend'

export type SendInvitationNotification = {
  guestName: string
  guestEmail: string
  tableNumber: number | null
  guestId: number
}

function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderEmailHtml(payload: SendInvitationNotification) {
  const table = payload.tableNumber != null ? String(payload.tableNumber).padStart(2, '0') : 'Por asignar'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const confirmationUrl = `${baseUrl}/rsvp/${payload.guestId}`

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Invitación - Isabella XV</title>
  </head>
  <body style="margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
    <div style="max-width:640px;margin:0 auto;padding:28px;">
      <div style="border:1px solid rgba(168,85,247,0.25);background:#050308;border-radius:18px;overflow:hidden;">
        <div style="height:2px;background:linear-gradient(90deg, transparent, #ec4899, #a855f7, transparent);"></div>
        <div style="padding:22px;">
          <div style="letter-spacing:0.25em;text-transform:uppercase;font-size:11px;color:rgba(192,132,252,0.85);font-weight:700;">Isabella XV</div>
          <h1 style="margin:10px 0 0;font-size:22px;line-height:1.25;color:#ffffff;font-weight:900;font-style:italic;">¡Estás invitado!</h1>
          <p style="margin:10px 0 0;color:rgba(255,255,255,0.65);font-size:14px;">Nos encantaría que nos acompañes en esta celebración especial.</p>

          <div style="margin-top:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px;">
            <div style="color:rgba(255,255,255,0.5);font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Invitado</div>
            <div style="margin-top:6px;color:#ffffff;font-size:16px;font-weight:700;">${escapeHtml(payload.guestName)}</div>
          </div>

          <div style="margin-top:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px;">
            <div style="color:rgba(255,255,255,0.5);font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Mesa</div>
            <div style="margin-top:6px;color:#ffffff;font-size:16px;font-weight:700;">${escapeHtml(table)}</div>
          </div>

          <div style="margin-top:20px;text-align:center;">
            <a href="${confirmationUrl}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg, #a855f7, #6366f1);color:#ffffff;text-decoration:none;border-radius:12px;font-weight:700;font-size:14px;">
              Confirmar asistencia
            </a>
          </div>

          <p style="margin-top:20px;color:rgba(255,255,255,0.45);font-size:12px;text-align:center;">
            Por favor confirma tu asistencia lo antes posible.
          </p>

        </div>
      </div>
    </div>
  </body>
</html>`
}

export async function sendInvitation(payload: SendInvitationNotification): Promise<{ success: boolean; error?: string }> {
  if (!payload.guestEmail) {
    return { success: false, error: 'El invitado no tiene email' }
  }

  const resend = getResendClient()
  if (!resend) {
    return { success: false, error: 'Servicio de correo no disponible' }
  }

  const html = renderEmailHtml(payload)

  try {
    await resend.emails.send({
      from: 'Isabella XV <jose.roman@metrasolutions.com>',
      to: [payload.guestEmail],
      subject: `¡Estás invitado! - Isabella XV`,
      html,
    })
    return { success: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.warn(`[sendInvitation] Failed to send email: ${message}`)
    return { success: false, error: message }
  }
}
