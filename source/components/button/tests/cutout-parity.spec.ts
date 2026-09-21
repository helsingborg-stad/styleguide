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
			const cutoutLabel = cutout.locator('.c-button__cutout-label');

			await expect(standard).toBeVisible();
			await expect(cutout).toBeVisible();
			await expect(cutout).toHaveAccessibleName(await standard.getAttribute('aria-label') || '');
			await expect(cutout.locator('.c-button__cutout[aria-hidden="true"]')).toBeVisible();

			expect(await geometry(cutout)).toMatchObject(await geometry(standard));
			expect(await geometry(cutoutLabel)).toEqual(await geometry(standardLabel));

			await expect(cutout).toHaveCSS('padding-left', await standard.evaluate((element) => getComputedStyle(element).paddingLeft));
			await expect(cutout).toHaveCSS('padding-right', await standard.evaluate((element) => getComputedStyle(element).paddingRight));

			if (cutoutCase.includes('icon')) {
				const standardIcon = standard.locator('.c-button__label-icon .c-icon');
				const cutoutIcon = cutout.locator('.c-button__label-icon .c-icon');

				await expect(cutoutIcon).toHaveCSS('font-size', await standardIcon.evaluate((element) => getComputedStyle(element).fontSize));
				await expect(cutoutIcon).toHaveCSS('font-weight', await standardIcon.evaluate((element) => getComputedStyle(element).fontWeight));
				expect(await geometry(cutoutIcon)).toEqual(await geometry(standardIcon));
			}

			if (cutoutCase === 'ellipsis') {
				expect(await standardLabel.locator('.c-button__label-text').evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
				expect(await cutoutLabel.locator('.c-button__label-text').evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
			}
		});
	}

	test('keeps the native and cutout renderings visually aligned', async ({ page }) => {
		await expect(page.locator('[data-cutout-parity]')).toHaveScreenshot('cutout-parity.png', {
			animations: 'disabled',
			maxDiffPixelRatio: 0.001,
		});
	});

	test('renders the same pixels as the native button when colors are normalized', async ({ page }) => {
		await page.addStyleTag({
			content: `
				[data-cutout-case]:not([data-cutout-case="ellipsis"]) {
					display: grid !important;
					grid-template-columns: 600px 600px !important;
					column-gap: 20px !important;
				}
				[data-cutout-role] {
					justify-self: start;
				}
				[data-cutout-role="standard"] {
					--c-button-background: #2d2d2d !important;
					--c-button-border: #2d2d2d !important;
					--c-button-contrast: #fff !important;
				}
				[data-cutout-role="cutout"] {
					--c-button-cutout-fill: #2d2d2d !important;
					--c-button-cutout-surface: #fff !important;
				}
			`,
		});

		await page.evaluate(() => document.fonts.ready);

		for (const cutoutCase of CASES) {
			const row = page.locator(`[data-cutout-case="${cutoutCase}"]`);
			const standard = row.locator('[data-cutout-role="standard"]');
			const cutout = row.locator('[data-cutout-role="cutout"]');
			const standardScreenshot = await standard.locator('.c-button__label').screenshot({ animations: 'disabled' });

			const cutoutScreenshot = await cutout.locator('.c-button__cutout-label').screenshot({ animations: 'disabled' });

			expect(cutoutScreenshot.equals(standardScreenshot), `${cutoutCase} label and icon must match the native rendering pixel for pixel`).toBe(true);
		}
	});
});
