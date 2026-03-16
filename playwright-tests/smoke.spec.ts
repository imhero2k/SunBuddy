import { test, expect } from "@playwright/test";

test("home page loads and shows dashboard heading", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /sunbuddy/i })
  ).toBeVisible();
});

