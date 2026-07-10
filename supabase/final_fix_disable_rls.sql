-- Solución definitiva: Deshabilitar RLS completamente para guest_messages
-- Esto permitirá que el GuestMessageAdapter funcione sin problemas

-- 1. Deshabilitar RLS completamente
alter table guest_messages disable row level security;

-- 2. Verificar que RLS está deshabilitado
select 
  tablename,
  rowsecurity 
from pg_tables 
where schemaname = 'public' and tablename = 'guest_messages';

-- 3. Opcional: Crear índice si no existe para mejor rendimiento
create index if not exists guest_messages_created_at_idx 
on guest_messages(created_at desc);

-- 4. Confirmación
select 'RLS deshabilitado completamente - guest_messages ahora funciona sin restricciones' as status;
