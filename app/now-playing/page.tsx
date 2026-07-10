'use client'

import { useEffect, useMemo, useState } from 'react'

import type { SongRequest } from '@/types/song-request'
import { SongRequestAdapter } from '@/services/song-request-adapter.service'
import { AuthService } from '@/services/auth.service'

function Visualizer() {
  const bars = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])

  return (
    <div className="mt-10 flex items-end justify-center gap-2">
      {bars.map((i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 10,
            height: 16 + ((i * 17) % 44),
            background: 'linear-gradient(180deg, rgba(236,72,153,0.95), rgba(168,85,247,0.95), rgba(96,165,250,0.95))',
            boxShadow: '0 0 18px rgba(192,132,252,0.25)',
            transformOrigin: 'bottom',
            willChange: 'transform, filter, opacity',
            animation: `npBar ${650 + (i % 6) * 140}ms ease-in-out ${i * 45}ms infinite alternate`,
            opacity: 0.9,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes npBar {
          from { transform: scaleY(0.15); opacity: 0.55; filter: blur(0px); }
          to { transform: scaleY(1.75); opacity: 0.95; filter: blur(0.25px); }
        }
      `}</style>
    </div>
  )
}

export default function NowPlayingPage() {
  const [nowPlaying, setNowPlaying] = useState<SongRequest | null>(null)

  async function refresh() {
    try {
      // Usar Supabase directamente - no requiere autenticación
      // Obtener canción actual
      const response = await SongRequestAdapter.getNowPlaying()
      
      if (response.success) {
        setNowPlaying(response.data || null)
      }
    } catch (error) {
      // Silencioso para pantalla de proyección
      console.error('Error fetching now playing:', error)
    }
  }

  useEffect(() => {
    void refresh()
    const id = window.setInterval(() => {
      void refresh()
    }, 5_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <main className="min-h-screen w-full overflow-hidden" style={{ background: '#050308' }}>
      <div
        className="fixed right-6 bottom-6 z-50 rounded-2xl border border-white/10 overflow-hidden"
        style={{
          width: 160,
          height: 160,
          background: 'rgba(0,0,0,0.35)',
          boxShadow: '0 0 50px rgba(192,132,252,0.14)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/isabella_playlist_qr.png"
          alt="QR para pedir canciones"
          className="h-full w-full object-cover"
          style={{ filter: 'drop-shadow(0 0 18px rgba(236,72,153,0.18))' }}
        />
      </div>

      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(236,72,153,0.20) 0%, transparent 70%), radial-gradient(ellipse 60% 45% at 30% 75%, rgba(168,85,247,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 45% at 70% 80%, rgba(96,165,250,0.14) 0%, transparent 70%)',
        }}
      />

      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            'linear-gradient(0deg, rgba(255,255,255,0.03), transparent 40%, rgba(255,255,255,0.02)), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)',
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
        }}
      />

      <div className="relative min-h-screen flex items-center justify-center px-10 py-10">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="flex items-center justify-center">
            <div
              className="relative rounded-3xl border border-white/10 overflow-hidden"
              style={{
                width: 'min(52vh, 520px)',
                aspectRatio: '1 / 1',
                background: 'rgba(0,0,0,0.35)',
                boxShadow: '0 0 70px rgba(192,132,252,0.20)',
              }}
            >
              <div
                className="absolute -inset-10 animate-rotate-slow"
                style={{
                  background:
                    'conic-gradient(from 180deg, rgba(236,72,153,0.20), rgba(168,85,247,0.20), rgba(96,165,250,0.18), rgba(236,72,153,0.20))',
                  filter: 'blur(28px)',
                }}
              />

              <div className="absolute inset-0 p-6 flex items-center justify-center">
                {nowPlaying?.album_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={nowPlaying.album_image_url}
                    alt=""
                    className="h-full w-full object-cover rounded-2xl"
                    style={{ boxShadow: '0 0 60px rgba(236,72,153,0.18)' }}
                  />
                ) : (
                  <div className="h-full w-full rounded-2xl border border-white/10" />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold tracking-[0.35em] uppercase neon-pink">Now playing</p>

            {nowPlaying ? (
              <>
                <h1
                  className="font-sans font-black italic leading-tight"
                  style={{
                    fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                    backgroundImage:
                      'linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #c084fc 70%, #818cf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 30px rgba(192,132,252,0.5))',
                  }}
                >
                  {nowPlaying?.song_title || nowPlaying?.raw_song}
                </h1>

                <p className="text-xl text-white/70" style={{ fontFamily: 'var(--font-body)' }}>
                  {nowPlaying?.artist_name || '—'}
                </p>

                <p className="text-sm text-white/45" style={{ fontFamily: 'var(--font-body)' }}>
                  Sugerida por: <span className="text-white/65">{nowPlaying?.guest_name || 'Anónimo'}</span>
                </p>

                <Visualizer />
              </>
            ) : (
              <>
                <h1
                  className="font-sans font-black italic leading-tight"
                  style={{
                    fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                    backgroundImage:
                      'linear-gradient(135deg, #ffffff 0%, #c084fc 60%, #60a5fa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 30px rgba(96,165,250,0.35))',
                  }}
                >
                  Esperando la próxima canción
                </h1>
                <p className="text-lg text-white/60" style={{ fontFamily: 'var(--font-body)' }}>
                  Pide tu canción escaneando el QR
                </p>

                <Visualizer />
              </>
            )}

          </div>
        </div>
      </div>
    </main>
  )
}
