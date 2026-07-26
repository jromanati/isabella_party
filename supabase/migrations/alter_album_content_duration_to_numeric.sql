-- Cambiar el tipo de dato de duration de INTEGER a NUMERIC para aceptar valores decimales
-- Cloudinary devuelve la duración de videos como números decimales (ej: 28.501667 segundos)

ALTER TABLE album_content 
ALTER COLUMN duration TYPE NUMERIC USING duration::NUMERIC;

-- Actualizar el comentario del campo
COMMENT ON COLUMN album_content.duration IS 'Duración en segundos para videos (valor decimal)';
