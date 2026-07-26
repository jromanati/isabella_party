-- Tabla de contenido de álbumes (fotos y videos)
CREATE TABLE IF NOT EXISTS album_content (
  id BIGSERIAL PRIMARY KEY,
  album_id BIGINT NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  cloudinary_public_id VARCHAR(255) NOT NULL,
  cloudinary_secure_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  description TEXT,
  content_type VARCHAR(50) DEFAULT 'image' CHECK (content_type IN ('image', 'video')),
  duration INTEGER, -- Duración en segundos para videos
  file_size BIGINT, -- Tamaño del archivo en bytes
  width INTEGER,
  height INTEGER,
  format VARCHAR(50), -- jpg, png, mp4, etc.
  sort_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false, -- Indica si es la imagen de portada del álbum
  metadata JSONB DEFAULT '{}',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by BIGINT, -- ID del usuario/admin que subió el contenido
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'hidden'))
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_album_content_album_id ON album_content(album_id);
CREATE INDEX IF NOT EXISTS idx_album_content_content_type ON album_content(content_type);
CREATE INDEX IF NOT EXISTS idx_album_content_sort_order ON album_content(album_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_album_content_status ON album_content(status);
CREATE INDEX IF NOT EXISTS idx_album_content_is_cover ON album_content(is_cover);

-- Trigger para actualizar la portada del álbum cuando se marca una foto como cover
CREATE OR REPLACE FUNCTION update_album_cover()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_cover = true THEN
    -- Desmarcar otras fotos como cover en el mismo álbum
    UPDATE album_content 
    SET is_cover = false 
    WHERE album_id = NEW.album_id AND id != NEW.id;
    
    -- Actualizar la portada del álbum
    UPDATE albums 
    SET cover_image = NEW.cloudinary_secure_url,
        cover_thumbnail = NEW.thumbnail_url,
        updated_at = NOW()
    WHERE id = NEW.album_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_album_cover ON album_content;
CREATE TRIGGER trigger_update_album_cover
  AFTER INSERT OR UPDATE OF is_cover ON album_content
  FOR EACH ROW
  EXECUTE FUNCTION update_album_cover();

-- Comentario sobre la tabla
COMMENT ON TABLE album_content IS 'Contenido (fotos y videos) de los álbumes';
COMMENT ON COLUMN album_content.content_type IS 'Tipo de contenido: image o video';
COMMENT ON COLUMN album_content.duration IS 'Duración en segundos para videos';
COMMENT ON COLUMN album_content.is_cover IS 'Indica si este contenido es la portada del álbum';
COMMENT ON COLUMN album_content.status IS 'Estado del contenido: active, deleted, hidden';

-- Políticas de seguridad a nivel de fila (RLS)
ALTER TABLE album_content ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos
DROP POLICY IF EXISTS "Permitir lectura pública de contenido de álbumes" ON album_content;
CREATE POLICY "Permitir lectura pública de contenido de álbumes" ON album_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Política para permitir inserción (para API admin)
DROP POLICY IF EXISTS "Permitir inserción de contenido" ON album_content;
CREATE POLICY "Permitir inserción de contenido" ON album_content
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política para permitir actualización (para API admin)
DROP POLICY IF EXISTS "Permitir actualización de contenido" ON album_content;
CREATE POLICY "Permitir actualización de contenido" ON album_content
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Política para permitir eliminación (para API admin)
DROP POLICY IF EXISTS "Permitir eliminación de contenido" ON album_content;
CREATE POLICY "Permitir eliminación de contenido" ON album_content
  FOR DELETE
  TO anon, authenticated
  USING (true);
