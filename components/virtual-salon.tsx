'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, MapPin, CheckCircle, ChevronRight, Check } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase/client'

// ─── Data ─────────────────────────────────────────────────────────────────────
// Positions are % of the scene container.
// Background uses backgroundSize:'contain' so the full image is visible.
// X range kept 30–70% so tables stay clear of the side bars (Recepción/Lounge).
// Y range 33–72% to avoid the top sign and bottom fog.
// Row 1 (upper): left 31%, 33%  — right 69%, 33%
// Row 2 (middle): left 27%, 52%  — right 73%, 52%
// Row 3 (lower):  left 31%, 70%  — right 69%, 70%
const TABLE_LAYOUT = [
  { id: 1, label: '01', x: 30, y: 23 },
  { id: 2, label: '02', x: 50, y: 30 },
  { id: 3, label: '03', x: 68, y: 23 },
  { id: 4, label: '04', x: 70, y: 53 },
  { id: 5, label: '05', x: 30, y: 53 },
  { id: 6, label: '06', x: 50, y: 70 },
]

type GuestRow = {
  id: string
  full_name: string
  normalized_name: string
  table_number: number | null
  rsvp_status: string
}

type TableGuest = {
  id: string
  name: string
  normalizedName: string
  status: 'pending' | 'confirmed'
}

