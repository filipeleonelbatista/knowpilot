# KB Chat — Base de Conhecimento + Ollama

SaaS para gerenciar base de conhecimento, configurar atendente IA (Ollama local) e publicar widget de chat embeddable. Respostas **somente** com RAG sobre a KB.

MIT License — for study purposes.

## Features

- Cadastro/login multi-organização (Auth.js)
- CRUD de documentos com indexação vetorial (embeddings Ollama)
- Configuração do atendente (nome, personalidade, fallback humano)
- Widget JS + Shadow DOM (`/widget/v1.js`)
- Fila de inferência com limites Free/Pro
- LP Plano Pro (R$ 90) + captura de leads (sem checkout)

## Requisitos

- Node 20+
- pnpm 10+
- Ollama (local ou Docker)

## Desenvolvimento

```bash
cp .env.example .env.local
# Edite AUTH_SECRET (openssl rand -base64 32)

pnpm install
# Build native module if needed:
# cd node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3 && npm run build-release

pnpm db:migrate
pnpm db:seed          # demo user + 3 orgs (25 docs each); indexes via Ollama if up
pnpm db:seed:fast     # same without embeddings (use db:seed:index later)
pnpm db:seed:index    # index seed KB after Ollama is up
pnpm db:seed:minimal  # 2º usuário: 1 org, 5 docs, atendente configurado
pnpm dev
```

Ver [Credenciais de seed](#credenciais-de-seed) abaixo.

Abra [http://localhost:3000](http://localhost:3000).

### Modelos Ollama

No **Docker Compose**, os modelos são baixados automaticamente pelo container `ollama`.

Em dev local (Ollama instalado no host):

```bash
./scripts/pull-models.sh
```

## Testes

```bash
pnpm test
pnpm test:e2e   # requer app rodando
```

## Deploy em VPS Ubuntu (recomendado)

Guia completo: [`docs/deploy/vps-ubuntu.md`](docs/deploy/vps-ubuntu.md)

```bash
cp .env.production.example .env   # AUTH_SECRET + AUTH_URL=https://seu-dominio
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Ollama baixa os modelos sozinho no primeiro `up`. Em produção a app fica em `127.0.0.1:3003` no host (porta interna do container: 3000; use Caddy/Nginx + TLS).

### Coolify (alternativa)

[`docs/deploy/coolify.md`](docs/deploy/coolify.md)

### Capacidade (1 vCPU / 4GB RAM)

| Métrica                    | Valor sustentável              |
| -------------------------- | ------------------------------ |
| Inferências IA simultâneas | **1** (global)                 |
| Fila Free                  | até **3**                      |
| Fila Pro                   | até **8** (prioridade na fila) |

Pro não aumenta hardware neste MVP — prioridade na fila e limites maiores.

Detalhes de swap, Caddy e firewall: [`docs/deploy/vps-ubuntu.md`](docs/deploy/vps-ubuntu.md).

## Estrutura

- `src/lib/rag/` — pipeline RAG
- `src/lib/concurrency/` — fila Ollama
- `widget/` — bundle embed
- `docs/superpowers/plans/` — planos de implementação

## Variáveis de ambiente

Ver [`.env.example`](.env.example).

## Credenciais de seed

### Seed completo (`pnpm db:seed`)

| Campo | Valor                |
| ----- | -------------------- |
| Email | demo@knowpilot.local |
| Senha | demo123456           |
| Orgs  | `petvida`, `sabor-arte`, `ironfit` (25 docs cada) |

### Seed minimal (`pnpm db:seed:minimal`)

| Campo | Valor                   |
| ----- | ----------------------- |
| Email | starter@knowpilot.local |
| Senha | starter123456           |
| Org   | `techstart` (5 docs, atendente **Nuve**, widget e fallback prontos) |

Recriar: `pnpm db:seed:minimal:force`. Indexar depois: `SEED_USER_EMAIL=starter@knowpilot.local pnpm db:seed:index`.
