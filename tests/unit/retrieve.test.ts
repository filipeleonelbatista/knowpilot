import { describe, expect, it } from "vitest";
import {
  cosineSimilarity,
  hasRelevantContext,
  retrieveTopChunks,
} from "@/lib/rag/retrieve";

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
  });

  it("returns 0 for orthogonal vectors", () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
  });
});

describe("retrieveTopChunks", () => {
  const chunks = [
    {
      id: "1",
      content: "cats",
      documentId: "d1",
      embedding: JSON.stringify([1, 0]),
    },
    {
      id: "2",
      content: "dogs",
      documentId: "d1",
      embedding: JSON.stringify([0, 1]),
    },
  ];

  it("returns top matching chunks above threshold", () => {
    const result = retrieveTopChunks([0.9, 0.1], chunks, 2, 0.3);
    expect(result[0]?.id).toBe("1");
    expect(result[0]?.content).toBe("cats");
  });

  it("filters low similarity", () => {
    const result = retrieveTopChunks([0.01, 0.99], chunks, 5, 0.95);
    expect(result.map((c) => c.id)).toEqual(["2"]);
  });
});

describe("hasRelevantContext", () => {
  it("is false when empty", () => {
    expect(hasRelevantContext([])).toBe(false);
  });
});