type TableData = {
  id: number
  label: string
  x: number
  y: number
  guests: TableGuest[]
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function VirtualSalon({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const [highlightedTable, setHighlightedTable] = useState<number | null>(null)
  const [searchResult, setSearchResult] = useState<{ tableId: number; guestName: string } | null>(null)
  const [searchGuestId, setSearchGuestId] = useState<string | null>(null)
  const [searchFocused, setSearchFocused] = useState(false)
  const [tables, setTables] = useState<TableData[]>(() => TABLE_LAYOUT.map((t) => ({ ...t, guests: [] })))
  const [tablesLoading, setTablesLoading] = useState(true)
  const [tablesError, setTablesError] = useState<string | null>(null)
  const [confirmingGuestId, setConfirmingGuestId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const mobileTableRefs = useRef<Record<number, HTMLButtonElement | null>>({})
  const guestItemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const prevSelectedTable = useRef<number | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadGuests = async () => {
      try {
        setTablesLoading(true)
        setTablesError(null)

        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from('guests')
          .select('id, full_name, normalized_name, table_number, rsvp_status')
          .order('table_number', { ascending: true })
          .order('full_name', { ascending: true })

        if (error) throw error
        if (cancelled) return

        const byTable = new Map<number, TableGuest[]>()
        for (const row of (data ?? []) as GuestRow[]) {
          if (!row.table_number) continue
          const status = row.rsvp_status === 'confirmed' ? 'confirmed' : 'pending'
          const guest: TableGuest = {
            id: row.id,
            name: row.full_name,
            normalizedName: row.normalized_name,
            status,
          }
          const arr = byTable.get(row.table_number) ?? []
          arr.push(guest)
          byTable.set(row.table_number, arr)
        }

        setTables(TABLE_LAYOUT.map((t) => ({ ...t, guests: byTable.get(t.id) ?? [] })))
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        if (!cancelled) setTablesError(message)
      } finally {
        if (!cancelled) setTablesLoading(false)
      }
    }

    loadGuests()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const prev = prevSelectedTable.current
    prevSelectedTable.current = selectedTable

    // When closing the mobile sheet, scroll back to the top so all tables are visible.
    if (prev && !selectedTable) {
      const container = mobileScrollRef.current
      container?.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!selectedTable) return
    const el = mobileTableRefs.current[selectedTable]
    if (!el) return
    const container = mobileScrollRef.current
    if (!container) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      return
    }

    // Keep the selected table above the mobile bottom sheet (maxHeight: 55vh)
    const sheetHeightPx = Math.round(window.innerHeight * 0.55)
    const visibleHeight = Math.max(0, container.clientHeight - sheetHeightPx - 16)

    const elTop = el.offsetTop
    const elHeight = el.offsetHeight
    const target = elTop - (visibleHeight / 2 - elHeight / 2)
    const maxScroll = container.scrollHeight - container.clientHeight
    const next = Math.min(Math.max(0, target), Math.max(0, maxScroll))

    container.scrollTo({ top: next, behavior: 'smooth' })
  }, [selectedTable])

  const handleSearch = (q: string) => {
    setQuery(q)
    if (!q.trim()) {
      setSearchResult(null)
      setSearchGuestId(null)
      setHighlightedTable(null)
      return
    }
    const lower = q.toLowerCase()
    for (const table of tables) {
      const guest = table.guests.find((g) => g.name.toLowerCase().includes(lower) || g.normalizedName.toLowerCase().includes(lower))
      if (guest) {
        setSearchResult({ tableId: table.id, guestName: guest.name })
        setSearchGuestId(guest.id)
        setHighlightedTable(table.id)
        setSelectedTable(table.id)
        return
      }
    }
    setSearchResult(null)
    setSearchGuestId(null)
    setHighlightedTable(null)
  }

  const handleConfirm = async (guestId: string) => {
    if (confirmingGuestId) return
    setConfirmingGuestId(guestId)
    setTablesError(null)

    try {
      const guestToConfirm = tables.flatMap((t) => t.guests).find((g) => g.id === guestId) ?? null
      const tableForGuest = guestToConfirm
        ? (tables.find((t) => t.guests.some((g) => g.id === guestId))?.id ?? null)
        : null

      const supabase = getSupabaseClient()
      const now = new Date().toISOString()
      const { error } = await supabase
        .from('guests')
        .update({ rsvp_status: 'confirmed', confirmed_at: now })
        .eq('id', guestId)

      if (error) throw error

      if (guestToConfirm) {
        fetch('/api/rsvp-confirmed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestName: guestToConfirm.name,
            tableNumber: tableForGuest,
          }),
        }).catch(() => {})
      }

      setTables((prev) =>
        prev.map((t) => ({
          ...t,
          guests: t.guests.map((g) => (g.id === guestId ? { ...g, status: 'confirmed' } : g)),
        }))
      )
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setTablesError(message)
    } finally {
      setConfirmingGuestId(null)
    }
  }

  const activeTableData = selectedTable ? tables.find((t) => t.id === selectedTable) : null
  const confirmed = activeTableData ? activeTableData.guests.filter((g) => g.status === 'confirmed').length : 0
  const total = activeTableData ? activeTableData.guests.length : 0
  const allConfirmed = confirmed === total

  useEffect(() => {
    if (!searchGuestId) return
    const el = guestItemRefs.current[searchGuestId]
    if (!el) return

    const id = requestAnimationFrame(() => {
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } catch {
        el.scrollIntoView(true)
      }
    })

    return () => cancelAnimationFrame(id)
  }, [searchGuestId, selectedTable])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: '#050211', fontFamily: 'var(--font-body)' }}
    >
      {/* ── TOP BAR ─────────────────────────────────────────────────────────── */}
      <div
        className="relative z-20 flex items-center gap-3 px-4 py-2.5 flex-shrink-0"
        style={{
          background: 'rgba(5,2,17,0.92)',
          borderBottom: '1px solid rgba(168,85,247,0.18)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: '#ec4899', boxShadow: '0 0 8px #ec4899' }} />
          <div className="flex flex-col">
            <span className="font-black italic text-sm text-white/90 tracking-wide">Salón Virtual</span>
            <button
              onClick={onClose}
              className="sm:hidden mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg w-fit"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.65)',
              }}
            >
              <X className="w-3.5 h-3.5" />
              <span className="text-xs">Cerrar</span>
            </button>
          </div>
          <span
            className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.35)', color: '#c084fc' }}
          >
            Isabella XV
          </span>
        </div>

        {/* Search bar */}
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 mx-2"
          style={{
            background: searchFocused ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.06)',
            border: searchFocused ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.1)',
            boxShadow: searchFocused ? '0 0 20px rgba(168,85,247,0.15)' : 'none',
          }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: searchFocused ? '#c084fc' : 'rgba(255,255,255,0.35)' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Buscar mi nombre..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none min-w-0"
            style={{ fontSize: '16px' }}
          />
          {query && (
            <button onClick={() => { setQuery(''); setSearchResult(null); setSearchGuestId(null); setHighlightedTable(null) }}>
              <X className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.4)' }} />
            </button>
          )}
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#a855f7', boxShadow: '0 0 12px rgba(168,85,247,0.5)' }}
          >
            <Search className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          <X className="w-3.5 h-3.5" />
          <span className="text-xs hidden sm:inline">Salir</span>
        </button>
      </div>

      {/* ── MAIN AREA ───────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── SCENE ─────────────────────────────────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden">

          {/* Background: fondo sin mesas */}
          <div
            className="absolute inset-0 sm:hidden"
            style={{
              backgroundColor: '#050211',
              backgroundImage: 'url(/fondo_mobile.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
            }}
          />

          <div
            className="absolute inset-0 hidden sm:block"
            style={{
              backgroundImage: `url(/fondo_escenario.png)`,
              backgroundSize: '110% 110%',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#050211',
            }}
          />

          {/* Subtle vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(2,0,10,0.55) 100%)',
            }}
          />

          {/* ── TABLE SPRITES ──────────────────────────────────────────────── */}
          <div ref={mobileScrollRef} className="absolute inset-0 sm:hidden overflow-y-auto">
            <div className="min-h-full grid grid-cols-2 place-items-center gap-4 px-4 pt-6" style={{ paddingBottom: '60vh' }}>
              {tables.map((table) => {
                const isSelected = selectedTable === table.id
                const isHighlighted = highlightedTable === table.id
                const imgSize = 'min(40vw, 210px)'
                const mobileScale = isSelected || isHighlighted ? 1.03 : 1

                return (
                  <button
                    key={table.id}
                    ref={(node) => { mobileTableRefs.current[table.id] = node }}
                    onClick={() => setSelectedTable(isSelected ? null : table.id)}
                    className="relative"
                    style={{
                      width: imgSize,
                      height: imgSize,
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transform: `scale(${mobileScale})`,
                      transition: 'transform 0.18s ease',
                    }}
                  >
                    <img
                      src="/mesa.png"
                      alt={`Mesa ${table.label}`}
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        mixBlendMode: 'screen',
                        display: 'block',
                        filter: isHighlighted
                          ? 'brightness(1.4) saturate(1.6) hue-rotate(-15deg) drop-shadow(0 0 18px rgba(236,72,153,0.9))'
                          : isSelected
                          ? 'brightness(1.25) saturate(1.3) drop-shadow(0 0 14px rgba(168,85,247,0.8))'
                          : 'brightness(0.95) saturate(1.1)',
                        transition: 'filter 0.3s ease',
                      }}
                    />

                    {isHighlighted && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          border: '2px solid #ec4899',
                          boxShadow: '0 0 28px rgba(236,72,153,0.7)',
                          borderRadius: '50%',
                          top: '18%',
                          left: '10%',
                          width: '80%',
                          height: '52%',
                          animation: 'neonPulse 1.4s ease-in-out infinite',
                        }}
                      />
                    )}

                    {(isSelected || isHighlighted) && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                        style={{
                          top: -4,
                          color: '#ec4899',
                          filter: 'drop-shadow(0 0 8px #ec4899)',
                          zIndex: 5,
                        }}
                      >
                        <MapPin className="w-5 h-5" fill="#ec4899" />
                      </div>
                    )}

                    <div
                      className="absolute pointer-events-none flex items-center justify-center"
                      style={{
                        left: '50%',
                        top: '28%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 6,
                      }}
                    >
                      <div
                        className="flex items-center justify-center rounded-full font-black text-white"
                        style={{
                          width: 34,
                          height: 34,
                          fontSize: 13,
                          background: isHighlighted
                            ? 'rgba(236,72,153,0.85)'
                            : isSelected
                            ? 'rgba(168,85,247,0.85)'
                            : 'rgba(10,5,30,0.82)',
                          border: isHighlighted
                            ? '2px solid #ec4899'
                            : isSelected
                            ? '2px solid #c084fc'
                            : '1.5px solid rgba(192,132,252,0.7)',
                          boxShadow: isHighlighted
                            ? '0 0 16px rgba(236,72,153,0.8), 0 0 4px rgba(0,0,0,0.6)'
                            : isSelected
                            ? '0 0 14px rgba(168,85,247,0.7), 0 0 4px rgba(0,0,0,0.6)'
                            : '0 0 10px rgba(168,85,247,0.45), 0 0 4px rgba(0,0,0,0.6)',
                          backdropFilter: 'blur(8px)',
                          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                          letterSpacing: '0.02em',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {table.label}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="hidden sm:block">
            {tables.map((table) => {
              const isSelected = selectedTable === table.id
              const isHighlighted = highlightedTable === table.id
              const imgSize = 'clamp(150px, 16vw, 240px)'

              return (
                <div
                  key={table.id}
                  className="absolute"
                  style={{
                    left: `${table.x}%`,
                    top: `${table.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isSelected || isHighlighted ? 15 : 10,
                    width: imgSize,
                    height: imgSize,
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.015)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)' }}
                >
                  {/* Mesa PNG — mix-blend-mode:screen makes the black bg invisible */}
                  <img
                    src="/mesa.png"
                    alt={`Mesa ${table.label}`}
                    draggable={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      mixBlendMode: 'screen',
                      display: 'block',
                      pointerEvents: 'none',
                      // Highlight: add pink tint via filter
                      filter: isHighlighted
                        ? 'brightness(1.4) saturate(1.6) hue-rotate(-15deg) drop-shadow(0 0 18px rgba(236,72,153,0.9))'
                        : isSelected
                        ? 'brightness(1.25) saturate(1.3) drop-shadow(0 0 14px rgba(168,85,247,0.8))'
                        : 'brightness(0.95) saturate(1.1)',
                      transition: 'filter 0.3s ease',
                    }}
                  />

                  {/* Clickable hitbox (ellipse on the table surface) */}
                  <button
                    type="button"
                    onClick={() => setSelectedTable(isSelected ? null : table.id)}
                    aria-label={`Seleccionar mesa ${table.label}`}
                    className="absolute"
                    style={{
                      top: '18%',
                      left: '10%',
                      width: '80%',
                      height: '52%',
                      borderRadius: '50%',
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  />

                  {/* Outer pulse ring when highlighted */}
                  {isHighlighted && (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        border: '2px solid #ec4899',
                        boxShadow: '0 0 28px rgba(236,72,153,0.7)',
                        borderRadius: '50%',
                        top: '18%', left: '10%',
                        width: '80%', height: '52%',
                        animation: 'neonPulse 1.4s ease-in-out infinite',
                      }}
                    />
                  )}

                  {/* Map pin above table when selected */}
                  {(isSelected || isHighlighted) && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                      style={{
                        top: -4,
                        color: '#ec4899',
                        filter: 'drop-shadow(0 0 8px #ec4899)',
                        zIndex: 5,
                      }}
                    >
                      <MapPin className="w-5 h-5" fill="#ec4899" />
                    </div>
                  )}

                  {/* Number badge — centered over the table top surface */}
                  {/* The table top in the PNG is roughly at 28–52% from top, centered horizontally */}
                  <div
                    className="absolute pointer-events-none flex items-center justify-center"
                    style={{
                      left: '50%',
                      top: '28%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 6,
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full font-black text-white"
                      style={{
                        width: 34,
                        height: 34,
                        fontSize: 13,
                        background: isHighlighted
                          ? 'rgba(236,72,153,0.85)'
                          : isSelected
                          ? 'rgba(168,85,247,0.85)'
                          : 'rgba(10,5,30,0.82)',
                        border: isHighlighted
                          ? '2px solid #ec4899'
                          : isSelected
                          ? '2px solid #c084fc'
                          : '1.5px solid rgba(192,132,252,0.7)',
                        boxShadow: isHighlighted
                          ? '0 0 16px rgba(236,72,153,0.8), 0 0 4px rgba(0,0,0,0.6)'
                          : isSelected
                          ? '0 0 14px rgba(168,85,247,0.7), 0 0 4px rgba(0,0,0,0.6)'
                          : '0 0 10px rgba(168,85,247,0.45), 0 0 4px rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(8px)',
                        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                        letterSpacing: '0.02em',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {table.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Search found toast ──────────────────────────────────────────── */}
          <AnimatePresence>
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full"
                style={{
                  background: 'rgba(10,5,25,0.92)',
                  border: '1px solid rgba(236,72,153,0.5)',
                  boxShadow: '0 0 24px rgba(236,72,153,0.3)',
                  backdropFilter: 'blur(20px)',
                  whiteSpace: 'nowrap',
                }}
              >
                <CheckCircle className="w-4 h-4" style={{ color: '#4ade80' }} />
                <span className="text-sm font-semibold text-white">{searchResult.guestName}</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  — Mesa {String(searchResult.tableId).padStart(2, '0')}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {activeTableData && (
            <motion.div
              key="panel"
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 200 }}
              className="hidden lg:flex flex-col w-72 flex-shrink-0 overflow-y-auto"
              style={{
                background: 'rgba(8,4,20,0.88)',
                borderLeft: '1px solid rgba(168,85,247,0.2)',
                backdropFilter: 'blur(24px)',
              }}
            >
              <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, #a855f7, #ec4899, transparent)' }} />

              <div className="flex flex-col gap-5 p-5">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: 'rgba(168,85,247,0.7)' }}>
                  Mesa seleccionada
                </p>

                <div className="flex items-end justify-between">
                  <h2
                    className="font-black italic leading-none"
                    style={{
                      fontSize: '3rem',
                      background: 'linear-gradient(135deg, #ffffff, #f9a8d4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 20px rgba(249,168,212,0.4))',
                    }}
                  >
                    Mesa {String(activeTableData.id).padStart(2, '0')}
                  </h2>
                  <span
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-1"
                    style={{
                      background: allConfirmed ? 'rgba(34,197,94,0.12)' : 'rgba(251,191,36,0.1)',
                      border: allConfirmed ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(251,191,36,0.3)',
                      color: allConfirmed ? '#4ade80' : '#fbbf24',
                    }}
                  >
                    <CheckCircle className="w-3 h-3" />
                    {allConfirmed ? 'CONFIRMADA' : `${confirmed}/${total}`}
                  </span>
                </div>

                <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.07)' }} />

                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Invitados
                  </p>
                  {activeTableData.guests.map((guest, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg"
                      ref={(node) => {
                        guestItemRefs.current[guest.id] = node
                      }}
                      style={{
                        background:
                          guest.id === searchGuestId
                            ? 'rgba(236,72,153,0.16)'
                            : i % 2 === 0
                            ? 'rgba(255,255,255,0.03)'
                            : 'transparent',
                        border: guest.id === searchGuestId ? '1px solid rgba(236,72,153,0.45)' : '1px solid transparent',
                        boxShadow: guest.id === searchGuestId ? '0 0 14px rgba(236,72,153,0.35)' : 'none',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            background: guest.status === 'confirmed' ? '#4ade80' : '#f87171',
                            boxShadow: guest.status === 'confirmed' ? '0 0 6px #4ade80' : '0 0 6px #f87171',
                          }}
                        />
                        <span className="text-sm text-white/85 font-medium">{guest.name}</span>
                      </div>
                      {guest.status === 'pending' ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleConfirm(guest.id)}
                          disabled={confirmingGuestId === guest.id}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: 'rgba(236,72,153,0.14)',
                            border: '1px solid rgba(236,72,153,0.38)',
                            color: '#f9a8d4',
                            opacity: confirmingGuestId === guest.id ? 0.6 : 1,
                          }}
                        >
                          {confirmingGuestId === guest.id ? 'Confirmando…' : 'Confirmar'}
                        </motion.button>
                      ) : (
                        guest.status === 'confirmed' ? (
                          <span className="text-xs font-medium inline-flex items-center gap-1" style={{ color: '#4ade80' }}>
                            <Check className="w-3 h-3" />
                            Confirmado
                          </span>
                        ) : (
                          <span className="text-xs font-medium" style={{ color: '#f87171' }}>
                            Pendiente
                          </span>
                        )
                      )}
                    </div>
                  ))}
                </div>

                <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.07)' }} />

                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Como funciona?
                  </p>
                  {[
                    { icon: <Search className="w-3.5 h-3.5" />, text: 'Busca tu nombre arriba' },
                    { icon: <MapPin className="w-3.5 h-3.5" />, text: 'Te llevaremos a tu mesa' },
                    { icon: <ChevronRight className="w-3.5 h-3.5" />, text: 'Toca las mesas para explorar' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span style={{ color: '#c084fc' }}>{item.icon}</span>
                      <span className="text-xs text-white/55">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile bottom sheet — shown when a table is selected on small screens */}
        <AnimatePresence>
          {activeTableData && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="lg:hidden fixed bottom-0 inset-x-0 z-30 rounded-t-2xl overflow-hidden"
              style={{
                background: 'rgba(8,4,20,0.96)',
                border: '1px solid rgba(168,85,247,0.25)',
                borderBottom: 'none',
                backdropFilter: 'blur(28px)',
                maxHeight: '55vh',
              }}
            >
              <div className="h-1 w-10 rounded-full mx-auto mt-3" style={{ background: 'rgba(255,255,255,0.2)' }} />
              <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(55vh - 24px)' }}>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'rgba(168,85,247,0.7)' }}>
                      Mesa seleccionada
                    </p>
                    <h2 className="font-black italic text-3xl text-white" style={{ filter: 'drop-shadow(0 0 16px rgba(249,168,212,0.4))' }}>
                      Mesa {String(activeTableData.id).padStart(2, '0')}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        background: allConfirmed ? 'rgba(34,197,94,0.12)' : 'rgba(251,191,36,0.1)',
                        border: allConfirmed ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(251,191,36,0.3)',
                        color: allConfirmed ? '#4ade80' : '#fbbf24',
                      }}
                    >
                      <CheckCircle className="w-3 h-3" />
                      {allConfirmed ? 'CONFIRMADA' : `${confirmed}/${total}`}
                    </span>
                    <button
                      onClick={() => setSelectedTable(null)}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      <X className="w-3.5 h-3.5 text-white/60" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {activeTableData.guests.map((guest, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-2 rounded-lg"
                      ref={(node) => {
                        guestItemRefs.current[guest.id] = node
                      }}
                      style={{
                        background:
                          guest.id === searchGuestId
                            ? 'rgba(236,72,153,0.18)'
                            : i % 2 === 0
                            ? 'rgba(255,255,255,0.04)'
                            : 'transparent',
                        border: guest.id === searchGuestId ? '1px solid rgba(236,72,153,0.45)' : '1px solid transparent',
                        boxShadow: guest.id === searchGuestId ? '0 0 14px rgba(236,72,153,0.35)' : 'none',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            background: guest.status === 'confirmed' ? '#4ade80' : '#f87171',
                            boxShadow: guest.status === 'confirmed' ? '0 0 6px #4ade80' : '0 0 6px #f87171',
                          }}
                        />
                        <span className="text-sm text-white/85 font-medium">{guest.name}</span>
                      </div>
                      {guest.status === 'pending' ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleConfirm(guest.id)}
                          disabled={confirmingGuestId === guest.id}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: 'rgba(236,72,153,0.14)',
                            border: '1px solid rgba(236,72,153,0.38)',
                            color: '#f9a8d4',
                            opacity: confirmingGuestId === guest.id ? 0.6 : 1,
                          }}
                        >
                          {confirmingGuestId === guest.id ? 'Confirmando…' : 'Confirmar'}
                        </motion.button>
                      ) : (
                        guest.status === 'confirmed' ? (
                          <span className="text-xs font-medium inline-flex items-center gap-1" style={{ color: '#4ade80' }}>
                            <Check className="w-3 h-3" />
                            Confirmado
                          </span>
                        ) : (
                          <span className="text-xs font-medium" style={{ color: '#f87171' }}>
                            Pendiente
                          </span>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
