import { expect, test } from '@playwright/test';

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

		// Select the drawer component in the component dropdown.
		await page.locator(COMPONENT_SELECT).selectOption({ label: 'drawer' });
	});

	test('opens the design panel when the FAB button is clicked', async ({ page }) => {
		await expect(page.locator(CUSTOMIZER_PANEL)).toBeVisible();
	});

	test('design panel shows drawer component settings', async ({ page }) => {
		// The layout category header should be present.
		await expect(page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Layout' })).toBeVisible();
	});

	test('changing the Padding Multiplier applies the CSS variable to the drawer', async ({ page }) => {
		// Expand the Layout category if it is collapsed.
		const layoutHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Layout' });
		const layoutCategory = layoutHeader.locator('..');
		const isCollapsed = await layoutCategory.evaluate((el) => el.classList.contains('db-category-collapsed'));
		if (isCollapsed) {
			await layoutHeader.click();
		}

		// Find the Padding Multiplier control row and its range input.
		const paddingRow = page.locator('db-control-row').filter({ hasText: PADDING_MULTIPLIER_LABEL });
		const rangeInput = paddingRow.locator('input[type="range"]');
		await expect(rangeInput).toBeVisible();

		// Set the range to its maximum value (3) using the fill method.
		const max = await rangeInput.getAttribute('max');
		await rangeInput.fill(max ?? '3');
		await rangeInput.dispatchEvent('input');
		await rangeInput.dispatchEvent('change');

		// Verify the CSS custom property is applied inline to the drawer element.
		const drawerElement = page.locator(DRAWER_TARGET).first();
		await expect(drawerElement).toHaveCSS('--padding-multiplier', max ?? '3');
	});

	test('changing the Width Multiplier applies the CSS variable to the drawer', async ({ page }) => {
		// Expand the Layout category if it is collapsed.
		const layoutHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Layout' });
		const layoutCategory = layoutHeader.locator('..');
		const isCollapsed = await layoutCategory.evaluate((el) => el.classList.contains('db-category-collapsed'));
		if (isCollapsed) {
			await layoutHeader.click();
		}

		// Find the Width Multiplier control row and its range input.
		const widthRow = page.locator('db-control-row').filter({ hasText: WIDTH_MULTIPLIER_LABEL });
		const rangeInput = widthRow.locator('input[type="range"]');
		await expect(rangeInput).toBeVisible();

		// Set the range to its maximum value (1.5).
		const max = await rangeInput.getAttribute('max');
		await rangeInput.fill(max ?? '1.5');
		await rangeInput.dispatchEvent('input');
		await rangeInput.dispatchEvent('change');

		// Verify the CSS custom property is applied inline to the drawer element.
		const drawerElement = page.locator(DRAWER_TARGET).first();
		await expect(drawerElement).toHaveCSS('--width-multiplier', max ?? '1.5');
	});

	test('resetting the drawer component removes custom CSS variables', async ({ page }) => {
		// Expand the Layout category if it is collapsed.
		const layoutHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Layout' });
		const layoutCategory = layoutHeader.locator('..');
		const isCollapsed = await layoutCategory.evaluate((el) => el.classList.contains('db-category-collapsed'));
		if (isCollapsed) {
			await layoutHeader.click();
		}

		// Set the Width Multiplier to its max value to create an override.
		const widthRow = page.locator('db-control-row').filter({ hasText: WIDTH_MULTIPLIER_LABEL });
		const rangeInput = widthRow.locator('input[type="range"]');
		const max = await rangeInput.getAttribute('max');
		await rangeInput.fill(max ?? '1.5');
		await rangeInput.dispatchEvent('input');
		await rangeInput.dispatchEvent('change');

		// Verify the override was applied before resetting.
		const drawerElement = page.locator(DRAWER_TARGET).first();
		await expect(drawerElement).toHaveCSS('--width-multiplier', max ?? '1.5');

		// Click the "Reset Selected" button to clear component overrides.
		await page.locator('[data-action="reset-component"]').click();

		// Verify the CSS custom property is no longer present on the drawer element.
		await expect(drawerElement).not.toHaveCSS('--width-multiplier', max ?? '1.5');
	});
});
