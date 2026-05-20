create table if not exists song_requests (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  raw_song text not null,
  song_title text,
  artist_name text,
  album_image_url text,
  preview_url text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  played_at timestamptz
);

alter table song_requests
  drop constraint if exists song_requests_status_check;

alter table song_requests
  add constraint song_requests_status_check
  check (status in ('pending', 'playing', 'played', 'rejected'));

create index if not exists song_requests_status_idx on song_requests (status);
create index if not exists song_requests_created_at_idx on song_requests (created_at);
create index if not exists song_requests_preview_url_idx on song_requests (preview_url);
