# Roadmap de IA para QAs — COE Qualidade

Aplicação web (Next.js) com um **roadmap dinâmico** que leva o time de QA do
básico ao especialista em IA. Cada tópico traz:

- **O que é** — explicação simples do termo técnico;
- **Por que importa para o QA** — a conexão com o nosso trabalho;
- **Exemplo aplicado a QA** — um caso concreto;
- **Prompt para experimentar** — pronto para copiar e testar.

O progresso de cada pessoa é salvo no **localStorage** do navegador (sem
backend, sem login).

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- TypeScript
- Tailwind CSS v4

## Rodar localmente

```bash
pnpm install
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
3. A Vercel detecta o Next.js automaticamente. Não há variáveis de ambiente.
4. Clique em **Deploy**. Pronto — compartilhe a URL com o time.

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
