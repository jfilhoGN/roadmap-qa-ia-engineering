-- 004: área do colaborador (trilhas QA / Agilidade)
-- Usuários existentes são todos do COE Qualidade -> default 'qa'.
-- Novos agilistas devem ser inseridos com area = 'agilidade'.

alter table users
  add column if not exists area text not null default 'qa'
  check (area in ('qa', 'agilidade'));
