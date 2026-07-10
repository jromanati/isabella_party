-- Script para deshabilitar RLS temporalmente en guest_messages
-- Usar solo para pruebas si las políticas están causando problemas

-- Deshabilitar RLS completamente (temporal)
alter table guest_messages disable row level security;

-- Nota: Esto deshabilita TODAS las políticas de RLS temporalmente
-- Para producción, necesitarás:
-- 1. Configurar autenticación correctamente
-- 2. Volver a habilitar RLS: alter table guest_messages enable row level security;
-- 3. Crear políticas adecuadas con auth.role() = 'authenticated'
