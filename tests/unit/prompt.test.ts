import { describe, expect, it } from "vitest";
import { buildSystemPrompt, buildFallbackUserMessage } from "@/lib/rag/prompt";

const baseConfig = {
  name: "Ana",
  personality: "warm",
  tone: "casual",
  characteristics: "concise",
  extraInstructions: "Use emojis sparingly",
  fallbackMessage: "Não sei.",
  fallbackEmail: "help@example.com",
  fallbackPhone: "+5511999999999",
};

describe("buildSystemPrompt", () => {
  it("includes context and rules", () => {
    const prompt = buildSystemPrompt(baseConfig, ["Fact A"]);
    expect(prompt).toContain("Ana");
    expect(prompt).toContain("Fact A");
    expect(prompt).toContain("APENAS com fatos");
    expect(prompt).toContain("português do Brasil");
    expect(prompt).toContain("help@example.com");
  });
});

describe("buildFallbackUserMessage", () => {
  it("includes contact info", () => {
    const msg = buildFallbackUserMessage(baseConfig);
    expect(msg).toContain("Não sei.");
    expect(msg).toContain("help@example.com");
  });
});
