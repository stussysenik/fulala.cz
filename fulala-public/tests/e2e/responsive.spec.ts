import { test, expect } from '@playwright/test';

const MOBILE_VIEWPORTS = [
  { width: 375, height: 812, name: 'iPhone SE (375px)' },
  { width: 320, height: 568, name: 'Small mobile (320px)' },
];

const PAGES = ['/', '/story', '/contact'];

for (const viewport of MOBILE_VIEWPORTS) {
  test.describe(`${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const path of PAGES) {
      test(`no horizontal overflow on ${path}`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      });

      test(`no elements extend beyond viewport on ${path}`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');

        const overflowingElements = await page.evaluate((vw) => {
          const elements = document.querySelectorAll('*');
          const overflowing: string[] = [];

          for (const el of elements) {
            const rect = el.getBoundingClientRect();
            // Skip invisible or tiny elements
            if (rect.width < 1 || rect.height < 1) continue;
            // Skip elements that are part of the debug overlay
            if (el.id === 'overlap-debug-canvas') continue;

            if (rect.right > vw + 1) {
              const tag = el.tagName.toLowerCase();
              const cls = el.className && typeof el.className === 'string'
                ? el.className.split(/\s+/).slice(0, 3).join(' ')
                : '';
              overflowing.push(`${tag}.${cls} (right: ${Math.round(rect.right)}px)`);
            }
          }

          return overflowing.slice(0, 5);
        }, viewport.width);

        expect(overflowingElements, `Elements extending beyond viewport`).toEqual([]);
      });
    }

    test('footer wraps without overflow', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const footer = page.locator('footer');
      const footerBox = await footer.boundingBox();
      expect(footerBox).toBeTruthy();

      // Footer should not exceed viewport width
      expect(footerBox!.width).toBeLessThanOrEqual(viewport.width);

      // Footer nav links should be visible and within bounds
      const nav = footer.locator('nav');
      const navBox = await nav.boundingBox();
      expect(navBox).toBeTruthy();
      expect(navBox!.x).toBeGreaterThanOrEqual(0);
      expect(navBox!.x + navBox!.width).toBeLessThanOrEqual(viewport.width + 1);
    });

    test('CTA buttons meet 44px minimum touch target', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const buttons = page.locator('.btn-primary, .btn-secondary');
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const box = await buttons.nth(i).boundingBox();
        if (box) {
          expect(box.height, `Button ${i} height should be >= 44px`).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });
}
