const APPROX_CHARS_PER_TOKEN = 4;
const DEFAULT_CHUNK_CHARS = 500 * APPROX_CHARS_PER_TOKEN;
const DEFAULT_OVERLAP_CHARS = 50 * APPROX_CHARS_PER_TOKEN;

export type ChunkOptions = {
  maxChars?: number;
  overlapChars?: number;
};

export function chunkText(
  text: string,
  options: ChunkOptions = {},
): string[] {
  const maxChars = options.maxChars ?? DEFAULT_CHUNK_CHARS;
  const overlapChars = options.overlapChars ?? DEFAULT_OVERLAP_CHARS;

  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  if (normalized.length <= maxChars) {
    return [normalized];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < normalized.length) {
    let end = Math.min(start + maxChars, normalized.length);

    if (end < normalized.length) {
      const slice = normalized.slice(start, end);
      const lastBreak = Math.max(
        slice.lastIndexOf("\n\n"),
        slice.lastIndexOf("\n"),
        slice.lastIndexOf(". "),
        slice.lastIndexOf(" "),
      );
      if (lastBreak > maxChars * 0.5) {
        end = start + lastBreak + 1;
      }
    }

    const piece = normalized.slice(start, end).trim();
    if (piece) chunks.push(piece);

    if (end >= normalized.length) break;
    start = Math.max(end - overlapChars, start + 1);
  }

  return chunks;
}
