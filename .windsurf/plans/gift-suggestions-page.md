# Página premium “Gustos de Isabella” (invitados)

Crear una nueva página premium, emocional y moderna (sin backend ni base de datos) para que familiares/amigos conozcan mejor los gustos de Isabella y así puedan elegir un detalle que conecte con su personalidad, sin sentirse como “lista de regalos”.

## Objetivos

- **No materialista**
  - Evitar lenguaje tipo “regalos”, “lista”, “comprar”.
  - Enfatizar: “pistas”, “gustos”, “vibes”, “detalles de su personalidad”.
- **Experiencia premium**
  - UI tipo Netflix anime / Pinterest / Spotify Wrapped: glassmorphism + glow morado elegante.
  - Responsive mobile-first con excelente jerarquía visual.
- **Editable fácil**
  - Toda la data vendrá de constantes / JSON local, fácil de reemplazar.

## Alcance técnico

- Next.js App Router + TypeScript + TailwindCSS + Framer Motion.
- Sin backend, sin Supabase, sin DB.
- Optimizada para Vercel.

## Ruta y acceso

- Ruta recomendada: **`/regalos`** (manteniendo el slug ya acordado, pero el contenido no será “lista”).
- En la landing, agregar un acceso **debajo de “Confirmar asistencia”** (card/botón premium) con copy emocional:
  - Título sugerido: “Conoce sus gustos”
  - Subtexto sugerido: “Pequeñas pistas para sorprenderla con algo que conecte con su esencia.”

## Estructura de la página `/regalos`

### 1) Hero (pantalla completa)

- Fondo oscuro premium con glow morado + overlay.
- Imagen principal de Isabella (placeholder local por ahora; fácil de reemplazar).
- Texto:
  - “¿Quieres sorprender a Isabella? ✨”
  - Subtexto emocional (según brief).
- CTA: “Explorar gustos” (scroll a la siguiente sección).
- Indicador de scroll elegante.

### 2) Colores favoritos

- Cards minimalistas con:
  - círculo grande
  - nombre del color
  - glow matching

### 3) Estilo y vibes

- Grid tipo Pinterest: cards con imagen placeholder + overlay.
- Hover premium suave (scale mínimo + glow).

### 4) Tallas

- Dashboard glassmorphism (cards o tabla premium).
- Campos: poleras, hoodies, pantalones, zapatillas, accesorios.

### 5) Cosas que ama

- Grid visual con iconos modernos + labels.
- Hover sutil.

### 6) Ideas generales (sin productos ni marcas)

- Cards por categorías (ejemplos: accesorios deportivos, papelería aesthetic, decoración, experiencias, etc.).
- Copy enfatiza que son ideas generales.

### 7) Moodboard

- Collage tipo Pinterest (masonry/grid) con placeholders.

### 8) Footer emocional

- Texto final (según brief) + glow suave.

## Data local (sin DB)

Definir un objeto central (constante o JSON local) con:

- `hero`: title, subtitle, ctaLabel
- `favoriteColors`: [{ name, hex, glow }]
- `vibes`: [{ title, imageSrc, tag? }]
- `sizes`: { poleras, hoodies, pantalones, zapatillas, accesorios }
- `loves`: [{ label, iconKey }]
- `generalIdeas`: [{ title, description }]
- `moodboardImages`: [{ src, alt }] (inicialmente vacío)
- `footer`: text

## Componentes reutilizables

- `PageShell` (fondo + glow + layout)
- `SectionHeader` (título + subtítulo)
- `GlassCard`
- `ColorOrb`
- `PinterestCard`
- `IconPill`
- `MasonryGrid`
- `FloatingParticles` (muy sutil)

## Animaciones (Framer Motion)

- Entradas suaves por sección (fade + y small) con `whileInView`.
- Hover premium: scale 1.02, glow sutil.
- Partículas flotantes: opacity baja + blur.
- Parallax MUY sutil en hero (translateY pequeño en fondo/overlay).
- Evitar exceso: pocas keyframes, nada agresivo.

## Milestones

1. **Definir data mock local** (constante/JSON) + placeholders de imágenes.
2. **Implementar `/regalos`** con secciones y componentes reutilizables.
3. **Animación y polish** (particles, hover, transiciones, parallax sutil).
4. **Integración en landing** (acceso debajo de “Confirmar asistencia”).
