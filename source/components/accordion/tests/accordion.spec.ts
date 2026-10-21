import { expect, type Locator, type Page, test } from '@playwright/test';

const ACCORDION_PAGE = '/components/accordion';
const STANDALONE_SUMMARY = '.markup-preview > [data-component="accordion"] .c-accordion__item summary';
const CARD_WRAPPED_SUMMARY = '.markup-preview .c-card [data-component="accordion"] .c-accordion__item summary';

/**
 * Returns the computed CSS value for a property.
 */
async function getComputedCss(locator: Locator, property: string): Promise<string> {
	return locator.evaluate((el, prop) => window.getComputedStyle(el).getPropertyValue(prop).trim(), property);
}

test.describe('Accordion focus and state ring', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1200 });
		await page.goto(ACCORDION_PAGE);
		await expect(page.locator(STANDALONE_SUMMARY).first()).toBeVisible();
	});

	test('standalone accordion items render an inset state ring and an inset keyboard focus outline', async ({ page }) => {
		const summary = page.locator(STANDALONE_SUMMARY).first();
		const item = summary.locator('xpath=..');

		await summary.hover();
		await expect.poll(async () => getComputedCss(summary, 'box-shadow')).not.toBe('none');

		await summary.click();
		await expect(item).toHaveAttribute('open', '');
		await expect.poll(async () => getComputedCss(summary, 'box-shadow')).not.toBe('none');

		await page.goto(ACCORDION_PAGE);
		await expect(summary).toBeVisible();
		await summary.focus();
		await expect(summary).toBeFocused();
		await expect(summary).toHaveCSS('outline-offset', '-2px');
		await expect(summary).toHaveCSS('outline-width', '2px');
	});

	test('card-wrapped accordion items keep the inset keyboard focus outline inside the item box', async ({ page }) => {
		const summary = page.locator(CARD_WRAPPED_SUMMARY).first();

		await expect(summary).toBeVisible();
		await summary.hover();
		await expect.poll(async () => getComputedCss(summary, 'box-shadow')).not.toBe('none');

		await summary.focus();
		await expect(summary).toBeFocused();
		await expect(summary).toHaveCSS('outline-offset', '-2px');
		await expect(summary).toHaveCSS('outline-width', '2px');
	});
});
