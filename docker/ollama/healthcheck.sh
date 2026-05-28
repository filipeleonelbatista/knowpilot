#!/bin/sh
set -eu

CHAT_MODEL="${OLLAMA_CHAT_MODEL:-qwen2.5:3b-instruct-q4_K_M}"
EMBED_MODEL="${OLLAMA_EMBED_MODEL:-nomic-embed-text}"

ollama list >/dev/null 2>&1 || exit 1
ollama list | grep -Fq "$CHAT_MODEL" || exit 1
ollama list | grep -Fq "$EMBED_MODEL" || exit 1
exit 0
