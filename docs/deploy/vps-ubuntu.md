# Deploy em VPS Ubuntu (Docker Compose)

Stack recomendada: **Ubuntu 22.04/24.04** + Docker + Compose. App e Ollama no mesmo servidor; modelos baixados automaticamente no primeiro `up`.

## Hardware

| Recurso | Recomendado |
|---------|------------|
| RAM | **8 GB** (mínimo 4 GB só para testes leves) |
| vCPU | 2+ |
| Disco | 25 GB+ SSD |

```bash
# swap 2G (útil com 4–8 GB RAM)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 1. Docker no Ubuntu

```bash
sudo apt update && sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker "$USER"
# logout/login para usar docker sem sudo
```

## 2. Clonar e configurar

```bash
git clone <seu-repo> knowpilot && cd knowpilot
cp .env.production.example .env
nano .env   # AUTH_SECRET e AUTH_URL
```

Gerar segredo:

```bash
openssl rand -base64 32
```

`AUTH_URL` deve ser a URL pública final com **https** (ex.: `https://app.seudominio.com`).

## 3. Subir a stack (produção)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f ollama
```

Na **primeira vez**, o serviço `ollama` pode levar **5–15 min** puxando modelos. A `app` só inicia quando o healthcheck passar.

Verificar:

```bash
curl -s http://127.0.0.1:3003/api/health
# {"status":"ok","ollama":true}
```

## 4. HTTPS com Caddy (exemplo)

```bash
sudo apt install -y caddy
sudo nano /etc/caddy/Caddyfile
```

```caddy
app.seudominio.com {
    reverse_proxy 127.0.0.1:3003
}
```

```bash
sudo systemctl reload caddy
```

## 5. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80,443/tcp
sudo ufw enable
```

Não exponha a porta **11434** (Ollama) na internet — o overlay `docker-compose.prod.yml` já remove o publish.

## 6. Atualizar deploy

```bash
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Volumes `app_data` e `ollama_data` preservam SQLite e modelos.

## 7. Backup do SQLite

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec app ls -la /app/data
# backup manual do volume:
docker run --rm -v knowpilot_app_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/app-data-$(date +%F).tar.gz -C /data .
```

(Ajuste o prefixo do volume: `docker volume ls | grep app_data`.)

## 8. Widget em produção

No dashboard, em **Widget**, adicione as origens HTTPS dos sites que embutem o chat.

## Variáveis principais

Ver [`.env.production.example`](../../.env.production.example) e [`.env.example`](../../.env.example).

## Coolify

Se preferir painel em vez de SSH direto, o mesmo `docker-compose.yml` funciona — ver [`coolify.md`](coolify.md).
