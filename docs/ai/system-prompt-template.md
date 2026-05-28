# Modelo de system prompt do atendente

Variáveis: `{attendant_name}`, `{personality}`, `{tone}`, `{characteristics}`, `{extra_instructions}`, `{fallback_message}`, `{fallback_email}`, `{fallback_phone}`, `<contexto>`.

Regras:
- Responder apenas com fatos do `<contexto>`
- Se insuficiente, usar `{fallback_message}` e contato humano
- Sempre em português do Brasil

Implementação: `src/lib/rag/prompt.ts`
