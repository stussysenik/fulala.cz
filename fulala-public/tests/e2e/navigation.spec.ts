import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between all pages', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Navigate to Menu
    await page.getByRole('link', { name: 'Menu' }).first().click();
    await expect(page).toHaveURL('/menu');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('MENU');

    // Navigate to Story
    await page.getByRole('link', { name: 'Story' }).first().click();
    await expect(page).toHaveURL('/story');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('OUR STORY');

    // Navigate to Contact
    await page.getByRole('link', { name: 'Contact' }).first().click();
    await expect(page).toHaveURL('/contact');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('FIND US');

    // Navigate back to Home via logo
    await page.getByRole('link', { name: 'Fulala' }).first().click();
    await expect(page).toHaveURL('/');
  });

  test('should have correct page titles', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Fulala/);

    await page.goto('/menu');
    await expect(page).toHaveTitle(/Menu.*Fulala/);

    await page.goto('/story');
    await expect(page).toHaveTitle(/Story.*Fulala/);

    await page.goto('/contact');
    await expect(page).toHaveTitle(/Contact.*Fulala/);
  });

  test('should highlight active nav link', async ({ page }) => {
    await page.goto('/menu');

    // The Menu link should have the active styling (text-fulala-red class)
    const menuLink = page.getByRole('link', { name: 'Menu' }).first();
    await expect(menuLink).toHaveClass(/text-fulala-red/);
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should show mobile menu button on small screens', async ({ page }) => {
    await page.goto('/');

    // Desktop nav links should be hidden
    const desktopNav = page.locator('.hidden.md\\:flex');
    await expect(desktopNav).toBeHidden();

    // Mobile menu button should be visible
    const mobileMenuButton = page.getByRole('button', { name: 'Toggle menu' });
    await expect(mobileMenuButton).toBeVisible();
  });

  test('should open and close mobile menu', async ({ page }) => {
    await page.goto('/');

    const mobileMenuButton = page.getByRole('button', { name: 'Toggle menu' });

    // Open menu
    await mobileMenuButton.click();

    // Menu links should be visible
    await expect(page.getByRole('link', { name: 'Menu' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Story' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();

    // Close menu
    await mobileMenuButton.click();

    // Wait for animation
    await page.waitForTimeout(300);
  });

  test('should close mobile menu after navigation', async ({ page }) => {
    await page.goto('/');

    const mobileMenuButton = page.getByRole('button', { name: 'Toggle menu' });

    // Open menu
    await mobileMenuButton.click();

    // Click a link
    await page.getByRole('link', { name: 'Menu' }).click();

    // Should navigate
    await expect(page).toHaveURL('/menu');
  });
});
