export type FavoriteColor = {
  name: string
  hex: string
  glow: string
}

export type VibeCard = {
  title: string
  imageSrc: string
  tag?: string
}

export type SizeRow = {
  label: string
  value: string
}

export type LoveItem = {
  label: string
  icon: string
}

export type GeneralIdea = {
  title: string
  description: string
}

export type IsabellaGustosData = {
  hero: {
    title: string
    subtitle: string
    ctaLabel: string
    imageSrc: string
  }
  favoriteColors: FavoriteColor[]
  vibes: VibeCard[]
  sizes: SizeRow[]
  loves: LoveItem[]
  generalIdeas: GeneralIdea[]
  moodboardImages: { src: string; alt: string }[]
  footer: {
    text: string
  }
}

export const ISABELLA_GUSTOS: IsabellaGustosData = {
  hero: {
    title: '¿Quieres sorprender a Isabella? ✨',
    subtitle:
      'Sabemos que elegir un regalo a veces no es fácil… así que aquí encontrarás pequeñas pistas sobre las cosas que le gustan, sus colores favoritos, hobbies y detalles de su personalidad 💜',
    ctaLabel: 'Explorar gustos',
    imageSrc: '/isabella-hero-bg.jpg',
  },
  favoriteColors: [
    { name: 'Negro', hex: '#0b0b10', glow: 'rgba(255,255,255,0.12)' },
    { name: 'Morado', hex: '#7c3aed', glow: 'rgba(168,85,247,0.55)' },
    { name: 'Blanco', hex: '#f5f5ff', glow: 'rgba(255,255,255,0.35)' },
    { name: 'Azul oscuro', hex: '#1e3a8a', glow: 'rgba(59,130,246,0.35)' },
  ],
  vibes: [
    { title: 'Anime aesthetic', imageSrc: '/1.jpeg', tag: 'vibes' },
    { title: 'Vóley', imageSrc: '/2.jpeg', tag: 'energía' },
    { title: 'Oversize hoodies', imageSrc: '/3.jpeg', tag: 'comfort' },
    { title: 'Streetwear', imageSrc: '/4.jpeg', tag: 'style' },
    { title: 'Disney', imageSrc: '/5.jpeg', tag: 'magia' },
    { title: 'Papelería bonita', imageSrc: '/dress-code-bg.jpg', tag: 'aesthetic' },
    { title: 'Accesorios delicados', imageSrc: '/gallery-bg.jpg', tag: 'details' },
    { title: 'Decoración LED', imageSrc: '/fondo_escenario.png', tag: 'glow' },
    { title: 'Arte y dibujo', imageSrc: '/mesa.png', tag: 'creatividad' },
  ],
  sizes: [
    { label: 'Poleras', value: 'M (oversize)' },
    { label: 'Hoodies', value: 'L (oversize)' },
    { label: 'Pantalones', value: '38 (CL)' },
    { label: 'Zapatillas', value: '39 (EU) / 8 (US)' },
    { label: 'Accesorios', value: 'Talla única' },
  ],
  loves: [
    { label: 'Vóley', icon: 'volleyball' },
    { label: 'Anime', icon: 'sparkles' },
    { label: 'Música', icon: 'music' },
    { label: 'Dibujar', icon: 'pencil' },
    { label: 'Disney', icon: 'star' },
    { label: 'Tecnología', icon: 'cpu' },
    { label: 'Kawaii', icon: 'heart' },
    { label: 'Comics', icon: 'book' },
    { label: 'Peluches aesthetic', icon: 'smile' },
    { label: 'Skincare', icon: 'droplet' },
  ],
  generalIdeas: [
    {
      title: 'Accesorios deportivos',
      description: 'Detalles útiles para su energía y hobbies, sin perder el estilo.',
    },
    {
      title: 'Papelería aesthetic',
      description: 'Cuadernos, organizadores y cositas lindas para crear y soñar.',
    },
    {
      title: 'Decoración para habitación',
      description: 'Toques cálidos, luces suaves y vibes que se sientan suyas.',
    },
    {
      title: 'Experiencias entretenidas',
      description: 'Un momento especial suele quedarse en la memoria para siempre.',
    },
    {
      title: 'Merch inspirado en anime',
      description: 'Un guiño a sus series favoritas, sin ser algo demasiado literal.',
    },
    {
      title: 'Audífonos o accesorios de música',
      description: 'Para acompañar sus playlists y momentos de inspiración.',
    },
    {
      title: 'Hoodies y capas comfy',
      description: 'Texturas suaves y oversize, para el mood cozy + cool.',
    },
    {
      title: 'Arte y dibujo',
      description: 'Materiales creativos que inviten a imaginar y diseñar.',
    },
    {
      title: 'Iluminación LED',
      description: 'Glows sutiles que transforman cualquier rincón.',
    },
    {
      title: 'Gift cards',
      description: 'Cuando quieres acertar sin invadir: libertad con cariño.',
    },
  ],
  moodboardImages: [],
  footer: {
    text: 'Tu presencia ya hace especial este día ✨\nEsto solo son pequeñas ideas para quienes quieran sorprenderla con algo que realmente conecte con su personalidad 💜',
  },
}
