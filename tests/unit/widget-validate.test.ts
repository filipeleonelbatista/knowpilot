import { describe, expect, it } from "vitest";
import {
  isOriginAllowed,
  normalizeHttpOrigin,
  resolveRequestOrigin,
} from "@/lib/widget/validate";

describe("normalizeHttpOrigin", () => {
  it("rejects opaque null origin string", () => {
    expect(normalizeHttpOrigin("null")).toBeNull();
  });

  it("accepts https origin", () => {
    expect(normalizeHttpOrigin("https://www.fronteditor.dev")).toBe(
      "https://www.fronteditor.dev",
    );
  });
});

describe("resolveRequestOrigin", () => {
  it("prefers Origin header when present", () => {
    expect(
      resolveRequestOrigin("https://www.fronteditor.dev", null, null),
    ).toBe("https://www.fronteditor.dev");
  });

  it("falls back to embedOrigin when Origin is null", () => {
    expect(
      resolveRequestOrigin("null", null, "https://www.fronteditor.dev"),
    ).toBe("https://www.fronteditor.dev");
  });

  it("falls back to Referer origin when Origin and embedOrigin are missing", () => {
    expect(
      resolveRequestOrigin(null, "https://www.fronteditor.dev/page", null),
    ).toBe("https://www.fronteditor.dev");
  });

  it("ignores embedOrigin when it is the string null", () => {
    expect(
      resolveRequestOrigin(
        "null",
        "https://www.fronteditor.dev/page",
        "null",
      ),
    ).toBe("https://www.fronteditor.dev");
  });
});

describe("isOriginAllowed", () => {
  it("allows any origin when list is empty", () => {
    expect(isOriginAllowed("https://evil.com", [])).toBe(true);
  });

  it("matches configured origin", () => {
    expect(
      isOriginAllowed("https://www.fronteditor.dev", [
        "https://www.fronteditor.dev",
      ]),
    ).toBe(true);
  });

  it("denies unknown origin", () => {
    expect(
      isOriginAllowed("https://evil.com", ["https://www.fronteditor.dev"]),
    ).toBe(false);
  });
});
