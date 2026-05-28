#!/usr/bin/env bash
set -euo pipefail

OLLAMA_HOST="${OLLAMA_HOST:-http://localhost:11434}"
CHAT_MODEL="${OLLAMA_CHAT_MODEL:-qwen2.5:3b-instruct-q4_K_M}"
EMBED_MODEL="${OLLAMA_EMBED_MODEL:-nomic-embed-text}"

echo "Pulling chat model (${CHAT_MODEL})…"
curl -sf "${OLLAMA_HOST}/api/pull" -d "{\"name\":\"${CHAT_MODEL}\"}"

echo "Pulling embedding model (${EMBED_MODEL})…"
curl -sf "${OLLAMA_HOST}/api/pull" -d "{\"name\":\"${EMBED_MODEL}\"}"

echo "Done."
