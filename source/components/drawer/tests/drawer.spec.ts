import { expect, type Locator, type Page, test } from '@playwright/test';

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
const OVERLAY_TARGET = '.drawer-overlay';
const LAYOUT_CATEGORY_HEADER = '.db-category-header';
const COLORS_CATEGORY_HEADER = '.db-category-header';
const ELEVATION_CATEGORY_HEADER = '.db-category-header';
const PADDING_MULTIPLIER_LABEL = 'Padding Multiplier';
const WIDTH_MULTIPLIER_LABEL = 'Width Multiplier';
const MAIN_PANEL_COLOR_LABEL = 'Main Panel Color';
const SECONDARY_NAVIGATION_COLOR_LABEL = 'Secondary Navigation Color';
const OVERLAY_COLOR_LABEL = 'Overlay Color';
const SHADOW_COLOR_LABEL = 'Shadow Color';
const SHADOW_INTENSITY_LABEL = 'Shadow Intensity';

const EXPECTED_VISIBLE_CONTROLS = [MAIN_PANEL_COLOR_LABEL, MAIN_PANEL_COLOR_LABEL, SECONDARY_NAVIGATION_COLOR_LABEL, OVERLAY_COLOR_LABEL, PADDING_MULTIPLIER_LABEL, WIDTH_MULTIPLIER_LABEL, SHADOW_COLOR_LABEL, SHADOW_INTENSITY_LABEL];

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

/**
 * Returns the raw computed value of a CSS property.
 */
async function getComputedCss(locator: Locator, property: string): Promise<string> {
	return locator.evaluate((el, prop) => window.getComputedStyle(el).getPropertyValue(prop).trim(), property);
}

/**
 * Computes contrast ratio (WCAG) for an element's text color against the nearest
 * non-transparent background in its ancestor chain.
 */
async function getContrastRatio(locator: Locator): Promise<number> {
	return locator.evaluate((element) => {
		type Rgba = { r: number; g: number; b: number; a: number };

		const normalizeColor = (value: string): string => {
			const probe = document.createElement('span');
			probe.style.color = value;
			document.body.appendChild(probe);
			const normalized = window.getComputedStyle(probe).color;
			probe.remove();
			return normalized;
		};

		const parseColor = (value: string): Rgba | null => {
			const candidate = value.trim().toLowerCase();
			if (candidate === 'transparent') {
				return { r: 0, g: 0, b: 0, a: 0 };
			}

			const normalized = normalizeColor(candidate).trim().toLowerCase();
			if (!normalized) {
				return null;
			}

			const rgbaMatch = normalized.match(/^rgba?\(([^)]+)\)$/);
			if (rgbaMatch) {
				const parts = rgbaMatch[1].split(',').map((part) => part.trim());
				if (parts.length < 3) {
					return null;
				}

				const r = Number.parseFloat(parts[0]);
				const g = Number.parseFloat(parts[1]);
				const b = Number.parseFloat(parts[2]);
				const a = parts.length >= 4 ? Number.parseFloat(parts[3]) : 1;

				if ([r, g, b, a].some((part) => Number.isNaN(part))) {
					return null;
				}

				return { r, g, b, a };
			}

			return null;
		};

		const toLinear = (channel: number): number => {
			const srgb = channel / 255;
			return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
		};

		const luminance = ({ r, g, b }: Rgba): number => {
			return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
		};

		const contrastRatio = (foreground: Rgba, background: Rgba): number => {
			const l1 = luminance(foreground);
			const l2 = luminance(background);
			const lighter = Math.max(l1, l2);
			const darker = Math.min(l1, l2);
			return (lighter + 0.05) / (darker + 0.05);
		};

		const getNearestOpaqueBackground = (node: Element): Rgba => {
			let current: Element | null = node;
			while (current) {
				const bg = parseColor(window.getComputedStyle(current).backgroundColor);
				if (bg && bg.a > 0) {
					return bg;
				}
				current = current.parentElement;
			}

			return { r: 255, g: 255, b: 255, a: 1 };
		};

		const getEffectiveTextColor = (node: Element): Rgba => {
			let current: Element | null = node;
			while (current) {
				const color = parseColor(window.getComputedStyle(current).color);
				if (color && color.a > 0) {
					return color;
				}
				current = current.parentElement;
			}

			return { r: 0, g: 0, b: 0, a: 1 };
		};

		const textColor = getEffectiveTextColor(element);
		const background = getNearestOpaqueBackground(element);
		return contrastRatio(textColor, background);
	});
}

