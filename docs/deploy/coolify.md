# Deploy no Coolify

O projeto já inclui `Dockerfile` (Next.js standalone + `better-sqlite3`) e `docker-compose.yml` (app + Ollama). No Coolify você pode usar **Docker Compose** (recomendado) ou só o **Dockerfile** da app (Ollama em outro lugar).

## Requisitos do servidor

| Recurso | Mínimo recomendado |
|--------|---------------------|
| RAM | **8 GB** (app ~600 MB + Ollama/Qwen 3B ~2–3 GB + SO) |
| CPU | 2 vCPUs |
| Disco | 15 GB+ (modelos Ollama + volume SQLite) |

Com apenas a app (Ollama externo), 2 GB RAM pode bastar para testes — chat/embeddings exigem Ollama acessível.

## Opção A — Docker Compose (app + Ollama)

1. No Coolify: **Project → Add Resource → Docker Compose**
2. Conecte o repositório Git ou cole o `docker-compose.yml`
3. **Build Pack**: Docker Compose
4. Domínio HTTPS no serviço **app** (porta **3000**)
5. Variáveis de ambiente (aba Environment — não commitar segredos):

| Variável | Exemplo | Obrigatório |
|----------|---------|-------------|
| `AUTH_SECRET` | `openssl rand -base64 32` | Sim |
| `AUTH_URL` | `https://seu-dominio.com` | Sim (URL pública com HTTPS) |
| `DATABASE_URL` | `file:/app/data/app.db` | Sim (já no compose) |
| `OLLAMA_BASE_URL` | `http://ollama:11434` | Sim (nome do serviço no compose) |
| `RUN_MIGRATIONS` | `1` | Sim (roda migrations no start) |

6. **Volume persistente** no serviço `app`:
   - Mount: `/app/data` → volume nomeado (ex.: `app_data`)
   - Sem isso o SQLite é perdido a cada redeploy.

7. **Volume** no serviço `ollama`:
   - `/root/.ollama` → volume `ollama_data` (modelos baixados)

8. **Modelos Ollama** — o serviço `ollama` usa `docker/ollama/Dockerfile` com entrypoint que faz `ollama pull` automaticamente na primeira subida (volume `ollama_data` evita baixar de novo). O serviço `app` só sobe quando o healthcheck do Ollama confirma os dois modelos (~5–15 min na primeira vez; `start_period` até 600s).

9. Health check no Coolify (app): `GET /api/health` — retorna `{ status: "ok", ollama: true|false }`.

### Proxy / portas

O Coolify gerencia TLS no proxy. Você pode **remover** `ports: "3000:3000"` do compose em produção e deixar só o domínio no painel; o importante é informar a porta interna **3000** no recurso.

## Opção B — Só a app (Ollama em outro servidor)

1. Resource tipo **Dockerfile** apontando para o repositório
2. Porta **3000**, volume em `/app/data`
3. Env:

```env
AUTH_SECRET=...
AUTH_URL=https://seu-dominio.com
DATABASE_URL=file:/app/data/app.db
OLLAMA_BASE_URL=https://ollama.seu-dominio.com
RUN_MIGRATIONS=1
```

4. No servidor Ollama, libere acesso à API (`/api/embed`, `/api/chat`) a partir do IP da app.

## Widget em produção

Cada **widget key** guarda `allowedOrigins` (JSON). Após o deploy, em **Configurações → Widget**, adicione o domínio do site cliente, por exemplo:

`https://www.seusite.com`

O snippet usa `AUTH_URL` / domínio da app KnowPilot, não o site embedado.

## Seeds (opcional)

No terminal do container **app** (uma vez):

```bash
# requer node/pnpm no image de build — em produção prefira cadastro manual
# ou rode seed localmente apontando DATABASE_URL para backup do volume
```

Para demo, rode seeds na máquina de dev e copie `data/app.db` para o volume, ou implemente um job one-off. O image de produção só inclui `node server.js` (sem pnpm).

## Checklist rápido

- [ ] `AUTH_SECRET` forte e único
- [ ] `AUTH_URL` = URL pública exata (com `https://`)
- [ ] Volume `/app/data` persistente
- [ ] Ollama acessível e modelos puxados
- [ ] `GET /api/health` → `ollama: true`
- [ ] Domínio + SSL no Coolify
- [ ] Origens do widget atualizadas para sites reais

## Auth.js atrás do proxy

`trustHost: true` já está habilitado em `src/lib/auth/index.ts` — adequado para Coolify/Traefik.

## Referências no repo

- `Dockerfile` — build multi-stage, migrations no boot
- `docker-compose.yml` — stack local / Coolify Compose
- `.env.example` — lista completa de variáveis
