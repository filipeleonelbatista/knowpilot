import { describe, expect, it } from "vitest";
import { FREE_MAX_ORGANIZATIONS } from "@/lib/org/limits";
import { OrganizationLimitError } from "@/lib/org/service";

describe("FREE_MAX_ORGANIZATIONS", () => {
  it("defaults to 3", () => {
    expect(FREE_MAX_ORGANIZATIONS).toBe(3);
  });
});

describe("OrganizationLimitError", () => {
  it("exposes count and max", () => {
    const err = new OrganizationLimitError(3, 3);
    expect(err.code).toBe("ORG_LIMIT_FREE");
    expect(err.count).toBe(3);
    expect(err.max).toBe(3);
  });
});
