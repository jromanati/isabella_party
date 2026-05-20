'use client'

import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import type { SongRequest, SpotifyTrackResult } from '@/lib/playlist-types'

type SongRequestsApiResponse = {
  songRequests: SongRequest[]
  nowPlaying: SongRequest | null
}

type SearchApiResponse = {
  results: SpotifyTrackResult[]
}

export default function PlaylistPage() {
  const [guestName, setGuestName] = useState('')
  const [rawSong, setRawSong] = useState('')

  const [searchLoading, setSearchLoading] = useState(false)
  const [results, setResults] = useState<SpotifyTrackResult[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)

  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const [songRequests, setSongRequests] = useState<SongRequest[]>([])
  const [nowPlaying, setNowPlaying] = useState<SongRequest | null>(null)

  async function refreshList() {
    const res = await fetch('/api/song-requests', { cache: 'no-store' })
    if (!res.ok) return
    const data: unknown = await res.json().catch(() => null)
    if (!data || typeof data !== 'object') return
    const obj = data as Partial<SongRequestsApiResponse>
    if (!Array.isArray(obj.songRequests)) return
    setSongRequests(obj.songRequests)
    setNowPlaying(obj.nowPlaying ?? null)
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
        setSearchError('No se pudo buscar en Spotify. Puedes enviar tu sugerencia manual.')
        return
      }

      const obj = data as Partial<SearchApiResponse>
      setResults(Array.isArray(obj.results) ? obj.results : [])

      if (!Array.isArray(obj.results) || obj.results.length === 0) {
        setSearchError('No encontramos resultados. Puedes enviar tu sugerencia manual.')
      }
    } finally {
      setSearchLoading(false)
    }
  }

  async function submitSong(selectedTrack: SpotifyTrackResult | null) {
    setSearchError(null)
    setSubmitMessage(null)

    const name = guestName.trim()
    const raw = rawSong.trim()

    if (!name) {
      setSearchError('Escribe tu nombre.')
      return
    }

    if (!raw) {
      setSearchError('Escribe una canción o artista.')
      return
    }

    setSubmitLoading(true)
    try {
      const res = await fetch('/api/request-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: name,
          rawSong: raw,
          selectedTrack: selectedTrack ?? undefined,
        }),
      })

      const data: unknown = await res.json().catch(() => null)
      if (!res.ok) {
        const msg = data && typeof data === 'object' && typeof (data as Record<string, unknown>).error === 'string'
          ? String((data as Record<string, unknown>).error)
          : 'No se pudo enviar tu sugerencia.'
        setSearchError(msg)
        return
      }

      setSubmitMessage('Tu canción fue sugerida al DJ.')
      setResults([])
      await refreshList()
    } finally {
      setSubmitLoading(false)
    }
  }

  function SongCard({ song }: { song: SongRequest }) {
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
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ej: José"
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

              <Button
                onClick={() => void submitSong(null)}
                disabled={submitLoading}
                variant="secondary"
                className="bg-purple-500/15 hover:bg-purple-500/20 text-white border border-purple-400/25"
              >
                {submitLoading ? 'Enviando…' : 'Enviar manual'}
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
                <p className="text-xs tracking-[0.3em] uppercase text-white/40">Resultados Spotify</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.map((r) => (
                    <Card key={r.spotifyTrackId} className="border-white/10 bg-black/25">
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
                          {r.spotifyUrl && (
                            <Button
                              asChild
                              variant="outline"
                              className="border-white/10 bg-white/5 hover:bg-white/10"
                            >
                              <a href={r.spotifyUrl} target="_blank" rel="noreferrer">Ver</a>
                            </Button>
                          )}
                        </div>
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

          {!nowPlaying && (
            <p className="text-xs text-white/30">
              Tip: También puedes abrir <span className="text-white/50">/now-playing</span> para proyección.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}
