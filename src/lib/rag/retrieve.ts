export type ScoredChunk = {
  id: string;
  content: string;
  documentId: string;
  score: number;
};

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return dot / denom;
}

export function parseEmbedding(json: string): number[] {
  return JSON.parse(json) as number[];
}

export function retrieveTopChunks(
  queryEmbedding: number[],
  chunks: Array<{
    id: string;
    content: string;
    documentId: string;
    embedding: string;
  }>,
  topK = 5,
  minScore = 0.35,
): ScoredChunk[] {
  const scored = chunks
    .map((chunk) => {
      const embedding = parseEmbedding(chunk.embedding);
      const score = cosineSimilarity(queryEmbedding, embedding);
      return {
        id: chunk.id,
        content: chunk.content,
        documentId: chunk.documentId,
        score,
      };
    })
    .filter((c) => c.score >= minScore)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}

export function hasRelevantContext(chunks: ScoredChunk[]): boolean {
  return chunks.length > 0;
}
