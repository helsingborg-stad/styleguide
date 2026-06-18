import { expect, test, type Locator } from '@playwright/test';

/**
 * Drawer component – Design panel (component customizer) integration tests.
 *
 * These tests verify that changing settings inside the floating design panel
 * produces the expected visual / CSS-variable result on the drawer component.
 *
 * Prerequisites:
 *   - The styleguide PHP server must be accessible at the configured base URL.
 *   - The project must have been built (`npm run build`) so that the
 *     design-builder JS bundle is served.
 */

const DRAWER_PAGE = '/components/drawer';
const FAB_TRIGGER_LABEL = 'Open component customizer';
const COMPONENT_SELECT = '#db-component-select';
const FAB_PANEL_OPEN_CLASS = 'c-fab__panel--open';
const CUSTOMIZER_PANEL = '.db-builder-customizer';
const DRAWER_TARGET = '[data-component="drawer"]';
const LAYOUT_CATEGORY_HEADER = '.db-category-header';
const PADDING_MULTIPLIER_LABEL = 'Padding Multiplier';
const WIDTH_MULTIPLIER_LABEL = 'Width Multiplier';

/**
 * Sets a range input's value and fires a native `input` event from within the
 * page context so that lit-html's `@input` binding inside `range-control`
 * triggers the full control-change event chain.
 */
async function setRangeValue(rangeLocator: Locator, value: string): Promise<void> {
	await rangeLocator.evaluate((input: HTMLInputElement, val: string) => {
		input.value = val;
		input.dispatchEvent(new Event('input', { bubbles: true }));
	}, value);
}

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
 * Returns the computed numeric pixel value of a CSS property on a DOM element.
 */
async function getComputedPx(locator: Locator, property: string): Promise<number> {
	return locator.evaluate((el, prop) => parseFloat(window.getComputedStyle(el).getPropertyValue(prop)), property);
}

test.describe('Drawer – design panel', () => {
	/**
	 * Navigate to the drawer page and open the design panel before each test.
	 */
	test.beforeEach(async ({ page }) => {
		await page.goto(DRAWER_PAGE);

		// Click the FAB button to open the component customizer panel.
		await page.getByRole('button', { name: FAB_TRIGGER_LABEL }).click();

		// Wait for the FAB panel open state.
		await expect(page.locator(`.${FAB_PANEL_OPEN_CLASS}`)).toBeVisible();

		// Confirm the design panel has rendered.
		await expect(page.locator(CUSTOMIZER_PANEL)).toBeVisible();

		// Select the drawer component in the component dropdown (value is the normalized slug).
		await page.locator(COMPONENT_SELECT).selectOption({ value: 'drawer' });
	});

	test('opens the design panel when the FAB button is clicked', async ({ page }) => {
		await expect(page.locator(CUSTOMIZER_PANEL)).toBeVisible();
	});

	test('design panel shows drawer component settings', async ({ page }) => {
		// The layout category header should be present.
		await expect(page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Layout' })).toBeVisible();
	});

	test('increasing the Padding Multiplier increases the header horizontal padding', async ({ page }) => {
		const layoutHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Layout' });
		await expandCategory(layoutHeader);

		const paddingRow = page.locator('db-control-row').filter({ hasText: PADDING_MULTIPLIER_LABEL });
		const rangeInput = paddingRow.locator('input[type="range"]');
		await expect(rangeInput).toBeVisible();

		// Measure padding-left on the drawer header before any change.
		const drawerHeader = page.locator(`${DRAWER_TARGET} .c-drawer__header`).first();
		const initialPaddingLeft = await getComputedPx(drawerHeader, 'padding-left');

		// Set multiplier to maximum.
		const max = await rangeInput.getAttribute('max');
		await setRangeValue(rangeInput, max ?? '3');

		// The header padding-left must have grown.
		const newPaddingLeft = await getComputedPx(drawerHeader, 'padding-left');
		expect(newPaddingLeft).toBeGreaterThan(initialPaddingLeft);
	});

	test('increasing the Width Multiplier increases the drawer max-width', async ({ page }) => {
		const layoutHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Layout' });
		await expandCategory(layoutHeader);

		const widthRow = page.locator('db-control-row').filter({ hasText: WIDTH_MULTIPLIER_LABEL });
		const rangeInput = widthRow.locator('input[type="range"]');
		await expect(rangeInput).toBeVisible();

		// Measure the drawer max-width before any change.
		const drawerElement = page.locator(DRAWER_TARGET).first();
		const initialMaxWidth = await getComputedPx(drawerElement, 'max-width');

		// Set multiplier to maximum.
		const max = await rangeInput.getAttribute('max');
		await setRangeValue(rangeInput, max ?? '1.5');

		// The computed max-width must have grown.
		const newMaxWidth = await getComputedPx(drawerElement, 'max-width');
		expect(newMaxWidth).toBeGreaterThan(initialMaxWidth);
	});

	test('resetting the drawer component restores the original max-width', async ({ page }) => {
		const layoutHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Layout' });
		await expandCategory(layoutHeader);

		const widthRow = page.locator('db-control-row').filter({ hasText: WIDTH_MULTIPLIER_LABEL });
		const rangeInput = widthRow.locator('input[type="range"]');
		const drawerElement = page.locator(DRAWER_TARGET).first();

		// Capture baseline max-width.
		const initialMaxWidth = await getComputedPx(drawerElement, 'max-width');

		// Apply maximum width multiplier.
		const max = await rangeInput.getAttribute('max');
		await setRangeValue(rangeInput, max ?? '1.5');
		expect(await getComputedPx(drawerElement, 'max-width')).toBeGreaterThan(initialMaxWidth);

		// Reset the component overrides.
		page.once('dialog', (dialog) => dialog.accept());
		await page.locator('[data-action="reset-component"]').click();

		// max-width must return to the initial value.
		const restoredMaxWidth = await getComputedPx(drawerElement, 'max-width');
		expect(restoredMaxWidth).toBeCloseTo(initialMaxWidth, 1);
	});
});
