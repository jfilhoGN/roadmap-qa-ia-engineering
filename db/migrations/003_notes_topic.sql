-- Migração 003: vincular uma anotação a um tópico do roadmap.
-- Permite a anotação lateral no modal de estudo (1 nota por tópico por usuário).

alter table notes add column if not exists topic_id text;

-- Garante no máximo 1 nota por (usuário, tópico) quando topic_id existe.
create unique index if not exists notes_user_topic_uidx
  on notes (user_id, topic_id)
  where topic_id is not null;
