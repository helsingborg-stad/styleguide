import { expect, type Locator, test } from '@playwright/test';

const BUTTON_PAGE = '/components/button';
const CASES = ['short', 'icon-after', 'icon-before', 'icon-sm', 'icon-md', 'icon-lg', 'long', 'ellipsis'];

async function geometry(locator: Locator) {
	return locator.evaluate((element) => {
		const target = element.getBoundingClientRect();
		const reference = element.closest('[data-cutout-role]')?.getBoundingClientRect();
		return {
			x: target.x - (reference?.x ?? 0),
			y: target.y - (reference?.y ?? 0),
			width: target.width,
			height: target.height,
		};
	});
}

test.describe('Button – inherited filled SVG cutout', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1200 });
		await page.goto(BUTTON_PAGE);
	});

	for (const cutoutCase of CASES) {
		test(`${cutoutCase} keeps the normal filled button geometry`, async ({ page }) => {
			const row = page.locator(`[data-cutout-case="${cutoutCase}"]`);
			const standard = row.locator('[data-cutout-role="standard"]');
			const cutout = row.locator('[data-cutout-role="cutout"]');
			const standardLabel = standard.locator('.c-button__label');
			const cutoutMeasure = cutout.locator('.c-button__cutout-measure');

			await expect(standard).toBeVisible();
			await expect(cutout).toBeVisible();
			await expect(cutout).toHaveAccessibleName(await standard.getAttribute('aria-label') || '');
			await expect(cutout.locator('.c-button__cutout[aria-hidden="true"]')).toBeVisible();

			expect(await geometry(cutout)).toMatchObject(await geometry(standard));
			expect(await geometry(cutoutMeasure)).toEqual(await geometry(standardLabel));

			await expect(cutout).toHaveCSS('padding-left', await standard.evaluate((element) => getComputedStyle(element).paddingLeft));
			await expect(cutout).toHaveCSS('padding-right', await standard.evaluate((element) => getComputedStyle(element).paddingRight));

			if (cutoutCase.includes('icon')) {
				const standardIcon = standard.locator('.c-button__label-icon .c-icon');
				const cutoutIcon = cutout.locator('.c-button__cutout-icon');

				await expect(cutoutIcon).toHaveCSS('font-size', await standardIcon.evaluate((element) => getComputedStyle(element).fontSize));
				await expect(cutout.locator(`.c-button__cutout-text--icon-${cutoutCase === 'icon-before' ? 'before' : 'after'}`)).toHaveCount(1);
			}

			if (cutoutCase === 'ellipsis') {
				await expect.poll(() => cutout.locator('.c-button__cutout-label-text').textContent()).toMatch(/…$/);
				expect(await standardLabel.locator('.c-button__label-text').evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
			}
		});
	}

	test('keeps the native and cutout renderings visually aligned', async ({ page }) => {
		await expect(page.locator('[data-cutout-parity]')).toHaveScreenshot('cutout-parity.png', {
			animations: 'disabled',
			maxDiffPixelRatio: 0.001,
		});
	});
});
