import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { PollingService } from '@/services/polling.service'

/**
 * Hook que detecta automáticamente cuando el usuario entra a una sección de administración
 * y marca las notificaciones correspondientes como revisadas
 */
export function useAutoMarkAsReviewed() {
  const pathname = usePathname()

  useEffect(() => {
    const pollingService = PollingService.getInstance()

    // Mapeo de rutas a tipos de contenido
    const routeToContentType: Record<string, 'photos' | 'messages' | 'songs'> = {
      '/slideshow': 'photos',
      '/messages-slideshow': 'messages',
      '/dj': 'songs',
      '/now-playing': 'songs', // También marca canciones como revisadas
    }

    // Verificar si la ruta actual coincide con alguna sección de administración
    const contentType = routeToContentType[pathname]
    
    if (contentType) {
      // Marcar como revisado cuando el usuario entra a la sección
      setTimeout(() => {
        pollingService.markAsReviewed(contentType)
        console.log(`🔔 Auto-marked ${contentType} as reviewed when entering ${pathname}`)
      }, 500) // Pequeño delay para asegurar que la página se ha cargado
    }
  }, [pathname])
}
