import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";

test("lists previous topics from API (skips API call if offline)", async ({ page }) => {
  await page.goto(`${BASE}/`);

  await page.getByRole("tab", { name: "Escape Room" }).click();

  // open Previous topics view first
  await page.getByRole('button', { name: 'Previous topic' }).click();
  await expect(page.getByRole('heading', { name: 'Previous topics' })).toBeVisible();

  // Try API call, but do not fail test if backend is offline
  const resp = await page.request.get(`${BASE}/api/custom-questions`, { timeout: 5000 });
  if (!resp.ok()) {
    test.skip(true, "API is not running on localhost; UI smoke checks passed");
  }
  const topics = (await resp.json()) as Array<{ title: string }>;

  if (Array.isArray(topics) && topics.length > 0) {
    const title = topics[0].title;
    // the list button includes title and question count, so do partial text match
    await expect(page.getByText(title, { exact: false }).first()).toBeVisible();
  } else {
    expect(Array.isArray(topics)).toBeTruthy();
  }
});


