import { describe, expect, it } from "vitest";
import { buildWidgetSnippet, parseAllowedOrigins } from "@/lib/widget/snippet";

describe("buildWidgetSnippet", () => {
  it("builds script tag with key and position", () => {
    const s = buildWidgetSnippet("https://app.test", "wk_abc123");
    expect(s).toContain('src="https://app.test/widget/v1.js"');
    expect(s).toContain('data-widget-key="wk_abc123"');
    expect(s).toContain('data-position="bottom-right"');
  });
});

describe("parseAllowedOrigins", () => {
  it("parses json array", () => {
    expect(parseAllowedOrigins('["https://a.com"]')).toEqual([
      "https://a.com",
    ]);
  });
});
