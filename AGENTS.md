# KB Chat — Agent Context

SaaS de base de conhecimento com chat RAG via Ollama local.

## Stack

- Next.js 16 App Router, TypeScript, Tailwind 4
- Auth.js v5 (credentials + JWT)
- Drizzle ORM + SQLite (better-sqlite3)
- Ollama (`/api/chat`, `/api/embed`)
- Widget embed: `public/widget/v1.js` (Shadow DOM)

## Commands

```bash
pnpm install
pnpm db:migrate
pnpm dev
pnpm test
pnpm build:widget && pnpm build
docker compose up --build
```

## Architecture

- `src/lib/rag/` — chunk, retrieve, prompt, chat pipeline
- `src/lib/concurrency/inference-queue.ts` — global Ollama semaphore + Pro priority
- `src/app/api/public/` — widget chat + pro leads
- `src/app/api/orgs/` — authenticated org APIs

## Conventions

- TDD for `lib/rag`, `lib/concurrency`, `lib/auth/permissions`
- Route handlers orchestrate only; logic in `lib/`
- RAG answers ONLY from KB context; fallback to human contact
- Plans: `docs/superpowers/plans/`

## VPS defaults

- 1 concurrent Ollama inference globally
- Free queue max 3, Pro max 8
- Models: `qwen2.5:3b-instruct-q4_K_M`, `nomic-embed-text`
