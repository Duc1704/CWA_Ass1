import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";

test("shows Tabs bar and Escape Room tab content", async ({ page }) => {
	await page.goto(`${BASE}/`);

	const escapeTab = page.getByRole("tab", { name: "Escape Room" });
	await expect(escapeTab).toBeVisible();
	await escapeTab.click();

	await expect(page.locator("#escape")).toBeVisible();
});


