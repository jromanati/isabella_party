'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SmartNotificationToast } from '@/components/ui/SmartNotificationToast'
import { NotificationBell } from '@/components/ui/NotificationBell'
import { usePollingUpdates } from '@/hooks/usePollingUpdates'
import { useAutoMarkAsReviewed } from '@/hooks/useAutoMarkAsReviewed'
import { PollingService } from '@/services/polling.service'

export default function AdminPage() {
  const { 
    isPolling, 
    hasAnyNew, 
    lastCheck,
    forceCheck,
    getDebugInfo,
    hasNewPhotos,
    hasNewMessages,
    hasNewSongs,
    photosUpdate,
    messagesUpdate,
    songsUpdate,
    getNewCount,
    markAsReviewed,
    markAllAsReviewed
  } = usePollingUpdates(true, 30000) // Iniciar con 30 segundos

  // Auto-marcar como revisado cuando se entra a secciones
  useAutoMarkAsReviewed()

  // Obtener instancia del PollingService para debugging
  const pollingService = PollingService.getInstance()

  // Debug: Log estado del polling
  useEffect(() => {
    if (isPolling) {
      console.log('🔄 Polling activo en página admin')
    }
  }, [isPolling])

  // Debug: Obtener información de depuración
  const handleDebug = async () => {
    const debugInfo = await getDebugInfo()
    console.log('🐛 Debug info:', debugInfo)
  }
  return (
    <main className="min-h-screen px-5 py-10" style={{ background: '#050308' }}>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(168,85,247,0.16) 0%, transparent 70%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(236,72,153,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto flex flex-col gap-8">
        <header className="text-center">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-white/40">Administración</p>
          <h1
            className="mt-3 font-sans font-black italic leading-tight"
            style={{
              fontSize: 'clamp(2.2rem, 8vw, 3.4rem)',
              backgroundImage:
                'linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #c084fc 70%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 26px rgba(192,132,252,0.35))',
            }}
          >
            Control del evento
          </h1>
          <p className="mt-3 text-white/55" style={{ fontFamily: 'var(--font-body)' }}>
            Accesos rápidos para el DJ / encargado.
          </p>
        </header>

        {/* Sistema de notificaciones inteligente */}
        <SmartNotificationToast />
        
        {/* Campana de notificaciones persistente */}
        <NotificationBell 
          hasAnyNew={hasAnyNew}
          hasNewPhotos={hasNewPhotos}
          hasNewMessages={hasNewMessages}
          hasNewSongs={hasNewSongs}
          photosUpdate={photosUpdate}
          messagesUpdate={messagesUpdate}
          songsUpdate={songsUpdate}
          getNewCount={getNewCount}
          markAsReviewed={markAsReviewed}
          markAllAsReviewed={markAllAsReviewed}
        />

        {/* Indicador de estado del sistema */}
        <div className="flex items-center justify-between text-xs text-white/40">
          <div className="flex items-center gap-4">
            <span className={`flex items-center gap-1 ${isPolling ? 'text-green-400/60' : 'text-red-400/60'}`}>
              <div className={`w-2 h-2 rounded-full ${isPolling ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              Sistema {isPolling ? 'activo' : 'inactivo'}
            </span>
            {lastCheck && (
              <span>
                Última verificación: {new Date(lastCheck).toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={forceCheck}
              className="text-white/40 hover:text-white/60 transition-colors"
              title="Forzar verificación"
            >
              🔄 Verificar ahora
            </button>
            
            <button
              onClick={handleDebug}
              className="text-white/40 hover:text-white/60 transition-colors"
              title="Debug info (consola)"
            >
              🐛 Debug
            </button>
            
            <button
              onClick={() => pollingService.forceNotification('messages')}
              className="text-white/40 hover:text-white/60 transition-colors"
              title="Forzar notificación de mensaje"
            >
              💬 Forzar msg
            </button>
            
            <button
              onClick={() => console.log('Estado completo:', pollingService.getDebugState())}
              className="text-white/40 hover:text-white/60 transition-colors"
              title="Ver estado completo (consola)"
            >
              📊 Estado
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card className="border-white/10 bg-black/35">
            <CardHeader>
              <CardTitle className="text-white/90">Slideshow</CardTitle>
              <CardDescription className="text-white/55">Mostrar fotos recientes en pantalla.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-purple-500/15 hover:bg-purple-500/20 text-white border border-purple-400/25"
              >
                <Link href="/slideshow">Abrir /slideshow</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/35">
            <CardHeader>
              <CardTitle className="text-white/90">Panel DJ</CardTitle>
              <CardDescription className="text-white/55">Ver y administrar canciones sugeridas.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-pink-500/15 hover:bg-pink-500/20 text-white border border-pink-400/25"
              >
                <Link href="/dj">Abrir /dj</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/35">
            <CardHeader>
              <CardTitle className="text-white/90">Now Playing</CardTitle>
              <CardDescription className="text-white/55">Pantalla fullscreen de la canción actual + QR.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-blue-500/15 hover:bg-blue-500/20 text-white border border-blue-400/25"
              >
                <Link href="/now-playing">Abrir /now-playing</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/35">
            <CardHeader>
              <CardTitle className="text-white/90">Slideshow de Mensajes</CardTitle>
              <CardDescription className="text-white/55">Mostrar mensajes de invitados en pantalla.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-green-500/15 hover:bg-green-500/20 text-white border border-green-400/25"
              >
                <Link href="/messages-slideshow">Abrir /messages-slideshow</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-white/25 text-center" style={{ fontFamily: 'var(--font-body)' }}>
          Tip: puedes guardar esta página como favorito en el iPad del DJ.
        </p>
      </div>
    </main>
  )
}
