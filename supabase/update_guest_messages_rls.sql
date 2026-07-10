-- Script para actualizar políticas RLS de la tabla guest_messages existente
-- Ejecutar solo si la tabla ya existe

-- Eliminar políticas existentes si existen
drop policy if exists "Public read access to approved messages" on guest_messages;
drop policy if exists "Users can insert messages" on guest_messages;
drop policy if exists "Admins can update messages" on guest_messages;
drop policy if exists "Admins can delete messages" on guest_messages;

-- Asegurar que RLS está habilitado
alter table guest_messages enable row level security;

-- Política para lectura pública (solo mensajes aprobados y públicos)
create policy "Public read access to approved messages"
  on guest_messages for select
  using (is_public = true and status = 'approved');

-- Política para inserción (permitir temporalmente sin autenticación para pruebas)
create policy "Users can insert messages"
  on guest_messages for insert
  with check (true);

-- Política para actualización (solo administradores pueden actualizar)
create policy "Admins can update messages"
  on guest_messages for update
  using (false);

-- Política para eliminación (solo administradores pueden eliminar)
create policy "Admins can delete messages"
  on guest_messages for delete
  using (false);

-- Actualizar restricciones si es necesario
-- Restricciones para el campo status
alter table guest_messages
  drop constraint if exists guest_messages_status_check;

alter table guest_messages
  add constraint guest_messages_status_check
  check (status in ('pending', 'approved', 'rejected', 'hidden'));

-- Restricciones para el campo recipient_type
alter table guest_messages
  drop constraint if exists guest_messages_recipient_type_check;

alter table guest_messages
  add constraint guest_messages_recipient_type_check
  check (recipient_type in ('birthday_girl', 'family', 'friends', 'couple', 'general'));

-- Restricciones para el campo message_type
alter table guest_messages
  drop constraint if exists guest_messages_message_type_check;

alter table guest_messages
  add constraint guest_messages_message_type_check
  check (message_type in ('text', 'wishes', 'memory', 'advice', 'toast', 'dedication'));

-- Restricciones para el campo ai_moderation_result
alter table guest_messages
  drop constraint if exists guest_messages_ai_moderation_result_check;

alter table guest_messages
  add constraint guest_messages_ai_moderation_result_check
  check (ai_moderation_result in ('pending', 'approved', 'rejected', 'manual_review'));

-- Crear índices si no existen
create index if not exists guest_messages_status_idx on guest_messages(status);
create index if not exists guest_messages_is_public_idx on guest_messages(is_public);
create index if not exists guest_messages_recipient_type_idx on guest_messages(recipient_type);
create index if not exists guest_messages_message_type_idx on guest_messages(message_type);
create index if not exists guest_messages_created_at_idx on guest_messages(created_at desc);
create index if not exists guest_messages_guest_idx on guest_messages(guest);
