import { Resend } from 'resend'

let client: Resend | null = null
let warnedMissingKey = false

export function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    if (!warnedMissingKey) {
      warnedMissingKey = true
      // eslint-disable-next-line no-console
      console.warn('[resend] Missing RESEND_API_KEY. Emails will not be sent.')
    }
    return null
  }

  if (client) return client
  client = new Resend(key)
  return client
}
