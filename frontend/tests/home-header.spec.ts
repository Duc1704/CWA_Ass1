import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";

test("renders header and student number badge", async ({ page }) => {
	await page.goto(`${BASE}/`);
	await expect(page.getByRole("heading", { name: "Tabs Generator" })).toBeVisible();
	await expect(page.getByLabel("Student Number")).toBeVisible();
});


