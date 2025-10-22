import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";

test("lists previous topics from API", async ({ page }) => {
  await page.goto(`${BASE}/`);

  await page.getByRole("tab", { name: "Escape Room" }).click();

  // open Previous topics view first
  await page.getByRole('button', { name: 'Previous topic' }).click();
  await expect(page.getByRole('heading', { name: 'Previous topics' })).toBeVisible();

  const resp = await page.request.get(`${BASE}/api/custom-questions`, { timeout: 15000 });
  expect(resp.ok()).toBeTruthy();
  const topics = (await resp.json()) as Array<{ title: string }>;

  if (Array.isArray(topics) && topics.length > 0) {
    const title = topics[0].title;
    // the list button includes title and question count, so do partial text match
    await expect(page.getByText(title, { exact: false }).first()).toBeVisible();
  } else {
    expect(Array.isArray(topics)).toBeTruthy();
  }
});


