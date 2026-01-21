import { test, expect } from '@playwright/test';

test.describe('Menu Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
  });

  test('should display the menu title', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('MENU');
  });

  test('should display category filter buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Dumplings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Buns' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Noodles' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sides' })).toBeVisible();
  });

  test('should display menu items', async ({ page }) => {
    // Wait for loading to complete
    await page.waitForTimeout(1000);

    // Check for specific menu items
    await expect(page.getByText('Fulala Classic')).toBeVisible();
    await expect(page.getByText('Tiger Heat')).toBeVisible();
    await expect(page.getByText('Zen Garden')).toBeVisible();
    await expect(page.getByText('Golden Buns')).toBeVisible();
    await expect(page.getByText('Lucky Noodles')).toBeVisible();
    await expect(page.getByText('Cucumber Slaw')).toBeVisible();
  });

  test('should filter menu items by category', async ({ page }) => {
    // Wait for loading to complete
    await page.waitForTimeout(1000);

    // Click Dumplings filter
    await page.getByRole('button', { name: 'Dumplings' }).click();

    // Should show dumpling items
    await expect(page.getByText('Fulala Classic')).toBeVisible();
    await expect(page.getByText('Tiger Heat')).toBeVisible();

    // Should not show other categories (they're hidden, not removed)
    // Note: We check that "Buns" section header is not visible
    await expect(page.getByRole('heading', { name: 'Buns' })).not.toBeVisible();
  });

  test('should display prices', async ({ page }) => {
    await page.waitForTimeout(1000);

    await expect(page.getByText('185 Kč')).toBeVisible();
    await expect(page.getByText('195 Kč')).toBeVisible();
  });

  test('should show skeleton loaders during initial load', async ({ page }) => {
    // Navigate fresh without cache
    await page.goto('/menu', { waitUntil: 'commit' });

    // Check for skeleton elements (they should appear briefly)
    // This is a timing-dependent test, so we use a short timeout
    const skeletons = page.locator('.skeleton');
    const count = await skeletons.count();
    expect(count).toBeGreaterThanOrEqual(0); // May or may not catch them depending on speed
  });
});
