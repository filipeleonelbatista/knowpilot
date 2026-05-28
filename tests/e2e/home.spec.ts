import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Base de conhecimento",
  );
});

test("upgrade page shows Pro pricing", async ({ page }) => {
  await page.goto("/upgrade");
  await expect(page.getByText("R$ 90")).toBeVisible();
});
