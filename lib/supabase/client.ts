import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from './types'

function requiredEnv(value: string | undefined, name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
  if (!value) {
    throw new Error(`Falta ${name}. Agrega la variable en .env.local`)
  }
  return value
}

function normalizeSupabaseUrl(rawUrl: string) {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL no es una URL válida. Debe ser algo como https://xxxx.supabase.co (sin /rest/v1).'
    )
  }

  if (url.pathname && url.pathname !== '/' && url.pathname !== '') {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL debe ser la URL base del proyecto (ej: https://xxxx.supabase.co). No incluyas paths como "${url.pathname}".`
    )
  }

  // Ensure no trailing slash
  return url.origin
}

const supabaseUrl = normalizeSupabaseUrl(
  requiredEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL')
)
const supabaseAnonKey = requiredEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')

let client: SupabaseClient<Database> | null = null

export function getSupabaseClient(): SupabaseClient<Database> {
  if (client) return client
  client = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return client
}
