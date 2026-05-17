import { getSupabaseClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default async function TestSupabasePage() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from('photos').select('id').limit(1)

    if (error) {
      return (
        <main style={{ padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Error conectando a Supabase</h1>
          <pre style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(error, null, 2)}</pre>
        </main>
      )
    }

    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Supabase conectado</h1>
        <p style={{ marginTop: 12, opacity: 0.8 }}>Select de prueba a la tabla photos (limit 1).</p>
        <pre style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
      </main>
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)

    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Error de configuración</h1>
        <p style={{ marginTop: 12, opacity: 0.8 }}>
          No se pudo inicializar el cliente de Supabase. Revisa tus variables de entorno.
        </p>
        <pre style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{message}</pre>
      </main>
    )
  }
}
