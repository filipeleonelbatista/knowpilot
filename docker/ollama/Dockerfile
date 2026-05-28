FROM ollama/ollama:latest

ENV OLLAMA_CHAT_MODEL=qwen2.5:3b-instruct-q4_K_M
ENV OLLAMA_EMBED_MODEL=nomic-embed-text
ENV OLLAMA_MAX_LOADED_MODELS=1

COPY docker/ollama/entrypoint.sh /entrypoint.sh
COPY docker/ollama/healthcheck.sh /healthcheck.sh
RUN chmod +x /entrypoint.sh /healthcheck.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=600s --retries=5 \
  CMD ["/healthcheck.sh"]

ENTRYPOINT ["/entrypoint.sh"]