/**
 * Expands all customizer categories so all controls are visible and testable.
 */
async function expandAllCategories(page: Page): Promise<void> {
	const headers = page.locator('.db-category-header');
	const count = await headers.count();

	for (let index = 0; index < count; index += 1) {
		const header = headers.nth(index);
		const category = header.locator('..');
		const isCollapsed = await category.evaluate((el) => el.classList.contains('db-category-collapsed'));
		if (isCollapsed) {
			await header.click();
		}
	}
}

/**
 * Changes a control value using whichever input type the control row exposes.
 */
async function changeControlValue(controlRow: Locator): Promise<void> {
	const swatchOptions = controlRow.locator('.db-swatch-select-option[aria-selected="false"]');
	if (await swatchOptions.count()) {
		await swatchOptions.first().click();
		return;
	}

	const colorInput = controlRow.locator('input[type="color"]').first();
	if (await colorInput.count()) {
		const current = await colorInput.inputValue();
		const next = current.toLowerCase() === '#00ff00' ? '#0000ff' : '#00ff00';
		await colorInput.evaluate((input: HTMLInputElement, value: string) => {
			input.value = value;
			input.dispatchEvent(new Event('input', { bubbles: true }));
		}, next);
		return;
	}

	const rangeInput = controlRow.locator('input[type="range"]').first();
	if (await rangeInput.count()) {
		const max = await rangeInput.getAttribute('max');
		await setRangeValue(rangeInput, max ?? '1');
		return;
	}

	const selectInput = controlRow.locator('select').first();
	if (await selectInput.count()) {
		const options = selectInput.locator('option');
		const optionCount = await options.count();
		if (optionCount > 1) {
			await selectInput.selectOption({ index: optionCount - 1 });
			return;
		}
	}

	throw new Error('Unable to find a supported control input in control row.');
}

/**
 * Opens the drawer so overlay and elevation visuals are active.
 */
