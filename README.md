# Roadmap de IA para QAs — COE Qualidade

Aplicação web (Next.js) com um **roadmap dinâmico** que leva o time de QA do
básico ao especialista em IA. Cada tópico traz:

- **O que é** — explicação simples do termo técnico;
- **Por que importa para o QA** — a conexão com o nosso trabalho;
- **Exemplo aplicado a QA** — um caso concreto;
- **Prompt para experimentar** — pronto para copiar e testar.

Agora com **login por usuário/senha**, progresso e dados salvos no
**Supabase (Postgres)**, **anotações** (markdown), **próximos estudos**
(checklist) e **relatório de progresso** para administradores.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- TypeScript · Tailwind CSS v4
- Supabase (Postgres) via `postgres.js`
- Auth própria: `bcryptjs` (hash de senha) + sessão JWT (`jose`) em cookie httpOnly

## Banco de dados e autenticação (Supabase)

1. **Variáveis de ambiente** — copie `.env.local.example` para `.env.local` e preencha:
   - `DATABASE_URL` — connection string do Supabase (use a do **pooler**, modo
     *Transaction*, porta 6543). O `@` da senha vira `%40` na URL.
   - `SESSION_SECRET` — string aleatória longa. Gere com:
     `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`
2. **Criar as tabelas** — no Supabase, SQL Editor, rode o conteúdo de
   [`db/schema.sql`](db/schema.sql).
3. **Cadastrar os usuários** — rode o conteúdo de `db/seed.sql` (gerado
   localmente, fora do git; senhas já com hash bcrypt). No 1º acesso cada
   usuário define a própria senha.
4. **Admins** (veem o relatório de todos): `joao.martins` e `raphael.alencar`.

> Segurança: `.env.local` e `db/seed.sql` estão no `.gitignore` e nunca vão
> para o repositório. Se a senha do banco já circulou em texto puro, troque-a
> no Supabase (Settings → Database → Reset database password).

Para regenerar o `db/seed.sql` (ex.: novos usuários), edite e rode o gerador de
hashes que cria o arquivo a partir das senhas em texto puro (mantido fora do repo).

## Rodar localmente

```bash
pnpm install
# configure o .env.local (ver acima) e rode db/schema.sql + db/seed.sql no Supabase
pnpm dev
# abre http://localhost:3000
```

Build de produção:

```bash
pnpm build && pnpm start
```

## Deploy na Vercel

1. Suba este projeto para um repositório (GitHub/GitLab/Bitbucket):
   ```bash
   git init && git add . && git commit -m "Roadmap IA para QAs"
   git remote add origin <URL_DO_SEU_REPO> && git push -u origin main
   ```
2. Acesse [vercel.com](https://vercel.com) → **Add New Project** → importe o repo.
3. Em **Settings → Environment Variables**, configure (para Production e Preview):
   - `DATABASE_URL` — connection string do pooler do Supabase (porta 6543).
   - `SESSION_SECRET` — a mesma string aleatória usada no `.env.local`.
4. Garanta que o `db/schema.sql` e o `db/seed.sql` já foram rodados no Supabase.
5. Clique em **Deploy**. Pronto — compartilhe a URL com o time.

> Alternativa via CLI: `npm i -g vercel` e depois `vercel` na raiz do projeto.

## Como editar o conteúdo

Todo o conteúdo do roadmap vive em um único arquivo:
[`data/roadmap.ts`](data/roadmap.ts).

- Cada **nível** (`Section`) tem `title`, `subtitle`, `goal` e uma lista de `topics`.
- Cada **tópico** (`Topic`) tem os campos descritos acima.
- Para adicionar um tópico, copie um objeto existente e ajuste os campos.
- Para adicionar um nível novo, crie uma nova `Section` e um valor em
  `LEVEL_META`.

Não é preciso mexer em nenhum componente para mudar o conteúdo.

## Estrutura

```
app/            layout, página e estilos globais
components/      RoadmapClient (o mapa) e TopicDetail (o painel lateral)
data/roadmap.ts CONTEÚDO — edite aqui
lib/progress.ts persistência de progresso (localStorage)
```
