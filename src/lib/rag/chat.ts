import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  attendantConfigs,
  knowledgeChunks,
  knowledgeBases,
} from "@/lib/db/schema";
import { createEmbedding, streamChat, type ChatMessage } from "@/lib/ollama/client";
import {
  hasRelevantContext,
  retrieveTopChunks,
} from "@/lib/rag/retrieve";
import {
  buildFallbackUserMessage,
  buildSystemPrompt,
} from "@/lib/rag/prompt";

export async function* runRagChat(
  organizationId: string,
  userMessage: string,
): AsyncGenerator<string> {
  const attendant = await db.query.attendantConfigs.findFirst({
    where: eq(attendantConfigs.organizationId, organizationId),
  });

  const kb = await db.query.knowledgeBases.findFirst({
    where: eq(knowledgeBases.organizationId, organizationId),
  });

  if (!kb) {
    yield "Base de conhecimento não configurada.";
    return;
  }

  const config = {
    name: attendant?.name ?? "Assistente",
    personality: attendant?.personality ?? "helpful",
    tone: attendant?.tone ?? "friendly",
    characteristics: attendant?.characteristics ?? "",
    extraInstructions: attendant?.extraInstructions ?? "",
    fallbackMessage:
      attendant?.fallbackMessage ??
      "Não encontrei essa informação na base de conhecimento.",
    fallbackEmail: attendant?.fallbackEmail,
    fallbackPhone: attendant?.fallbackPhone,
  };

  const allChunks = await db.query.knowledgeChunks.findMany({
    where: eq(knowledgeChunks.knowledgeBaseId, kb.id),
  });

  if (allChunks.length === 0) {
    yield buildFallbackUserMessage(config);
    return;
  }

  const queryEmbedding = await createEmbedding(userMessage);
  const topChunks = retrieveTopChunks(queryEmbedding, allChunks);

  if (!hasRelevantContext(topChunks)) {
    yield buildFallbackUserMessage(config);
    return;
  }

  const systemPrompt = buildSystemPrompt(
    config,
    topChunks.map((c) => c.content),
  );

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ];

  for await (const token of streamChat(messages)) {
    yield token;
  }
}
