-- Tabla para mensajes de invitados
create table if not exists guest_messages (
  id uuid primary key default gen_random_uuid(),
  guest uuid references guests(id),
  recipient_type text not null default 'birthday_girl',
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

-- Índices para optimizar consultas
create index if not exists guest_messages_status_idx on guest_messages(status);
create index if not exists guest_messages_is_public_idx on guest_messages(is_public);
create index if not exists guest_messages_recipient_type_idx on guest_messages(recipient_type);
create index if not exists guest_messages_message_type_idx on guest_messages(message_type);
create index if not exists guest_messages_created_at_idx on guest_messages(created_at desc);
create index if not exists guest_messages_guest_idx on guest_messages(guest);

-- Trigger para actualizar updated_at automáticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger guest_messages_updated_at
  before update on guest_messages
  for each row
  execute function update_updated_at_column();

-- Políticas de RLS (Row Level Security)
-- Habilitar RLS
alter table guest_messages enable row level security;

-- Política para lectura pública (solo mensajes aprobados y públicos)
create policy "Public read access to approved messages"
  on guest_messages for select
  using (is_public = true and status = 'approved');

-- Política para inserción (usuarios autenticados pueden crear mensajes)
create policy "Users can insert messages"
  on guest_messages for insert
  with check (auth.role() = 'authenticated');

-- Política para actualización (solo administradores pueden actualizar)
create policy "Admins can update messages"
  on guest_messages for update
  using (false);

-- Política para eliminación (solo administradores pueden eliminar)
create policy "Admins can delete messages"
  on guest_messages for delete
  using (false);

-- Comentarios para documentación
comment on table guest_messages is 'Tabla para almacenar mensajes de invitados al evento';
comment on column guest_messages.id is 'Identificador único del mensaje';
comment on column guest_messages.guest is 'Referencia al invitado que envió el mensaje';
comment on column guest_messages.recipient_type is 'Tipo de destinatario (birthday_girl, family, friends, couple, general)';
comment on column guest_messages.title is 'Título del mensaje';
comment on column guest_messages.message is 'Contenido del mensaje';
comment on column guest_messages.message_type is 'Tipo de mensaje (text, wishes, memory, advice, toast, dedication)';
comment on column guest_messages.is_public is 'Indica si el mensaje es público';
comment on column guest_messages.status is 'Estado del mensaje (pending, approved, rejected, hidden)';
comment on column guest_messages.rejection_reason is 'Motivo de rechazo del mensaje';
comment on column guest_messages.ai_moderation_result is 'Resultado de la moderación por IA';
comment on column guest_messages.ai_moderation_reason is 'Motivo de la moderación por IA';
comment on column guest_messages.metadata is 'Metadatos adicionales en formato JSON';
comment on column guest_messages.created_at is 'Fecha de creación del mensaje';
comment on column guest_messages.updated_at is 'Fecha de última actualización del mensaje';
