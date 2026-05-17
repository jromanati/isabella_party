'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function NeonPartyRoom() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const COLORS = ['#ec4899', '#a855f7', '#3b82f6', '#f472b6', '#818cf8']

    const draw = () => {
      const t = (timeRef.current += 0.014)
      const W = canvas.width
      const H = canvas.height
      const floorY = H * 0.62

      ctx.clearRect(0, 0, W, H)

      // Deep background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, '#050210')
      bg.addColorStop(0.5, '#0a0320')
      bg.addColorStop(1, '#080218')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // ── Spotlight beams ──
      const spots = [
        { x: W * 0.2, col: '#ec4899', phase: 0 },
        { x: W * 0.5, col: '#a855f7', phase: 2.1 },
        { x: W * 0.8, col: '#3b82f6', phase: 4.2 },
      ]
      spots.forEach(({ x, col, phase }) => {
        const sweep = Math.sin(t * 0.6 + phase) * W * 0.12
        const tx = x + sweep
        const alpha = 0.18 + Math.sin(t + phase) * 0.06
        const grad = ctx.createLinearGradient(x, 0, tx, floorY)
        grad.addColorStop(0, col + 'bb')
        grad.addColorStop(0.5, col + '44')
        grad.addColorStop(1, col + '00')
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.moveTo(x - 5, 0)
        ctx.lineTo(x + 5, 0)
        ctx.lineTo(tx + 50, floorY)
        ctx.lineTo(tx - 50, floorY)
        ctx.closePath()
        ctx.fillStyle = grad
        ctx.fill()
        ctx.restore()
        // light bulb
        ctx.save()
        ctx.globalAlpha = 0.85
        ctx.shadowBlur = 22
        ctx.shadowColor = col
        ctx.fillStyle = col
        ctx.beginPath()
        ctx.arc(x, 8, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // ── Background "15" glyph ──
      ctx.save()
      ctx.globalAlpha = 0.06
      ctx.font = `900 ${H * 0.55}px serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = '#a855f7'
      ctx.shadowBlur = 60
      ctx.shadowColor = '#a855f7'
      ctx.fillText('15', W / 2, floorY * 0.92)
      ctx.restore()

      // ── Dance floor ──
      const COLS = 9
      const ROWS = 3
      const fw = W * 0.7
      const fh = H * 0.28
      const fx = (W - fw) / 2
      const tw = fw / COLS
      const th = fh / ROWS

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const pulse = Math.sin(t * 1.8 + c * 0.9 + r * 1.4) * 0.5 + 0.5
          const col = COLORS[(c * 2 + r) % COLORS.length]
          ctx.save()
          ctx.globalAlpha = 0.07 + pulse * 0.22
          ctx.fillStyle = col
          ctx.fillRect(fx + c * tw + 1, floorY + r * th + 1, tw - 2, th - 2)
          ctx.restore()
          if (pulse > 0.65) {
            ctx.save()
            ctx.globalAlpha = 0.5 * pulse
            ctx.strokeStyle = col
            ctx.lineWidth = 0.8
            ctx.shadowBlur = 6
            ctx.shadowColor = col
            ctx.strokeRect(fx + c * tw, floorY + r * th, tw, th)
            ctx.restore()
          }
        }
      }

      // Floor border
      ctx.save()
      ctx.strokeStyle = '#f472b6'
      ctx.lineWidth = 1.2
      ctx.shadowBlur = 14
      ctx.shadowColor = '#f472b6'
      ctx.globalAlpha = 0.6
      ctx.strokeRect(fx, floorY, fw, fh)
      ctx.restore()

      // ── Silhouettes dancing ──
      const silhouettes = [
        { x: W * 0.22, phase: 0, col: '#f472b6' },
        { x: W * 0.38, phase: 1.4, col: '#c084fc' },
        { x: W * 0.5, phase: 2.8, col: '#60a5fa' },
        { x: W * 0.62, phase: 0.7, col: '#f9a8d4' },
        { x: W * 0.78, phase: 2.1, col: '#a78bfa' },
      ]

      silhouettes.forEach(({ x, phase, col }) => {
        const bob = Math.abs(Math.sin(t * 1.3 + phase)) * 7
        const sway = Math.sin(t * 0.9 + phase) * 9
        ctx.save()
        ctx.globalAlpha = 0.55
        ctx.shadowBlur = 18
        ctx.shadowColor = col
        ctx.fillStyle = '#0d0522'
        ctx.beginPath()
        ctx.ellipse(x + sway, floorY - bob - 8, 9, 20, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + sway, floorY - bob - 30, 7, 0, Math.PI * 2)
        ctx.fill()
        // glow outline
        ctx.globalAlpha = 0.25
        ctx.strokeStyle = col
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.ellipse(x + sway, floorY - bob - 8, 9, 20, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(x + sway, floorY - bob - 30, 7, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      })

      // ── Floating particles ──
      for (let i = 0; i < 24; i++) {
        const px = (Math.sin(t * 0.28 + i * 2.3) * 0.46 + 0.5) * W
        const py = (Math.cos(t * 0.22 + i * 1.9) * 0.44 + 0.42) * H
        const r = 1.2 + Math.sin(t * 1.1 + i) * 0.7
        const col = COLORS[i % COLORS.length]
        ctx.save()
        ctx.globalAlpha = 0.6 + Math.sin(t + i) * 0.3
        ctx.shadowBlur = 10
        ctx.shadowColor = col
        ctx.fillStyle = col
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Fog at bottom
      const fog = ctx.createLinearGradient(0, floorY + fh * 0.7, 0, H)
      fog.addColorStop(0, 'transparent')
      fog.addColorStop(1, '#080218')
      ctx.fillStyle = fog
      ctx.fillRect(0, floorY + fh * 0.7, W, H)

      frameRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4 }}
      className="relative w-full rounded-3xl overflow-hidden"
      style={{
        height: 'clamp(240px, 55vw, 380px)',
        boxShadow:
          '0 0 60px rgba(168,85,247,0.2), 0 0 120px rgba(236,72,153,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Top border glow */}
      <div
        className="absolute top-0 inset-x-0 h-px z-10"
        style={{
          background:
            'linear-gradient(to right, transparent, #ec4899, #a855f7, #3b82f6, transparent)',
          boxShadow: '0 0 12px #a855f7',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div
        className="absolute bottom-0 inset-x-0 h-1/3 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #080218, transparent)' }}
      />
      {/* Bottom border glow */}
      <div
        className="absolute bottom-0 inset-x-0 h-px z-10"
        style={{
          background:
            'linear-gradient(to right, transparent, #3b82f6, #a855f7, #ec4899, transparent)',
          boxShadow: '0 0 12px #3b82f6',
        }}
      />
    </motion.div>
  )
}
