import { expect, type Locator, type Page, test } from '@playwright/test';

/**
 * Footer component - Design panel integration tests.
 *
 * These tests verify that every Footer component setting exposed in the
 * Design Builder changes the rendered footer or its computed component values.
 */

const FOOTER_PAGE = '/components/footer';
const FAB_TRIGGER_LABEL = 'Open component customizer';
const COMPONENT_SELECT = '#db-component-select';
const FAB_PANEL_OPEN_CLASS = 'c-fab__panel--open';
const CUSTOMIZER_PANEL = '.db-builder-customizer';
const FOOTER_TARGET = '#site-footer-abc';
const FOOTER_COMPONENT = '[data-component="footer"]';

const COLOR_SCHEME_LABEL = 'Color Scheme';
const LOGOTYPE_HEIGHT_LABEL = 'Logotype Height Multiplier';
const SUBFOOTER_LOGOTYPE_HEIGHT_LABEL = 'Subfooter Logotype Height Multiplier';
const OUTER_PADDING_LABEL = 'Padding Multiplier';
const GAP_LABEL = 'Gap Multiplier';
const SUBFOOTER_BORDER_LABEL = 'Subfooter Top Border';
const COLUMNS_LABEL = 'Number of Columns';
const LOGOTYPE_ALIGNMENT_LABEL = 'Logotype Alignment';
const TEXT_ALIGNMENT_LABEL = 'Text Alignment';
const PREFOOTER_TEXT_ALIGNMENT_LABEL = 'Text Alignment [Prefooter/Below Logotype]';
const SUBFOOTER_JUSTIFY_LABEL = 'Subfooter Alignment';
const SUBFOOTER_DIRECTION_LABEL = 'Subfooter Direction';
const BACKGROUND_OPACITY_LABEL = 'Background Opacity';
const SUBFOOTER_BACKGROUND_OPACITY_LABEL = 'Subfooter Background Opacity';
const BACKGROUND_ROTATION_LABEL = 'Background Rotation';
const BACKGROUND_POSITION_LABEL = 'Background Position';
const BACKGROUND_REPEAT_LABEL = 'Background Repeat';
const BACKGROUND_SIZE_LABEL = 'Background Size';
const BACKGROUND_BLEND_MODE_LABEL = 'Background Blend Mode';

const EXPECTED_VISIBLE_CONTROLS = [
	COLOR_SCHEME_LABEL,
	LOGOTYPE_HEIGHT_LABEL,
	SUBFOOTER_LOGOTYPE_HEIGHT_LABEL,
	OUTER_PADDING_LABEL,
	GAP_LABEL,
	SUBFOOTER_BORDER_LABEL,
	COLUMNS_LABEL,
	LOGOTYPE_ALIGNMENT_LABEL,
	TEXT_ALIGNMENT_LABEL,
	PREFOOTER_TEXT_ALIGNMENT_LABEL,
	SUBFOOTER_JUSTIFY_LABEL,
	SUBFOOTER_DIRECTION_LABEL,
	BACKGROUND_OPACITY_LABEL,
	SUBFOOTER_BACKGROUND_OPACITY_LABEL,
	BACKGROUND_ROTATION_LABEL,
	BACKGROUND_POSITION_LABEL,
	BACKGROUND_REPEAT_LABEL,
	BACKGROUND_SIZE_LABEL,
	BACKGROUND_BLEND_MODE_LABEL,
];

async function setRangeValue(rangeLocator: Locator, value: string): Promise<void> {
	await rangeLocator.evaluate((input: HTMLInputElement, val: string) => {
		input.value = val;
		input.dispatchEvent(new Event('input', { bubbles: true }));
	}, value);
}

async function expandCategory(categoryHeader: Locator): Promise<void> {
	const category = categoryHeader.locator('..');
	const isCollapsed = await category.evaluate((el) => el.classList.contains('db-category-collapsed'));
	if (isCollapsed) {
		await categoryHeader.click();
	}
}

async function expandAllCategories(page: Page): Promise<void> {
	const headers = page.locator('.db-category-header');
	const count = await headers.count();

	for (let index = 0; index < count; index += 1) {
		await expandCategory(headers.nth(index));
	}
}

async function getComputedPx(locator: Locator, property: string): Promise<number> {
	return locator.evaluate((el, prop) => Number.parseFloat(window.getComputedStyle(el).getPropertyValue(prop)), property);
}

async function getComputedCss(locator: Locator, property: string): Promise<string> {
	return locator.evaluate((el, prop) => window.getComputedStyle(el).getPropertyValue(prop).trim(), property);
}

