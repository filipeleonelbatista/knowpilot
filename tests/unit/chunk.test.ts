import { describe, expect, it } from "vitest";
import { chunkText } from "@/lib/rag/chunk";

describe("chunkText", () => {
  it("returns empty for blank input", () => {
    expect(chunkText("   ")).toEqual([]);
  });

  it("returns single chunk for short text", () => {
    expect(chunkText("Hello world")).toEqual(["Hello world"]);
  });

  it("splits long text into multiple chunks", () => {
    const text = "word ".repeat(600);
    const chunks = chunkText(text, { maxChars: 100, overlapChars: 20 });
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((c) => c.length <= 100)).toBe(true);
  });
});
