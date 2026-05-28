#!/bin/sh
set -eu

CHAT_MODEL="${OLLAMA_CHAT_MODEL:-qwen2.5:3b-instruct-q4_K_M}"
EMBED_MODEL="${OLLAMA_EMBED_MODEL:-nomic-embed-text}"

echo "[ollama] Starting server…"
ollama serve &
SERVE_PID=$!

echo "[ollama] Waiting for API…"
TRIES=0
until ollama list >/dev/null 2>&1; do
  TRIES=$((TRIES + 1))
  if [ "$TRIES" -gt 90 ]; then
    echo "[ollama] API did not become ready in time" >&2
    exit 1
  fi
  sleep 2
done

model_ready() {
  ollama list 2>/dev/null | grep -Fq "$1"
}

pull_model() {
  model="$1"
  if model_ready "$model"; then
    echo "[ollama] Model already present: $model"
    return 0
  fi
  echo "[ollama] Pulling $model (first run may take several minutes)…"
  ollama pull "$model"
}

pull_model "$CHAT_MODEL"
pull_model "$EMBED_MODEL"

echo "[ollama] Models ready: $CHAT_MODEL, $EMBED_MODEL"
wait "$SERVE_PID"
