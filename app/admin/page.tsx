'use client'

import { motion } from 'framer-motion'
import { Users, Image as ImageIcon, MessageSquare, Film, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// ── Neon ambience ───────────────────────────────────────────────
function NeonAmbience() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh]"
        style={{
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[40vw] h-[30vh]"
        style={{
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}

// ── Menu Card ───────────────────────────────────────────────────
function MenuCard({
  title,
  description,
  icon: Icon,
  href,
  color,
  delay,
}: {
  title: string
  description: string
  icon: any
  href: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link href={href}>
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="relative rounded-2xl overflow-hidden p-6"
          style={{
            background: 'rgba(10,5,20,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div
            className="h-px w-full mb-4"
            style={{
              background: `linear-gradient(to right, transparent, rgba(${color},0.5), transparent)`,
              boxShadow: `0 0 12px rgba(${color},0.25)`,
            }}
          />
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `rgba(${color},0.15)`,
                    border: `1px solid rgba(${color},0.3)`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: `rgb(${color})` }} />
                </div>
                <h2 className="font-sans font-black italic text-xl text-white">{title}</h2>
              </div>
              <p
                className="text-sm"
                style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}
              >
                {description}
              </p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: `rgba(${color},0.1)`,
                border: `1px solid rgba(${color},0.2)`,
              }}
            >
              <ArrowRight className="w-4 h-4" style={{ color: `rgb(${color})` }} />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

// ── Page ────────────────────────────────────────────────────────
export default function AdminPage() {
  const menuItems = [
    {
      title: 'Invitados',
      description: 'Gestión completa de invitados, confirmaciones y mesas',
      icon: Users,
      href: '/admin/invitados',
      color: '59,130,246',
      delay: 0.1,
    },
    {
      title: 'Galería',
      description: 'Aprobar/rechazar fotos y controlar acceso a subida',
      icon: ImageIcon,
      href: '/admin/galeria',
      color: '168,85,247',
      delay: 0.2,
    },
    {
      title: 'Álbumes',
      description: 'Crear y gestionar álbumes de fotos y videos',
      icon: Film,
      href: '/admin/albumes',
      color: '34,197,94',
      delay: 0.3,
    },
    {
      title: 'Mensajes',
      description: 'Revisar y moderar mensajes de los invitados',
      icon: MessageSquare,
      href: '/admin/mensajes',
      color: '236,72,153',
      delay: 0.4,
    },
  ]

  return (
    <main className="min-h-screen" style={{ background: '#050308' }}>
      <NeonAmbience />

      {/* ── Nav ── */}
      <nav
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 py-4"
        style={{
          background: 'rgba(5,3,8,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(168,85,247,0.1)',
        }}
      >
        <Link href="/">
          <span
            className="font-sans font-black italic text-lg"
            style={{
              background: 'linear-gradient(135deg, #f9a8d4, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Isabella XV
          </span>
        </Link>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.2)',
            color: 'rgba(192,132,252,0.8)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#a855f7', boxShadow: '0 0 6px #a855f7' }}
          />
          Admin
        </div>
      </nav>

      <div className="relative pt-24 pb-20 px-5 max-w-lg mx-auto flex flex-col gap-6">

        {/* ── Page title ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="pt-2"
        >
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase mb-2"
            style={{ color: '#c084fc', fontFamily: 'var(--font-body)' }}
          >
            Panel de control
          </p>
          <h1
            className="font-sans font-black italic"
            style={{
              fontSize: 'clamp(2rem, 10vw, 3.5rem)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f9a8d4 40%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(192,132,252,0.3))',
            }}
          >
            Administración
          </h1>
          <p
            className="mt-3 text-sm"
            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}
          >
            Selecciona una sección para gestionar
          </p>
        </motion.div>

        {/* ── Menu Items ── */}
        <div className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <MenuCard key={item.href} {...item} />
          ))}
        </div>

      </div>
    </main>
  )
}
