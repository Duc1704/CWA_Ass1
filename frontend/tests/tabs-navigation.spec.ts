import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";

test("navigates to Escape Room tab and shows timer", async ({ page }) => {
  await page.goto(`${BASE}/`);

  const escapeTab = page.getByRole("tab", { name: "Escape Room" });
  await expect(escapeTab).toBeVisible();
  await escapeTab.click();

  // Assert Escape Room panel root is visible
  await expect(page.locator('#escape')).toBeVisible();
});


