
import { test, expect } from '@playwright/test';

test('Dashboard displays error on failed insight fetch', async ({ page }) => {
  await page.goto('http://localhost:4174');

  // Wait for the dashboard to render
  await page.waitForSelector('text=Clinical Performance');

  // Check that the error message is displayed specifically within the AI Command card
  const aiCommandCard = page.locator('div.bg-slate-900');
  const errorMessage = aiCommandCard.locator('text=Could not load insights.');

  await expect(errorMessage).toBeVisible();
});
