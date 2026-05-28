export type AttendantPromptConfig = {
  name: string;
  personality: string;
  tone: string;
  characteristics: string;
  extraInstructions: string;
  fallbackMessage: string;
  fallbackEmail?: string | null;
  fallbackPhone?: string | null;
};

export function buildSystemPrompt(
  config: AttendantPromptConfig,
  contextChunks: string[],
): string {
  const context =
    contextChunks.length > 0
      ? contextChunks.map((c, i) => `[${i + 1}] ${c}`).join("\n\n")
      : "(vazio)";

  const contactParts: string[] = [];
  if (config.fallbackEmail) contactParts.push(`E-mail: ${config.fallbackEmail}`);
  if (config.fallbackPhone) contactParts.push(`Telefone: ${config.fallbackPhone}`);
  const contactLine =
    contactParts.length > 0
      ? contactParts.join(" | ")
      : "não configurado";

  const extraBlock = config.extraInstructions
    ? `Instruções extras: ${config.extraInstructions}\n`
    : "";

  return `Você é ${config.name}, atendente virtual desta empresa.

Personalidade: ${config.personality}
Tom de voz: ${config.tone}
Características: ${config.characteristics}
${extraBlock}
REGRAS RÍGIDAS:
- Responda APENAS com fatos presentes no <contexto> abaixo.
- Se o contexto não tiver informação suficiente, diga exatamente: "${config.fallbackMessage}"
- Em seguida informe o contato humano: ${contactLine}
- Nunca invente preços, políticas ou funcionalidades que não estejam no contexto.
- Responda sempre em português do Brasil, de forma natural e clara.

<contexto>
${context}
</contexto>`;
}

export function buildFallbackUserMessage(config: AttendantPromptConfig): string {
  const parts = [config.fallbackMessage];
  if (config.fallbackEmail) parts.push(`E-mail: ${config.fallbackEmail}`);
  if (config.fallbackPhone) parts.push(`Telefone: ${config.fallbackPhone}`);
  return parts.join("\n");
}
