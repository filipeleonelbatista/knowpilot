import { describe, expect, it } from "vitest";
import {
  canManagePlan,
  canManageWidgetKeys,
  hasMinRole,
} from "@/lib/auth/permissions";

describe("hasMinRole", () => {
  it("owner satisfies admin", () => {
    expect(hasMinRole("owner", "admin")).toBe(true);
  });

  it("member does not satisfy admin", () => {
    expect(hasMinRole("member", "admin")).toBe(false);
  });
});

describe("permissions", () => {
  it("only owner manages plan", () => {
    expect(canManagePlan("owner")).toBe(true);
    expect(canManagePlan("admin")).toBe(false);
  });

  it("admin manages widget keys", () => {
    expect(canManageWidgetKeys("admin")).toBe(true);
    expect(canManageWidgetKeys("member")).toBe(false);
  });
});
