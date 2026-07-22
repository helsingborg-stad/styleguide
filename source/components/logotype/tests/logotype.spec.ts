import { expect, type Locator, type Page, test } from '@playwright/test';

/**
 * Logotype component – Design panel (component customizer) integration tests.
 *
 * These tests verify that the Logotype component settings exposed in the
 * Design Builder change the rendered logotype or its computed CSS values.
 *
 * The design-builder target on the logotype page is the header logotype:
 * `[data-component="logotype"]` (#main-logo), which is already maskable.
 *
 * Prerequisites:
 *   - The styleguide PHP server must be accessible at the configured base URL.
 *   - The project must have been built (`npm run build`) so the
 *     design-builder JS bundle is served.
 */

const LOGOTYPE_PAGE = '/components/logotype';
const FAB_TRIGGER_LABEL = 'Open component customizer';
const COMPONENT_SELECT = '#db-component-select';
const FAB_PANEL_OPEN_CLASS = 'c-fab__panel--open';
const CUSTOMIZER_PANEL = '.db-builder-customizer';
const LOGOTYPE_TARGET = '[data-component="logotype"]';

const MASKING_LABEL = 'Masking';

const EXPECTED_VISIBLE_CONTROLS = [MASKING_LABEL];

/**
 * Expands a Design Builder category panel if it is currently collapsed.
 */
async function expandCategory(categoryHeader: Locator): Promise<void> {
	const category = categoryHeader.locator('..');
	const isCollapsed = await category.evaluate((el) => el.classList.contains('db-category-collapsed'));
	if (isCollapsed) {
		await categoryHeader.click();
	}
}

/**
 * Expands all customizer categories so all controls are visible and testable.
 */
async function expandAllCategories(page: Page): Promise<void> {
	const headers = page.locator('.db-category-header');
	const count = await headers.count();

	for (let index = 0; index < count; index += 1) {
		await expandCategory(headers.nth(index));
	}
}

/**
 * Returns the computed value of a CSS property on a DOM element.
 */
async function getComputedCss(locator: Locator, property: string): Promise<string> {
	return locator.evaluate((el, prop) => window.getComputedStyle(el).getPropertyValue(prop).trim(), property);
}

/**
 * Returns the computed opacity of a pseudo-element (::before or ::after).
 */
async function getPseudoOpacity(locator: Locator, pseudo: string): Promise<string> {
	return locator.evaluate((el, pseudoSelector) => window.getComputedStyle(el, pseudoSelector).getPropertyValue('opacity').trim(), pseudo);
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Finds a design-builder control row by its label text.
 */
async function getControlRow(page: Page, label: string): Promise<Locator> {
	const exactLabel = page.locator('.db-control-row-label-text').filter({ hasText: new RegExp(`^${escapeRegExp(label)}$`) });
	const row = page.locator('db-control-row').filter({ has: exactLabel }).first();
	await expect(row).toBeVisible();
	return row;
}

/**
 * Selects an option in a select-type control row.
 */
async function selectControlOption(page: Page, label: string, optionValue: string): Promise<void> {
	const row = await getControlRow(page, label);
	const select = row.locator('select').first();
	await expect(select).toBeVisible();
	await select.selectOption(optionValue);
}

test.describe('Logotype – design panel', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(LOGOTYPE_PAGE);
		await expect(page.locator(LOGOTYPE_TARGET)).toBeVisible();

		await page.getByRole('button', { name: FAB_TRIGGER_LABEL }).click();
		await expect(page.locator(`.${FAB_PANEL_OPEN_CLASS}`)).toBeVisible();
		await expect(page.locator(CUSTOMIZER_PANEL)).toBeVisible();
		await page.locator(COMPONENT_SELECT).selectOption({ value: 'logotype' });
	});

	test('opens the design panel when the FAB button is clicked', async ({ page }) => {
		await expect(page.locator(CUSTOMIZER_PANEL)).toBeVisible();
	});

	test('design panel shows logotype component settings', async ({ page }) => {
		await expect(page.locator('.db-category-header').filter({ hasText: 'Appearance' })).toBeVisible();
	});

	test('logotype panel exposes the full expected control inventory', async ({ page }) => {
		await expandAllCategories(page);

		const labels = await page.locator('db-control-row .db-control-row-label-text').evaluateAll((nodes) => nodes.map((node) => node.textContent?.trim() ?? '').filter(Boolean));

		for (const expectedLabel of EXPECTED_VISIBLE_CONTROLS) {
			expect(labels).toContain(expectedLabel);
		}
	});

	test('Masking defaults to On – image is hidden and ::before is visible', async ({ page }) => {
		const logotype = page.locator(LOGOTYPE_TARGET).first();
		const imageOpacity = await getComputedCss(logotype.locator('.c-logotype__image'), 'opacity');
		const beforeOpacity = await getPseudoOpacity(logotype, '::before');

		expect(imageOpacity).toBe('0');
		expect(beforeOpacity).toBe('1');
	});

	test('setting Masking to Off reveals the image and hides the ::before mask', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Appearance' }));

		const logotype = page.locator(LOGOTYPE_TARGET).first();

		const initialImageOpacity = await getComputedCss(logotype.locator('.c-logotype__image'), 'opacity');
		const initialBeforeOpacity = await getPseudoOpacity(logotype, '::before');
		expect(initialImageOpacity).toBe('0');
		expect(initialBeforeOpacity).toBe('1');

		await selectControlOption(page, MASKING_LABEL, '0');

		const updatedImageOpacity = await getComputedCss(logotype.locator('.c-logotype__image'), 'opacity');
		const updatedBeforeOpacity = await getPseudoOpacity(logotype, '::before');
		expect(updatedImageOpacity).toBe('1');
		expect(updatedBeforeOpacity).toBe('0');
	});

	test('setting Masking back to On re-applies the mask', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Appearance' }));

		await selectControlOption(page, MASKING_LABEL, '0');
		await selectControlOption(page, MASKING_LABEL, '1');

		const logotype = page.locator(LOGOTYPE_TARGET).first();
		const imageOpacity = await getComputedCss(logotype.locator('.c-logotype__image'), 'opacity');
		const beforeOpacity = await getPseudoOpacity(logotype, '::before');

		expect(imageOpacity).toBe('0');
		expect(beforeOpacity).toBe('1');
	});
});