async function openDrawer(page: Page): Promise<void> {
	const drawerElement = page.locator(DRAWER_TARGET).first();
	await drawerElement.evaluate((el) => {
		el.classList.add('is-open');
		el.setAttribute('aria-hidden', 'false');
	});

	await expect(drawerElement).toHaveClass(/is-open/);
	await expect(page.locator(OVERLAY_TARGET).first()).toBeVisible();
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

	test('drawer panel exposes the full expected control inventory', async ({ page }) => {
		await expandAllCategories(page);

		const labels = await page.locator('db-control-row .db-control-row-label-text').evaluateAll((nodes) => nodes.map((node) => node.textContent?.trim() ?? '').filter(Boolean));

		expect(labels.length).toBe(EXPECTED_VISIBLE_CONTROLS.length);
		expect(labels.sort()).toEqual([...EXPECTED_VISIBLE_CONTROLS].sort());
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

	test('changing Main Panel Color updates the drawer header background', async ({ page }) => {
		const colorsHeader = page.locator(COLORS_CATEGORY_HEADER).filter({ hasText: 'Colors' });
		await expandCategory(colorsHeader);

		const mainPanelColorRow = page.locator('db-control-row').filter({ hasText: MAIN_PANEL_COLOR_LABEL });
		const drawerHeader = page.locator(`${DRAWER_TARGET} .c-drawer__header`).first();

		const initialBackground = await getComputedCss(drawerHeader, 'background-color');
		await changeControlValue(mainPanelColorRow);
		const updatedBackground = await getComputedCss(drawerHeader, 'background-color');

		expect(updatedBackground).not.toBe(initialBackground);
	});

	test('changing Secondary Navigation Color updates the drawer body background', async ({ page }) => {
		const colorsHeader = page.locator(COLORS_CATEGORY_HEADER).filter({ hasText: 'Colors' });
		await expandCategory(colorsHeader);

		const secondaryNavigationColorRow = page.locator('db-control-row').filter({ hasText: SECONDARY_NAVIGATION_COLOR_LABEL });
		const secondaryDrawer = page.locator(`${DRAWER_TARGET}.c-drawer--duotone-secondary`).first();

		const initialBackground = await getComputedCss(secondaryDrawer, 'background-color');
		await changeControlValue(secondaryNavigationColorRow);
		const updatedBackground = await getComputedCss(secondaryDrawer, 'background-color');

		expect(updatedBackground).not.toBe(initialBackground);
	});

	test('changing Overlay Color updates the overlay background color', async ({ page }) => {
		await openDrawer(page);

		const colorsHeader = page.locator(COLORS_CATEGORY_HEADER).filter({ hasText: 'Colors' });
		await expandCategory(colorsHeader);

		const overlayColorRow = page.locator('db-control-row').filter({ hasText: OVERLAY_COLOR_LABEL });
		const overlay = page.locator(OVERLAY_TARGET).first();

		const initialOverlayBackground = await getComputedCss(overlay, 'background-color');
		await changeControlValue(overlayColorRow);
		const updatedOverlayBackground = await getComputedCss(overlay, 'background-color');

		expect(updatedOverlayBackground).not.toBe(initialOverlayBackground);
	});

	test('changing Shadow Color updates the open drawer filter rendering', async ({ page }) => {
		await openDrawer(page);

		const elevationHeader = page.locator(ELEVATION_CATEGORY_HEADER).filter({ hasText: 'Elevation' });
		await expandCategory(elevationHeader);

		const shadowColorRow = page.locator('db-control-row').filter({ hasText: SHADOW_COLOR_LABEL });
		const drawerElement = page.locator(DRAWER_TARGET).first();

		const initialFilter = await getComputedCss(drawerElement, 'filter');
		await changeControlValue(shadowColorRow);
		const updatedFilter = await getComputedCss(drawerElement, 'filter');

		expect(updatedFilter).not.toBe(initialFilter);
	});

	test('changing Shadow Intensity updates the open drawer filter rendering', async ({ page }) => {
		await openDrawer(page);

		const elevationHeader = page.locator(ELEVATION_CATEGORY_HEADER).filter({ hasText: 'Elevation' });
		await expandCategory(elevationHeader);

		const shadowIntensityRow = page.locator('db-control-row').filter({ hasText: SHADOW_INTENSITY_LABEL });
		const intensityInput = shadowIntensityRow.locator('input[type="range"]');
		await expect(intensityInput).toBeVisible();

		const drawerElement = page.locator(DRAWER_TARGET).first();
		const initialFilter = await getComputedCss(drawerElement, 'filter');

		const max = await intensityInput.getAttribute('max');
		await setRangeValue(intensityInput, max ?? '1');
		const updatedFilter = await getComputedCss(drawerElement, 'filter');

		expect(updatedFilter).not.toBe(initialFilter);
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

	test('sufficient contrast is achived on sub elements (button, search, nav)', async ({ page }) => {
		await openDrawer(page);

		// 4.5 = WCAG AA standard for normal text
		// 6.0 = ACAG AAA UI standard for graphical objects and user interface components
		const minimumContrast = 6.0;

		const drawerElement = page.locator(DRAWER_TARGET).first();
		const searchField = drawerElement.locator('input[type="search"]').first();
		const drawerButton = drawerElement.locator('.c-nav__toggle').first();
		const navLink = drawerElement.locator('.site-nav-mobile__primary .c-nav__link').first();

		await expect(searchField).toBeVisible();
		await expect(drawerButton).toBeVisible();
		await expect(navLink).toBeVisible();

		const searchContrast = await getContrastRatio(searchField);
		const buttonContrast = await getContrastRatio(drawerButton);
		const navContrast = await getContrastRatio(navLink);

		expect(searchContrast).toBeGreaterThanOrEqual(minimumContrast);
		expect(buttonContrast).toBeGreaterThanOrEqual(minimumContrast);
		expect(navContrast).toBeGreaterThanOrEqual(minimumContrast);
	});
});
