import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { knowledgeChunks } from "@/lib/db/schema";
import { chunkText } from "@/lib/rag/chunk";
import { createEmbedding } from "@/lib/ollama/client";

export async function indexDocument(
  documentId: string,
  knowledgeBaseId: string,
  content: string,
): Promise<number> {
  await db
    .delete(knowledgeChunks)
    .where(eq(knowledgeChunks.documentId, documentId));

  const chunks = chunkText(content);
  if (chunks.length === 0) return 0;

  for (let i = 0; i < chunks.length; i++) {
    const piece = chunks[i]!;
    const embedding = await createEmbedding(piece);
    await db.insert(knowledgeChunks).values({
      documentId,
      knowledgeBaseId,
      content: piece,
      embedding: JSON.stringify(embedding),
      chunkIndex: i,
    });
  }

  return chunks.length;
}
