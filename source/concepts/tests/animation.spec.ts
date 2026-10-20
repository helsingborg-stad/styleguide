import { expect, test } from '@playwright/test';

const ANIMATION_PAGE = '/concepts/animation';

test.describe('Animation guideline', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1200 });
		await page.goto(ANIMATION_PAGE);
	});

	test('is available from Concepts and exposes the guidance structure', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Animation', level: 1 })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Animation', exact: true }).first()).toHaveAttribute('href', /\/concepts\/animation$/);
		await expect(page.getByRole('table')).toContainText('Press feedback');
		await expect(page.getByRole('heading', { name: 'Live patterns', level: 2 })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Reduced motion is the baseline fallback', level: 2 })).toBeVisible();
	});

	test('uses the existing accordion for keyboard-focusable disclosure', async ({ page }) => {
		const trigger = page.locator('[data-component="accordion"] summary').first();

		await trigger.focus();
		await expect(trigger).toBeFocused();
		expect(await trigger.evaluate((element) => element.tagName)).toBe('SUMMARY');
		expect(await trigger.evaluate((element) => (element as HTMLElement).tabIndex)).toBe(0);
		await trigger.click();
		await expect(trigger.locator('xpath=..')).toHaveAttribute('open', '');
	});

	test('removes travel and transition time for reduced-motion users', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.reload();

		const pressButton = page.getByRole('button', { name: 'Save changes' });
		const duration = await pressButton.evaluate((element) => {
			return Number.parseFloat(window.getComputedStyle(element).transitionDuration);
		});
		expect(duration).toBeLessThanOrEqual(0.001);
	});
});
