'use client'

import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

import type { ITunesSongResult } from '@/lib/playlist-types'
import type { SongRequest, SongRequestCreate, PublicSongRequest } from '@/types/song-request'
import { SongRequestAdapter } from '@/services/song-request-adapter.service'
import { AuthService } from '@/services/auth.service'
import type { Guest } from '@/types/guest'
import GuestSelector from '@/components/guest-selector'

export default function PlaylistPage() {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [rawSong, setRawSong] = useState('')

  const [searchLoading, setSearchLoading] = useState(false)
  const [results, setResults] = useState<ITunesSongResult[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)

  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const [songRequests, setSongRequests] = useState<PublicSongRequest[]>([])
  const [nowPlaying, setNowPlaying] = useState<SongRequest | null>(null)

  async function refreshList() {
    try {
      // Autenticación para obtener datos completos
      const token = await AuthService.getValidToken()
      if (!token) return

      // Obtener playlist pública
      const playlistResponse = await SongRequestAdapter.getPublicPlaylist()
      if (playlistResponse.success && playlistResponse.data) {
        setSongRequests(playlistResponse.data)
      }

      // Obtener ahora sonando
      const nowPlayingResponse = await SongRequestAdapter.getNowPlaying()
      if (nowPlayingResponse.success) {
        setNowPlaying(nowPlayingResponse.data || null)
      }
    } catch (error) {
      console.error('Error refreshing playlist:', error)
    }
  }

  useEffect(() => {
    void refreshList()
    const id = window.setInterval(() => {
      void refreshList()
    }, 10_000)
    return () => window.clearInterval(id)
  }, [])

  const playing = useMemo(() => songRequests.filter((s) => s.status === 'playing'), [songRequests])
  const pending = useMemo(() => songRequests.filter((s) => s.status === 'pending'), [songRequests])
  const played = useMemo(() => songRequests.filter((s) => s.status === 'played'), [songRequests])

  async function onSearch() {
    setSearchError(null)
    setSubmitMessage(null)

    const query = rawSong.trim()
    if (!query) {
      setSearchError('Escribe una canción o artista para buscar.')
      return
    }

    setSearchLoading(true)
    try {
      const res = await fetch('/api/song-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      const data: unknown = await res.json().catch(() => null)
      if (!res.ok || !data || typeof data !== 'object') {
        setResults([])
        setSearchError('No se pudo buscar en este momento. Intenta de nuevo.')
        return
      }

      const obj = data as { results: ITunesSongResult[] }
      setResults(Array.isArray(obj.results) ? obj.results : [])

      if (!Array.isArray(obj.results) || obj.results.length === 0) {
        setSearchError('No encontramos resultados. Intenta con otro nombre o artista.')
      }
    } finally {
      setSearchLoading(false)
    }
  }

  async function submitSong(selectedTrack: ITunesSongResult | null) {
    setSearchError(null)
    setSubmitMessage(null)

    if (!selectedGuest) {
      setSearchError('Selecciona tu nombre de la lista.')
      return
    }

    const raw = rawSong.trim()
    if (!raw) {
      setSearchError('Escribe una canción o artista.')
      return
    }

    if (!selectedTrack) {
      setSearchError('Primero busca y selecciona una canción de los resultados.')
      return
    }

    setSubmitLoading(true)
    try {
      // Autenticación
      const token = await AuthService.getValidToken()
      if (!token) throw new Error('No se pudo autenticar')

      // Mapear iTunes → SongRequestCreate
      const songRequest: SongRequestCreate = {
        guest: selectedGuest.id,
        guest_name: selectedGuest.full_name,
        raw_song: raw,
        song_title: selectedTrack.title,
        artist_name: selectedTrack.artist,
        album_name: '',
        album_image_url: selectedTrack.albumImageUrl || '',
        preview_url: selectedTrack.previewUrl || '',
        external_url: '',
        provider: 'manual' as const,
        provider_track_id: '',
        source: 'guest' as const,
        notes: ''
      }

      const response = await SongRequestAdapter.createSongRequest(songRequest)
      
      if (response.success) {
        setSubmitMessage('Tu canción fue sugerida al DJ.')
        setResults([])
        setSelectedGuest(null)
        setRawSong('')
        await refreshList()
      } else {
        setSearchError(response.error || 'No se pudo enviar tu sugerencia.')
      }
    } catch (error) {
      setSearchError('Error al enviar la sugerencia.')
    } finally {
      setSubmitLoading(false)
    }
  }

  function SongCard({ song }: { song: PublicSongRequest | SongRequest }) {
    return (
      <Card
        className="border-white/10 bg-black/30"
        style={{ boxShadow: '0 0 30px rgba(192,132,252,0.10)' }}
      >
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div
              className="h-14 w-14 rounded-lg overflow-hidden shrink-0 border border-white/10"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              {song.album_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={song.album_image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-white/90 truncate">
                  {song.song_title ?? song.raw_song}
                </p>
                {song.status === 'playing' && (
                  <Badge className="bg-pink-500/20 text-pink-200 border-pink-400/30">SONANDO</Badge>
                )}
                {song.status === 'pending' && (
                  <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">PENDIENTE</Badge>
                )}
                {song.status === 'played' && (
                  <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30">YA SONÓ</Badge>
                )}
              </div>
              <p className="text-sm text-white/60 truncate">
                {song.artist_name ?? '—'}
              </p>
              <p className="text-xs text-white/40 mt-1">
                Sugerida por: <span className="text-white/60">{song.guest_name}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <main className="min-h-screen px-5 py-10" style={{ background: '#050308' }}>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236,72,153,0.18) 0%, transparent 70%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(96,165,250,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto flex flex-col gap-8">
        <header className="text-center">
                    <p className="text-xs font-semibold tracking-[0.35em] uppercase neon-purple">Playlist colaborativa</p>
          <h1
            className="mt-3 font-sans font-black italic leading-tight"
            style={{
              fontSize: 'clamp(2.2rem, 8vw, 3.4rem)',
              background:
                'linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #c084fc 70%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 26px rgba(192,132,252,0.35))',
            }}
          >
            Isabella XV
          </h1>
          <p className="mt-3 text-white/55" style={{ fontFamily: 'var(--font-body)' }}>
            Sugiere una canción para que el DJ la ponga durante la fiesta.
          </p>
        </header>

        <Card className="border-white/10 bg-black/35">
          <CardHeader>
            <CardTitle className="text-white/90">Sugerir canción</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <p className="text-xs text-white/60">Tu nombre</p>
                <GuestSelector
                  value={selectedGuest?.id?.toString() || ''}
                  onChange={setSelectedGuest}
                  disabled={submitLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-white/60">Canción / Artista</p>
                <Input
                  value={rawSong}
                  onChange={(e) => setRawSong(e.target.value)}
                  placeholder="Ej: Bad Bunny Tití"
                />
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => void onSearch()}
                disabled={searchLoading}
                className="bg-purple-500/15 hover:bg-purple-500/20 text-white border border-purple-400/25"
              >
                {searchLoading ? 'Buscando…' : 'Buscar canción'}
              </Button>
            </div>

            {searchError && (
              <p className="text-sm" style={{ color: 'rgba(248,113,113,0.95)' }}>
                {searchError}
              </p>
            )}

            {submitMessage && (
              <p className="text-sm" style={{ color: 'rgba(167,243,208,0.95)' }}>
                {submitMessage}
              </p>
            )}

            {results.length > 0 && (
              <div className="mt-3 flex flex-col gap-3">
                <Separator className="bg-white/10" />
                <p className="text-xs tracking-[0.3em] uppercase text-white/40">Resultados</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.map((r, idx) => (
                    <Card key={`${r.title}-${r.artist}-${idx}`} className="border-white/10 bg-black/25">
                      <CardContent className="pt-6">
                        <div className="flex gap-4 items-center">
                          <div
                            className="h-14 w-14 rounded-lg overflow-hidden shrink-0 border border-white/10"
                            style={{ background: 'rgba(255,255,255,0.04)' }}
                          >
                            {r.albumImageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={r.albumImageUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-white/90 truncate">{r.title}</p>
                            <p className="text-sm text-white/60 truncate">{r.artist}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button
                            onClick={() => void submitSong(r)}
                            disabled={submitLoading}
                            className="bg-pink-500/15 hover:bg-pink-500/20 text-white border border-pink-400/25"
                          >
                            Sugerir esta
                          </Button>
                          {r.previewUrl && (
                            <Button
                              variant="outline"
                              className="border-white/10 bg-white/5 hover:bg-white/10"
                              onClick={() => {
                                const el = document.getElementById(`preview-audio-${idx}`)
                                if (el instanceof HTMLAudioElement) {
                                  if (el.paused) void el.play()
                                  else el.pause()
                                }
                              }}
                            >
                              Escuchar preview
                            </Button>
                          )}
                        </div>

                        {r.previewUrl && (
                          <audio
                            id={`preview-audio-${idx}`}
                            className="mt-3 w-full"
                            controls
                            preload="none"
                            src={r.previewUrl}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold text-white/90">Lista pública</h2>
            <Button
              onClick={() => void refreshList()}
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10"
            >
              Actualizar
            </Button>
          </div>

          {playing.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs tracking-[0.3em] uppercase neon-pink">Sonando</p>
              {playing.map((s) => (
                <SongCard key={s.id} song={s} />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <p className="text-xs tracking-[0.3em] uppercase neon-purple">Pendientes</p>
            {pending.length === 0 ? (
              <p className="text-sm text-white/40">Aún no hay canciones pendientes.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {pending.map((s) => (
                  <SongCard key={s.id} song={s} />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs tracking-[0.3em] uppercase neon-blue">Ya sonaron</p>
            {played.length === 0 ? (
              <p className="text-sm text-white/40">Todavía no hay canciones reproducidas.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {played.slice(0, 12).map((s) => (
                  <SongCard key={s.id} song={s} />
                ))}
              </div>
            )}
          </div>          
        </section>

        {/* ── Footer nav ── */}
        <div className="flex justify-center pb-4">
          <Link href="/guest">
            <motion.span
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300"
              style={{
                background: 'rgba(168,85,247,0.08)',
                border: '1px solid rgba(168,85,247,0.4)',
                color: '#c084fc',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 0 18px rgba(168,85,247,0.2), inset 0 0 18px rgba(168,85,247,0.04)',
                cursor: 'pointer',
                textShadow: '0 0 12px rgba(192,132,252,0.6)',
              }}
            >
              ← Volver al menú
            </motion.span>
          </Link>
        </div>
      </div>
    </main>
  )
}
