import { describe, expect, it } from "vitest";
import {
  attendantPresets,
  applyPreset,
  findMatchingPreset,
  getPresetsByCategory,
} from "@/lib/attendant/presets";

describe("attendant presets", () => {
  it("has at least 15 presets across all categories", () => {
    expect(attendantPresets.length).toBeGreaterThanOrEqual(15);
    const categories = new Set(attendantPresets.map((p) => p.category));
    expect(categories.has("general")).toBe(true);
    expect(categories.has("sales")).toBe(true);
    expect(categories.has("support")).toBe(true);
    expect(categories.has("industry")).toBe(true);
  });

  it("groups presets by category", () => {
    const groups = getPresetsByCategory();
    expect(groups).toHaveLength(4);
    const total = groups.reduce((n, g) => n + g.presets.length, 0);
    expect(total).toBe(attendantPresets.length);
  });

  it("applyPreset fills personality fields and optional name", () => {
    const preset = attendantPresets.find((p) => p.id === "healthcare")!;
    const next = applyPreset(
      {
        name: "Bot",
        personality: "",
        tone: "",
        characteristics: "",
        extraInstructions: "",
      },
      preset,
    );
    expect(next.name).toBe("Assistente de saúde");
    expect(next.personality).toContain("clínica");
    expect(findMatchingPreset(next)?.id).toBe("healthcare");
  });
});