async function getPseudoCss(locator: Locator, pseudo: string, property: string): Promise<string> {
	return locator.evaluate((el, { pseudoSelector, cssProperty }) => window.getComputedStyle(el, pseudoSelector).getPropertyValue(cssProperty).trim(), {
		pseudoSelector: pseudo,
		cssProperty: property,
	});
}

async function resolveCssVariableColor(locator: Locator, variableName: string): Promise<string> {
	return locator.evaluate((el, customPropertyName) => {
		const probe = document.createElement('span');
		probe.style.color = `var(${customPropertyName})`;
		probe.style.display = 'none';
		el.appendChild(probe);
		const resolvedColor = window.getComputedStyle(probe).color.trim();
		probe.remove();
		return resolvedColor;
	}, variableName);
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getControlRow(page: Page, label: string): Promise<Locator> {
	const exactLabel = page.locator('.db-control-row-label-text').filter({ hasText: new RegExp(`^${escapeRegExp(label)}$`) });
	const row = page.locator('db-control-row').filter({ has: exactLabel }).first();
	await expect(row).toBeVisible();
	return row;
}

async function setRangeControl(page: Page, label: string, value: string): Promise<void> {
	const row = await getControlRow(page, label);
	const input = row.locator('input[type="range"]');
	await expect(input).toBeVisible();
	await setRangeValue(input, value);
}

async function selectControlOption(page: Page, label: string, optionValue: string): Promise<void> {
	const row = await getControlRow(page, label);
	const select = row.locator('select').first();
	await expect(select).toBeVisible();
	await select.selectOption(optionValue);
}

async function chooseNextSwatch(page: Page, label: string): Promise<void> {
	const row = await getControlRow(page, label);
	const swatchOption = row.locator('.db-swatch-select-option[aria-selected="false"]').first();
	await expect(swatchOption).toBeVisible();
	await swatchOption.click();
}

test.describe('Footer - design panel', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(FOOTER_PAGE);
		await expect(page.locator(FOOTER_TARGET)).toBeVisible();

		await page.getByRole('button', { name: FAB_TRIGGER_LABEL }).click();
		await expect(page.locator(`.${FAB_PANEL_OPEN_CLASS}`)).toBeVisible();
		await expect(page.locator(CUSTOMIZER_PANEL)).toBeVisible();
		await page.locator(COMPONENT_SELECT).selectOption({ value: 'footer' });
	});

	test('opens the design panel when the FAB button is clicked', async ({ page }) => {
		await expect(page.locator(CUSTOMIZER_PANEL)).toBeVisible();
	});

	test('design panel shows footer component settings', async ({ page }) => {
		await expect(page.locator('.db-category-header').filter({ hasText: 'Layout' })).toBeVisible();
		await expect(page.locator('.db-category-header').filter({ hasText: 'Background Image' })).toBeVisible();
	});

	test('footer panel exposes the full expected control inventory', async ({ page }) => {
		await expandAllCategories(page);

		const labels = await page.locator('db-control-row .db-control-row-label-text').evaluateAll((nodes) => nodes.map((node) => node.textContent?.trim() ?? '').filter(Boolean));

		expect(labels.length).toBe(EXPECTED_VISIBLE_CONTROLS.length);
		expect(labels.sort()).toEqual([...EXPECTED_VISIBLE_CONTROLS].sort());
	});

	test('changing Color Scheme updates the footer background color', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Colors' }));

		const footer = page.locator(FOOTER_TARGET);
		const initialBackground = await getComputedCss(footer, 'background-color');
		await chooseNextSwatch(page, COLOR_SCHEME_LABEL);
		const updatedBackground = await getComputedCss(footer, 'background-color');

		expect(updatedBackground).not.toBe(initialBackground);
	});

	test('changing Logotype Height Multiplier updates the footer logotype height', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Branding' }));

		const logotype = page.locator(`${FOOTER_TARGET} .c-footer__logotype`).first();
		const initialHeight = await getComputedPx(logotype, 'height');
		await setRangeControl(page, LOGOTYPE_HEIGHT_LABEL, '12');
		const updatedHeight = await getComputedPx(logotype, 'height');

		expect(updatedHeight).toBeGreaterThan(initialHeight);
	});

	test('changing Subfooter Logotype Height Multiplier updates the subfooter logotype height', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Branding' }));

		const logotype = page.locator(`${FOOTER_TARGET} .c-footer__subfooter__logotype`).first();
		const initialHeight = await getComputedPx(logotype, 'height');
		await setRangeControl(page, SUBFOOTER_LOGOTYPE_HEIGHT_LABEL, '12');
		const updatedHeight = await getComputedPx(logotype, 'height');

		expect(updatedHeight).toBeGreaterThan(initialHeight);
	});

	test('changing Outer Padding Inset Multiplier updates main footer padding', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Layout' }));

		const mainWrapper = page.locator(`${FOOTER_TARGET} .c-footer__main-wrapper`).first();
		const initialPadding = await getComputedPx(mainWrapper, 'padding-left');
		await setRangeControl(page, OUTER_PADDING_LABEL, '8');
		const updatedPadding = await getComputedPx(mainWrapper, 'padding-left');

		expect(updatedPadding).toBeGreaterThan(initialPadding);
	});

	test('footer outer padding is reduced on smaller viewports', async ({ page }) => {
		await page.setViewportSize({ width: 1600, height: 900 });
		const mainWrapper = page.locator(`${FOOTER_TARGET} .c-footer__main-wrapper`).first();
		const desktopPadding = await getComputedPx(mainWrapper, 'padding-left');

		await page.setViewportSize({ width: 820, height: 900 });
		const mobilePadding = await getComputedPx(mainWrapper, 'padding-left');

		expect(mobilePadding).toBeLessThan(desktopPadding);
	});

	test('changing Gap Multiplier updates footer grid gap', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Layout' }));

		const mainWrapper = page.locator(`${FOOTER_TARGET} .c-footer__main-wrapper`).first();
		const initialGap = await getComputedPx(mainWrapper, 'gap');
		await setRangeControl(page, GAP_LABEL, '2.5');
		const updatedGap = await getComputedPx(mainWrapper, 'gap');

		expect(updatedGap).toBeGreaterThan(initialGap);
	});

	test('changing Subfooter Top Border toggles the subfooter border width', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Layout' }));

		const subfooter = page.locator(`${FOOTER_TARGET} .c-footer__subfooter`).first();
		const initialBorderWidth = await getComputedPx(subfooter, 'border-top-width');
		await selectControlOption(page, SUBFOOTER_BORDER_LABEL, 'var(--c-footer--subfooter-border-width-token)');
		const updatedBorderWidth = await getComputedPx(subfooter, 'border-top-width');

		expect(initialBorderWidth).toBe(0);
		expect(updatedBorderWidth).toBeGreaterThan(initialBorderWidth);
	});

	test('changing Number of Columns updates the footer content grid columns', async ({ page }) => {
		await page.setViewportSize({ width: 1600, height: 900 });
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Layout' }));

		const grid = page.locator(`${FOOTER_TARGET} .c-footer__content-wrapper > .o-container > .o-grid, ${FOOTER_TARGET} .c-footer__main-wrapper > .o-container > .o-grid`).first();
		await selectControlOption(page, COLUMNS_LABEL, '4');
		const columns = await getComputedCss(grid, 'grid-template-columns');

		expect(columns.split(' ').length).toBe(4);
	});

	test('footer content grid reduces columns on smaller viewports', async ({ page }) => {
		await page.setViewportSize({ width: 820, height: 900 });
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Layout' }));

		const grid = page.locator(`${FOOTER_TARGET} .c-footer__content-wrapper > .o-container > .o-grid, ${FOOTER_TARGET} .c-footer__main-wrapper > .o-container > .o-grid`).first();
		await selectControlOption(page, COLUMNS_LABEL, '4');
		const columns = await getComputedCss(grid, 'grid-template-columns');

		expect(columns.split(' ').length).toBeLessThan(4);
	});

	test('changing Logotype Alignment updates the logotype wrapper alignment', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Layout' }));

		const headerGrid = page.locator(`${FOOTER_TARGET} .c-footer__header-wrapper .o-grid-12`).first();
		await selectControlOption(page, LOGOTYPE_ALIGNMENT_LABEL, 'flex-end');
		await expect(headerGrid).toHaveCSS('justify-content', 'flex-end');
	});

	test('hovering the footer logotype applies the resolved hover mask color', async ({ page }) => {
		const logotypeWrapper = page.locator(`${FOOTER_TARGET} .c-footer__header-wrapper .c-link`).first();
		const logotype = page.locator(`${FOOTER_TARGET} .c-footer__logotype`).first();
		const initialMaskColor = await getPseudoCss(logotype, '::before', 'background-color');
		const expectedHoverMaskColor = await resolveCssVariableColor(logotype, '--c-logotype--mask-color-hover');

		await logotypeWrapper.scrollIntoViewIfNeeded();
		await logotypeWrapper.hover({ force: true });

		await expect.poll(async () => getPseudoCss(logotype, '::before', 'background-color')).toBe(expectedHoverMaskColor);
		expect(expectedHoverMaskColor).not.toBe(initialMaskColor);
	});

	test('changing Text Alignment updates footer widget text alignment', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Layout' }));

		const widget = page.locator(`${FOOTER_TARGET} .c-footer__widget-area`).first();
		await selectControlOption(page, TEXT_ALIGNMENT_LABEL, 'center');
		await expect(widget).toHaveCSS('text-align', 'center');
	});

	test('small viewport keeps the selected footer widget text alignment', async ({ page }) => {
		await page.setViewportSize({ width: 820, height: 900 });
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Layout' }));

		const widget = page.locator(`${FOOTER_TARGET} .c-footer__widget-area`).first();
		await selectControlOption(page, TEXT_ALIGNMENT_LABEL, 'right');
		await expect(widget).toHaveCSS('text-align', 'right');
	});

	test('hovering footer links applies the resolved link hover color', async ({ page }) => {
		const componentLink = page.locator(`${FOOTER_TARGET} .c-footer__widget-area .c-link`).first();
		const plainLink = page.locator(`${FOOTER_TARGET} .c-footer__widget-area a[href="#lorem-link-5"]`).first();

		const componentExpectedHoverColor = await resolveCssVariableColor(componentLink, '--c-link--state-link-color-mix');
		await componentLink.hover();
		await expect(componentLink).toHaveCSS('color', componentExpectedHoverColor);

		const plainExpectedHoverColor = await resolveCssVariableColor(plainLink, '--c-link--state-link-color-mix');
		await plainLink.hover();
		await expect(plainLink).toHaveCSS('color', plainExpectedHoverColor);
		expect(plainExpectedHoverColor).toBeTruthy();
	});

	test('changing Prefooter Text Alignment updates prefooter text alignment', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Layout' }));

		const prefooter = page.locator(`${FOOTER_TARGET} .c-footer__prefooter-wrapper`).first();
		await selectControlOption(page, PREFOOTER_TEXT_ALIGNMENT_LABEL, 'right');
		await expect(prefooter).toHaveCSS('text-align', 'right');
	});

	test('changing Subfooter Justify Content updates wrapper distribution', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Layout' }));

		const wrapper = page.locator(`${FOOTER_TARGET} .c-footer__subfooter__wrapper`).first();
		await selectControlOption(page, SUBFOOTER_JUSTIFY_LABEL, 'space-between');
		await expect(wrapper).toHaveCSS('justify-content', 'space-between');
	});

	test('subfooter keeps visible gap between logo and list for left center and right alignments', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Layout' }));

		const wrapper = page.locator(`${FOOTER_TARGET} .c-footer__subfooter__wrapper`).first();
		const alignments = ['flex-start', 'center', 'flex-end'];

		for (const alignment of alignments) {
			await selectControlOption(page, SUBFOOTER_JUSTIFY_LABEL, alignment);

			const distance = await wrapper.evaluate((element) => {
				const logoElement = element.querySelector('.c-footer__subfooter__logotype-wrapper');
				const listElement = element.querySelector('.c-footer__subfooter__list');

				if (!logoElement || !listElement) {
					return -1;
				}

				const logoRect = logoElement.getBoundingClientRect();
				const listRect = listElement.getBoundingClientRect();

				return listRect.left - logoRect.right;
			});

			expect(distance).toBeGreaterThan(0);
		}
	});

	test('changing Subfooter Direction reverses the wrapper direction', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Layout' }));

		const wrapper = page.locator(`${FOOTER_TARGET} .c-footer__subfooter__wrapper`).first();
		await selectControlOption(page, SUBFOOTER_DIRECTION_LABEL, 'row-reverse');
		await expect(wrapper).toHaveCSS('flex-direction', 'row-reverse');
	});

	test('subfooter stacks and centers content on small mobile viewports', async ({ page }) => {
		await page.setViewportSize({ width: 360, height: 740 });

		const wrapper = page.locator(`${FOOTER_TARGET} .c-footer__subfooter__wrapper`).first();
		const list = page.locator(`${FOOTER_TARGET} .c-footer__subfooter__list`).first();
		const logotypeWrapper = page.locator(`${FOOTER_TARGET} .c-footer__subfooter__logotype-wrapper`).first();
		const separator = page.locator(`${FOOTER_TARGET} .c-footer__subfooter__list li`).nth(1);

		await expect(wrapper).toHaveCSS('flex-direction', 'column');
		await expect(wrapper).toHaveCSS('justify-content', 'center');
		await expect(list).toHaveCSS('flex-direction', 'column');
		await expect(list).toHaveCSS('justify-content', 'center');
		await expect(logotypeWrapper).toHaveCSS('justify-content', 'center');
		expect(await getPseudoCss(separator, '::before', 'display')).toBe('none');
	});

	test('changing Background Opacity updates the footer background layer opacity', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Background Image' }));

		const footer = page.locator(FOOTER_TARGET);
		await setRangeControl(page, BACKGROUND_OPACITY_LABEL, '0.25');
		const opacity = await getPseudoCss(footer, '::before', 'opacity');

		expect(opacity).toBe('0.25');
	});

	test('changing Subfooter Background Opacity updates the subfooter background color', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Background Image' }));

		const subfooter = page.locator(`${FOOTER_TARGET} .c-footer__subfooter`).first();
		const initialBackground = await getComputedCss(subfooter, 'background-color');
		await setRangeControl(page, SUBFOOTER_BACKGROUND_OPACITY_LABEL, '30');
		const updatedBackground = await getComputedCss(subfooter, 'background-color');

		expect(updatedBackground).not.toBe(initialBackground);
	});

	test('changing Background Rotation updates the footer background transform', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Background Image' }));

		const footer = page.locator(FOOTER_TARGET);
		const initialTransform = await getPseudoCss(footer, '::before', 'transform');
		await setRangeControl(page, BACKGROUND_ROTATION_LABEL, '7');
		const updatedTransform = await getPseudoCss(footer, '::before', 'transform');

		expect(updatedTransform).not.toBe(initialTransform);
	});

	test('changing Background Position updates the footer background layer position', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Background Image' }));

		const footer = page.locator(FOOTER_TARGET);
		await selectControlOption(page, BACKGROUND_POSITION_LABEL, 'left top');
		const position = await getPseudoCss(footer, '::before', 'background-position');

		expect(position).toBe('0% 0%');
	});

	test('changing Background Repeat updates the footer background layer repeat mode', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Background Image' }));

		const footer = page.locator(FOOTER_TARGET);
		await selectControlOption(page, BACKGROUND_REPEAT_LABEL, 'repeat-x');
		const repeat = await getPseudoCss(footer, '::before', 'background-repeat');

		expect(repeat).toBe('repeat-x');
	});

	test('changing Background Size updates the footer background layer size', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Background Image' }));

		const footer = page.locator(FOOTER_TARGET);
		await selectControlOption(page, BACKGROUND_SIZE_LABEL, 'contain');
		const size = await getPseudoCss(footer, '::before', 'background-size');

		expect(size).toBe('contain');
	});

	test('changing Background Blend Mode updates the footer background layer blend mode', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Background Image' }));

		const footer = page.locator(FOOTER_TARGET);
		await selectControlOption(page, BACKGROUND_BLEND_MODE_LABEL, 'overlay');
		const blendMode = await getPseudoCss(footer, '::before', 'background-blend-mode');

		expect(blendMode).toBe('overlay');
	});

	test('resetting the footer component restores the original gap', async ({ page }) => {
		await expandCategory(page.locator('.db-category-header').filter({ hasText: 'Layout' }));

		const mainWrapper = page.locator(`${FOOTER_TARGET} .c-footer__main-wrapper`).first();
		const initialGap = await getComputedPx(mainWrapper, 'gap');
		await setRangeControl(page, GAP_LABEL, '2.5');
		expect(await getComputedPx(mainWrapper, 'gap')).toBeGreaterThan(initialGap);

		page.once('dialog', (dialog) => dialog.accept());
		await page.locator('[data-action="reset-component"]').click();

		const restoredGap = await getComputedPx(mainWrapper, 'gap');
		expect(restoredGap).toBeCloseTo(initialGap, 1);
	});

	test('footer page has a footer component target for design settings', async ({ page }) => {
		await expect(page.locator(FOOTER_COMPONENT).first()).toBeVisible();
		await expect(page.locator(FOOTER_TARGET)).toBeVisible();
	});

	test('basic footer body stays aligned with the footer container', async ({ page }) => {
		const basicFooter = page.locator(`${FOOTER_COMPONENT}:has(> .c-footer__body)`).first();
		const basicFooterBody = basicFooter.locator('> .c-footer__body');

		await expect(basicFooter).toBeVisible();
		await expect(basicFooterBody).toBeVisible();

		const footerBox = await basicFooter.boundingBox();
		const bodyBox = await basicFooterBody.boundingBox();

		expect(footerBox).not.toBeNull();
		expect(bodyBox).not.toBeNull();
		expect(bodyBox!.x).toBeCloseTo(footerBox!.x, 1);
		expect(bodyBox!.width).toBeCloseTo(footerBox!.width, 1);
	});
});
