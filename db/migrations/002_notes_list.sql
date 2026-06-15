-- Migração 002: anotações como LISTA (várias notas por usuário) com título e datas.
-- Rode UMA vez no SQL Editor do Supabase. Migra o conteúdo antigo (1 bloco por
-- usuário) para uma nota, se existir, e não perde dados.

alter table if exists notes rename to notes_old;

create table notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null default 'Sem título',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists notes_user_idx on notes (user_id);

-- Migra conteúdo antigo (se a tabela antiga tinha a estrutura de 1 bloco)
insert into notes (user_id, title, content)
select user_id, 'Minhas anotações', content
from notes_old
where coalesce(content, '') <> '';

drop table if exists notes_old;
