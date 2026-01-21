import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the hero section with title', async ({ page }) => {
    // Check for main heading
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Old School');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('New Soul');
  });

  test('should display hero description', async ({ page }) => {
    await expect(page.getByText('Comfort Chinese dishes made with love')).toBeVisible();
  });

  test('should have working navigation links in hero', async ({ page }) => {
    // Check View Menu button
    const menuButton = page.getByRole('link', { name: 'View Menu' });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(page).toHaveURL('/menu');

    // Go back and check Our Story button
    await page.goto('/');
    const storyButton = page.getByRole('link', { name: 'Our Story' });
    await expect(storyButton).toBeVisible();
    await storyButton.click();
    await expect(page).toHaveURL('/story');
  });

  test('should display feature cards', async ({ page }) => {
    await expect(page.getByText('Handmade')).toBeVisible();
    await expect(page.getByText('Fresh Daily')).toBeVisible();
    await expect(page.getByText('Made with Love')).toBeVisible();
  });

  test('should have working navigation header', async ({ page }) => {
    // Check logo/brand
    const logo = page.getByRole('link', { name: 'Fulala' }).first();
    await expect(logo).toBeVisible();

    // Check nav links (desktop)
    await expect(page.getByRole('link', { name: 'Menu' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Story' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('should have footer with links', async ({ page }) => {
    await expect(page.getByText('Old School New Soul')).toBeVisible();
    await expect(page.getByText('Made with dumplings')).toBeVisible();
  });
});
