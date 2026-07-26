-- Tabla de álbumes
CREATE TABLE IF NOT EXISTS albums (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'gallery' CHECK (type IN ('gallery', 'video')),
  cover_image TEXT,
  cover_thumbnail TEXT,
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by BIGINT
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_albums_type ON albums(type);
CREATE INDEX IF NOT EXISTS idx_albums_is_public ON albums(is_public);
CREATE INDEX IF NOT EXISTS idx_albums_is_featured ON albums(is_featured);
CREATE INDEX IF NOT EXISTS idx_albums_sort_order ON albums(sort_order);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_albums_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_albums_updated_at ON albums;
CREATE TRIGGER trigger_update_albums_updated_at
  BEFORE UPDATE ON albums
  FOR EACH ROW
  EXECUTE FUNCTION update_albums_updated_at();

-- Comentario sobre la tabla
COMMENT ON TABLE albums IS 'Álbumes de fotos y videos de la fiesta';
COMMENT ON COLUMN albums.type IS 'Tipo de álbum: gallery (imágenes y videos cortos) o video (video completo)';
COMMENT ON COLUMN albums.cover_image IS 'URL de Cloudinary para la imagen de portada del álbum';
COMMENT ON COLUMN albums.is_featured IS 'Indica si el álbum es destacado en la página principal';

-- Políticas de seguridad a nivel de fila (RLS)
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos (puedes ajustar según tus necesidades)
DROP POLICY IF EXISTS "Permitir lectura pública de álbumes" ON albums;
CREATE POLICY "Permitir lectura pública de álbumes" ON albums
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Política para permitir inserción (para API admin)
DROP POLICY IF EXISTS "Permitir inserción de álbumes" ON albums;
CREATE POLICY "Permitir inserción de álbumes" ON albums
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política para permitir actualización (para API admin)
DROP POLICY IF EXISTS "Permitir actualización de álbumes" ON albums;
CREATE POLICY "Permitir actualización de álbumes" ON albums
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Política para permitir eliminación (para API admin)
DROP POLICY IF EXISTS "Permitir eliminación de álbumes" ON albums;
CREATE POLICY "Permitir eliminación de álbumes" ON albums
  FOR DELETE
  TO anon, authenticated
  USING (true);
