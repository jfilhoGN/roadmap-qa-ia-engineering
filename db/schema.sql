-- Roadmap QA IA — schema do banco (Supabase / Postgres)
-- Rode este script primeiro, no SQL Editor do Supabase.

create extension if not exists "pgcrypto";

-- Usuários (login próprio por usuário/senha)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  is_admin boolean not null default false,
  must_change_password boolean not null default true,
  created_at timestamptz not null default now()
);

-- Progresso do roadmap (substitui o localStorage); 1 linha por tópico concluído
create table if not exists progress (
  user_id uuid not null references users(id) on delete cascade,
  topic_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);

-- Anotações do colaborador (um documento markdown por usuário)
create table if not exists notes (
  user_id uuid primary key references users(id) on delete cascade,
  content text not null default '',
  updated_at timestamptz not null default now()
);

-- Próximos estudos (checklist)
create table if not exists study_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  text text not null,
  done boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists study_items_user_idx on study_items (user_id);
