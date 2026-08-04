import { expect, type Locator, test } from '@playwright/test';

const BRAND_PAGE = '/components/brand';
const HEADER_PAGE = '/components/header';

type BrandMetrics = {
	containerHeight: number;
	logotypeHeight: number;
	textWidth: number;
	viewboxHeight: number;
	flexShrink: string;
};

/**
 * Returns rendered brand metrics for the first brand instance on the page.
 */
async function getBrandMetrics(brand: Locator): Promise<BrandMetrics> {
	await expect(brand).toBeVisible();

	return brand.evaluate((element) => {
		const container = element.querySelector<HTMLElement>('.c-brand__container');
		const logotype = element.querySelector<HTMLElement>('.c-brand__logotype');
		const text = element.querySelector<HTMLElement>('.c-brand__text');
		const viewbox = element.querySelector<SVGElement>('.c-brand__viewbox');

		if (!container || !logotype || !text || !viewbox) {
			throw new Error('Expected brand container, logotype, text, and viewbox to be present.');
		}

		const containerRect = container.getBoundingClientRect();
		const logotypeRect = logotype.getBoundingClientRect();
		const textRect = text.getBoundingClientRect();
		const viewboxRect = viewbox.getBoundingClientRect();
		const logotypeStyles = window.getComputedStyle(logotype);

		return {
			containerHeight: containerRect.height,
			logotypeHeight: logotypeRect.height,
			textWidth: textRect.width,
			viewboxHeight: viewboxRect.height,
			flexShrink: logotypeStyles.flexShrink,
		};
	});
}

test.describe('Brand sizing', () => {
	test('brand component keeps the logotype at full container height on narrow viewports', async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 900 });
		await page.goto(BRAND_PAGE);

		const metrics = await getBrandMetrics(page.locator('.c-brand').first());

		expect(metrics.flexShrink).toBe('0');
		expect(Math.abs(metrics.containerHeight - metrics.logotypeHeight)).toBeLessThan(1);
	});

	test('header brand keeps the logotype at full container height on narrow viewports', async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 900 });
		await page.goto(HEADER_PAGE);

		const metrics = await getBrandMetrics(page.locator('.c-brand').first());

		expect(metrics.flexShrink).toBe('0');
		expect(Math.abs(metrics.containerHeight - metrics.logotypeHeight)).toBeLessThan(1);
		expect(Math.abs(metrics.viewboxHeight - metrics.logotypeHeight)).toBeLessThan(1);
	});

	test('header brand keeps the minimum auto-scale height after resizing down', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 900 });
		await page.goto(HEADER_PAGE);

		const wideMetrics = await getBrandMetrics(page.locator('.c-brand').first());
		await page.setViewportSize({ width: 320, height: 900 });

		const narrowMetrics = await getBrandMetrics(page.locator('.c-brand').first());

		expect(narrowMetrics.containerHeight).toBeGreaterThan(39);
		expect(narrowMetrics.logotypeHeight).toBeGreaterThan(39);
		expect(Math.abs(narrowMetrics.containerHeight - narrowMetrics.logotypeHeight)).toBeLessThan(1);
		expect(Math.abs(narrowMetrics.viewboxHeight - narrowMetrics.logotypeHeight)).toBeLessThan(1);
		expect(narrowMetrics.textWidth).toBeLessThan(wideMetrics.textWidth);
	});
});
