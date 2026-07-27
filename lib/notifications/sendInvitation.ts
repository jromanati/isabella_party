import { getResendClient } from '@/lib/resend'

export type SendInvitationNotification = {
  guestName: string
  guestEmail: string
  tableNumber: number | null
  guestId: number
}

export type SendAlbumNotification = {
  guestName: string
  guestEmail: string
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
  const baseUrl = 'https://isabellaparty.cl'
  const confirmationUrl = `${baseUrl}/rsvp/${payload.guestId}`
  const detailsUrl = `${baseUrl}/`

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Invitación - Isabella XV</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#050308;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" background="${baseUrl}/isabella-hero-bg.jpg" style="background-size:cover;background-position:center;">
      <tr>
        <td align="center" style="padding:40px 20px;background-color:rgba(5,2,17,0.85);">
          
          <!-- Main Container -->
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#050308;border:1px solid rgba(168,85,247,0.25);border-radius:18px;overflow:hidden;">
            
            <!-- Header Image -->
            <tr>
              <td style="padding:0;">
                <img src="${baseUrl}/2.jpeg" alt="Isabella XV" width="600" style="display:block;width:100%;height:auto;border-radius:18px 18px 0 0;" />
              </td>
            </tr>

            <!-- Header Content -->
            <tr>
              <td style="padding:30px;text-align:center;background:linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.1) 50%, rgba(168,85,247,0.15) 100%);border-bottom:2px solid #a855f7;">
                <div style="letter-spacing:0.35em;text-transform:uppercase;font-size:12px;color:#c084fc;font-weight:700;margin-bottom:8px;">Isabella XV</div>
                <h1 style="margin:0;font-size:28px;line-height:1.2;color:#ffffff;font-weight:900;font-style:italic;">
                  ¡Estás invitado!
                </h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:30px;">
                <p style="margin:0 0 24px;color:rgba(255,255,255,0.7);font-size:16px;line-height:1.6;text-align:center;">
                  Hola ${escapeHtml(payload.guestName)}!! Nos encantaría que nos acompañes en esta celebración especial. 
                  Tu presencia hará este momento aún más memorable. Te mesa asignada es la ${escapeHtml(table)}
                </p>

                <!-- CTA Button -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding:20px 0;">
                      <a href="${confirmationUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg, #a855f7, #6366f1);color:#ffffff;text-decoration:none;border-radius:16px;font-weight:700;font-size:16px;">
                        ✨ Confirmar asistencia
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:20px 0;">
                      <a href="${detailsUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg, #a855f7, #6366f1);color:#ffffff;text-decoration:none;border-radius:16px;font-weight:700;font-size:16px;">
                        📅 Ver detalles de la fiesta
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin-top:24px;color:rgba(255,255,255,0.5);font-size:13px;text-align:center;line-height:1.5;">
                  Por favor confirma tu asistencia lo antes posible para que podamos prepararte todo con cariño.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0;color:rgba(255,255,255,0.3);font-size:12px;">
                  Te esperamos con mucho cariño 💜
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function renderAlbumEmailHtml(payload: SendAlbumNotification) {
  const baseUrl = 'https://isabellaparty.cl'
  const albumUrl = `${baseUrl}/album`

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Álbumes disponibles - Isabella XV</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#050308;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" background="${baseUrl}/fiesta.jpg" style="background-size:cover;background-position:center;">
      <tr>
        <td align="center" style="padding:40px 20px;background-color:rgba(5,2,17,0.85);">
          
          <!-- Main Container -->
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#050308;border:1px solid rgba(168,85,247,0.25);border-radius:18px;overflow:hidden;">
            
            <!-- Header Image -->
            <tr>
              <td style="padding:0;">
                <img src="${baseUrl}/2.jpeg" alt="Isabella XV" width="600" style="display:block;width:100%;height:auto;border-radius:18px 18px 0 0;" />
              </td>
            </tr>

            <!-- Header Content -->
            <tr>
              <td style="padding:30px;text-align:center;background:linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.1) 50%, rgba(168,85,247,0.15) 100%);border-bottom:2px solid #a855f7;">
                <div style="letter-spacing:0.35em;text-transform:uppercase;font-size:12px;color:#c084fc;font-weight:700;margin-bottom:8px;">Isabella XV</div>
                <h1 style="margin:0;font-size:28px;line-height:1.2;color:#ffffff;font-weight:900;font-style:italic;">
                  ¡Los momentos están aquí!
                </h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:30px;">
                <p style="margin:0 0 24px;color:rgba(255,255,255,0.7);font-size:16px;line-height:1.6;text-align:center;">
                  Hola ${escapeHtml(payload.guestName)}!! Ya están disponibles los álbumes de fotos de la fiesta. 
                  Puedes revivir todos esos momentos especiales que compartimos juntos.
                </p>

                <!-- CTA Button -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding:20px 0;">
                      <a href="${albumUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg, #a855f7, #6366f1);color:#ffffff;text-decoration:none;border-radius:16px;font-weight:700;font-size:16px;">
                        📸 Ver los álbumes
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin-top:24px;color:rgba(255,255,255,0.5);font-size:13px;text-align:center;line-height:1.5;">
                  Disfruta reviviendo esos momentos inolvidables 💜
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0;color:rgba(255,255,255,0.3);font-size:12px;">
                  Gracias por ser parte de este momento especial 💜
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
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

export async function sendAlbumNotification(payload: SendAlbumNotification): Promise<{ success: boolean; error?: string }> {
  if (!payload.guestEmail) {
    return { success: false, error: 'El invitado no tiene email' }
  }

  const resend = getResendClient()
  if (!resend) {
    return { success: false, error: 'Servicio de correo no disponible' }
  }

  const html = renderAlbumEmailHtml(payload)

  try {
    await resend.emails.send({
      from: 'Isabella XV <jose.roman@metrasolutions.com>',
      to: [payload.guestEmail],
      subject: `¡Los momentos están aquí! - Isabella XV`,
      html,
    })
    return { success: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.warn(`[sendAlbumNotification] Failed to send email: ${message}`)
    return { success: false, error: message }
  }
}
