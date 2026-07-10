'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { AuthService } from '@/services/auth.service'
import { EventService } from '@/services/event.service'

export default function GuestMenuPage() {
  const [eventProfile, setEventProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEventProfile = async () => {
      try {
        const token = await AuthService.getValidToken()
        if (!token) return

        const response = await EventService.getEventProfile()
        if (response.success && response.data) {
          setEventProfile(response.data)
        }
      } catch (err) {
        console.error('Error loading event profile:', err)
      } finally {
        setLoading(false)
      }
    }

    loadEventProfile()
  }, [])

  const menuItems = [
    {
      title: '📸 Subir una foto',
      description: 'Comparte tus fotos del evento',
      href: '/fotos',
      color: 'from-pink-500/20 to-purple-500/20',
      borderColor: 'border-pink-400/30',
      hoverColor: 'hover:bg-pink-500/10'
    },
    {
      title: '🎵 Sugerir una canción',
      description: 'Añade tu música favorita a la playlist',
      href: '/playlist',
      color: 'from-purple-500/20 to-blue-500/20',
      borderColor: 'border-purple-400/30',
      hoverColor: 'hover:bg-purple-500/10'
    },
    {
      title: '💬 Enviar un mensaje',
      description: 'Deja tus deseos para Isabella',
      href: '/mensajes',
      color: 'from-blue-500/20 to-green-500/20',
      borderColor: 'border-blue-400/30',
      hoverColor: 'hover:bg-blue-500/10'
    }
  ]

  if (loading) {
    return (
      <main className="min-h-screen" style={{ background: '#050308' }}>
        {/* Background ambience */}
        <div
          className="fixed inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236,72,153,0.15) 0%, transparent 70%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(96,165,250,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Loading state */}
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white/60">Cargando...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: '#050308' }}>
      {/* Background ambience */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236,72,153,0.15) 0%, transparent 70%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(96,165,250,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Navigation */}
      <nav
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 py-4"
        style={{
          background: 'rgba(5,3,8,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black italic text-white">Portal de Invitados</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="border-white/10 bg-white/5 hover:bg-white/10"
          >
            ← Inicio
          </Button>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-10 px-5">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {/* Header */}
          <header className="text-center">
            <p className="text-xs font-semibold tracking-[0.35em] uppercase neon-purple">Bienvenido</p>
            <h1
              className="mt-3 font-sans font-black italic leading-tight"
              style={{
                fontSize: 'clamp(2.2rem, 8vw, 3.4rem)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #c084fc 70%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 26px rgba(192,132,252,0.35))',
              }}
            >
              ¿Qué te gustaría hacer?
            </h1>
            <p className="mt-3 text-white/55" style={{ fontFamily: 'var(--font-body)' }}>
              Participa en la fiesta de Isabella compartiendo fotos, música y mensajes.
            </p>
          </header>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <Card
                  className={`border ${item.borderColor} bg-black/35 transition-all duration-300 ${item.hoverColor} cursor-pointer group`}
                  style={{
                    boxShadow: '0 0 30px rgba(192,132,252,0.10)',
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl`}>
                        {item.title.split(' ')[0]}
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-white/60 group-hover:text-white/70 transition-colors">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                          Click para continuar →
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>          
        </div>
      </div>
    </main>
  )
}
