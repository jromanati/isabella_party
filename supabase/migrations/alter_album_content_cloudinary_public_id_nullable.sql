-- Hacer cloudinary_public_id nullable para permitir URLs externas (Google Drive, etc.)
ALTER TABLE album_content 
ALTER COLUMN cloudinary_public_id DROP NOT NULL;

COMMENT ON COLUMN album_content.cloudinary_public_id IS 'ID público de Cloudinary (null para URLs externas)';
