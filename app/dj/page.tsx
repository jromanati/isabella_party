'use client'

import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

import type { SongRequest, SongRequestReject } from '@/types/song-request'
import { SongRequestAdapter } from '@/services/song-request-adapter.service'
import { AuthService } from '@/services/auth.service'
import { useAutoMarkAsReviewed } from '@/hooks/useAutoMarkAsReviewed'

export default function DjPage() {
  // Auto-marcar canciones como revisadas cuando se entra a esta página
  useAutoMarkAsReviewed()
  const [songRequests, setSongRequests] = useState<SongRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'pending' | 'playing' | 'played' | 'rejected'>('pending')

  async function refresh() {
    setError(null)
    try {
      // Usar Supabase directamente - no requiere autenticación
      // Obtener todas las solicitudes (sin filtros para DJ)
      const response = await SongRequestAdapter.getSongRequests()
      
      if (response.success && response.data) {
        setSongRequests(response.data)
      } else {
        setError(response.error || 'No se pudo cargar la lista.')
      }
    } catch (error) {
      setError('Error al cargar la lista.')
    }
  }

  useEffect(() => {
    void refresh()
    const id = window.setInterval(() => {
      void refresh()
    }, 5_000)
    return () => window.clearInterval(id)
  }, [])

  const pending = useMemo(() => songRequests.filter((s) => s.status === 'pending'), [songRequests])
  const playing = useMemo(() => songRequests.filter((s) => s.status === 'playing'), [songRequests])
  const played = useMemo(() => songRequests.filter((s) => s.status === 'played'), [songRequests])
  const rejected = useMemo(() => songRequests.filter((s) => s.status === 'rejected'), [songRequests])

  async function markAsPlaying(songId: number) {
    setError(null)
    setLoading(true)
    try {
      // Usar Supabase directamente - no requiere autenticación
      const response = await SongRequestAdapter.markAsPlaying(songId)
      
      if (response.success) {
        await refresh()
      } else {
        setError(response.error || 'No se pudo marcar como sonando.')
      }
    } catch (error) {
      setError('Error al marcar como sonando.')
    } finally {
      setLoading(false)
    }
  }

  async function markAsPlayed(songId: number) {
    setError(null)
    setLoading(true)
    try {
      // Usar Supabase directamente - no requiere autenticación
      const response = await SongRequestAdapter.markAsPlayed(songId)
      
      if (response.success) {
        await refresh()
      } else {
        setError(response.error || 'No se pudo marcar como reproducida.')
      }
    } catch (error) {
      setError('Error al marcar como reproducida.')
    } finally {
      setLoading(false)
    }
  }

  async function rejectSong(songId: number, reason?: string) {
    setError(null)
    setLoading(true)
    try {
      // Usar Supabase directamente - no requiere autenticación
      const rejectData: SongRequestReject = { 
        reason: reason || 'Rechazada por el DJ' 
      }

      const response = await SongRequestAdapter.rejectSongRequest(songId, rejectData)
      
      if (response.success) {
        await refresh()
      } else {
        setError(response.error || 'No se pudo rechazar la canción.')
      }
    } catch (error) {
      setError('Error al rechazar la canción.')
    } finally {
      setLoading(false)
    }
  }

  function SongRow({ song }: { song: SongRequest }) {
    const title = song.song_title || song.raw_song
    const artist = song.artist_name || '—'

    return (
      <Card className="border-white/10 bg-black/35">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div
              className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-white/10"
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
                <p className="font-semibold text-white/90 truncate">{title}</p>
                {song.status === 'playing' && (
                  <Badge className="bg-pink-500/20 text-pink-200 border-pink-400/30">SONANDO</Badge>
                )}
                {song.status === 'pending' && (
                  <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">PENDIENTE</Badge>
                )}
                {song.status === 'played' && (
                  <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30">YA SONÓ</Badge>
                )}
                {song.status === 'rejected' && (
                  <Badge variant="destructive" className="border-red-400/30 bg-red-500/20 text-red-200">RECHAZADA</Badge>
                )}
                {song.is_featured && (
                  <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30">⭐ DESTACADA</Badge>
                )}
              </div>
              <p className="text-sm text-white/60 truncate">{artist}</p>
              <p className="text-xs text-white/40 mt-1">
                {song.guest_name} · {new Date(song.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </p>
              {song.rejection_reason && (
                <p className="text-xs text-red-400 mt-1">
                  Motivo: {song.rejection_reason}
                </p>
              )}
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              {song.status === 'pending' && (
                <>
                  <Button
                    onClick={() => void markAsPlaying(song.id)}
                    disabled={loading}
                    className="bg-pink-500/15 hover:bg-pink-500/20 text-white border border-pink-400/25"
                  >
                    Marcar sonando
                  </Button>
                  <Button
                    onClick={() => void markAsPlayed(song.id)}
                    disabled={loading}
                    className="bg-blue-500/15 hover:bg-blue-500/20 text-white border border-blue-400/25"
                  >
                    Ya sonó
                  </Button>
                </>
              )}
              {song.status === 'playing' && (
                <Button
                  onClick={() => void markAsPlayed(song.id)}
                  disabled={loading}
                  className="bg-blue-500/15 hover:bg-blue-500/20 text-white border border-blue-400/25"
                >
                  Terminar
                </Button>
              )}
              {song.status !== 'rejected' && song.status !== 'played' && (
                <Button
                  onClick={() => void rejectSong(song.id)}
                  disabled={loading}
                  variant="destructive"
                >
                  Rechazar
                </Button>
              )}
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
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(168,85,247,0.14) 0%, transparent 70%), radial-gradient(ellipse 90% 70% at 20% 100%, rgba(236,72,153,0.10) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-white/40">Panel DJ</p>
          <h1 className="text-2xl font-black italic text-white/90">Control de playlist</h1>
          <div className="flex gap-3 flex-wrap items-center">
            <Button
              onClick={() => void refresh()}
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10"
            >
              Actualizar
            </Button>
            <Button
              onClick={() => window.location.href = '/admin'}
              variant="outline"
              className="border-purple-400/20 bg-purple-500/10 hover:bg-purple-500/20 text-purple-200"
            >
              ← Admin
            </Button>
          </div>
          {error && <p className="text-sm" style={{ color: 'rgba(248,113,113,0.95)' }}>{error}</p>}
        </header>

        <Card className="border-white/10 bg-black/30">
          <CardHeader>
            <CardTitle className="text-white/90">Canciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="pending">Pendientes ({pending.length})</TabsTrigger>
                <TabsTrigger value="playing">Sonando ({playing.length})</TabsTrigger>
                <TabsTrigger value="played">Ya sonaron ({played.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rechazadas ({rejected.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4">
                <div className="flex flex-col gap-3">
                  {pending.length === 0 ? (
                    <p className="text-sm text-white/40">No hay pendientes.</p>
                  ) : (
                    pending.map((s) => <SongRow key={s.id} song={s} />)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="playing" className="mt-4">
                <div className="flex flex-col gap-3">
                  {playing.length === 0 ? (
                    <p className="text-sm text-white/40">No hay canción sonando.</p>
                  ) : (
                    playing.map((s) => <SongRow key={s.id} song={s} />)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="played" className="mt-4">
                <div className="flex flex-col gap-3">
                  {played.length === 0 ? (
                    <p className="text-sm text-white/40">No hay canciones reproducidas.</p>
                  ) : (
                    played.map((s) => <SongRow key={s.id} song={s} />)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="rejected" className="mt-4">
                <div className="flex flex-col gap-3">
                  {rejected.length === 0 ? (
                    <p className="text-sm text-white/40">No hay rechazadas.</p>
                  ) : (
                    rejected.map((s) => <SongRow key={s.id} song={s} />)
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
