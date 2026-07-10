-- Script para eliminar y recrear la tabla guest_messages desde cero
-- Esto resolverá todos los problemas de configuración

-- 1. Eliminar la tabla existente (si existe)
drop table if exists guest_messages cascade;

-- 2. Crear la tabla con estructura correcta
create table guest_messages (
  id uuid primary key default gen_random_uuid(),
  guest uuid references guests(id) on delete set null,
  recipient_type text not null default 'celebrant',
  title text not null,
  message text not null,
  message_type text not null default 'text',
  is_public boolean not null default true,
  status text not null default 'pending',
  rejection_reason text,
  ai_moderation_result text not null default 'pending',
  ai_moderation_reason text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Crear trigger para updated_at
create trigger guest_messages_updated_at
  before update on guest_messages
  for each row
  execute procedure update_updated_at_column();

-- 4. Restricciones CHECK
alter table guest_messages
  add constraint guest_messages_status_check
  check (status in ('pending', 'approved', 'rejected', 'hidden'));

alter table guest_messages
  add constraint guest_messages_recipient_type_check
  check (recipient_type in ('celebrant', 'couple', 'family', 'friends', 'all'));

alter table guest_messages
  add constraint guest_messages_message_type_check
  check (message_type in ('text'));

alter table guest_messages
  add constraint guest_messages_ai_moderation_result_check
  check (ai_moderation_result in ('pending', 'approved', 'rejected', 'manual_review'));

-- 5. Índices para optimización
create index guest_messages_status_idx on guest_messages(status);
create index guest_messages_is_public_idx on guest_messages(is_public);
create index guest_messages_recipient_type_idx on guest_messages(recipient_type);
create index guest_messages_created_at_idx on guest_messages(created_at desc);
create index guest_messages_guest_idx on guest_messages(guest);

-- 6. Habilitar RLS
alter table guest_messages enable row level security;

-- 7. Políticas de RLS
-- Lectura pública (solo mensajes aprobados y públicos)
create policy "Public read access to approved messages"
  on guest_messages for select
  using (is_public = true and status = 'approved');

-- Inserción (permitir temporalmente para pruebas)
create policy "Users can insert messages"
  on guest_messages for insert
  with check (true);

-- Actualización (solo administradores)
create policy "Admins can update messages"
  on guest_messages for update
  using (false);

-- Eliminación (solo administradores)
create policy "Admins can delete messages"
  on guest_messages for delete
  using (false);

-- 8. Confirmación
select 'Tabla guest_messages recreada exitosamente' as status;
