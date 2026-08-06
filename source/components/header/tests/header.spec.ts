import { expect, type Locator, type Page, test } from '@playwright/test';

const HEADER_PAGE = '/components/header';
const FAB_TRIGGER_LABEL = 'Open component customizer';
const COMPONENT_SELECT = '#db-component-select';
const FAB_PANEL_OPEN_CLASS = 'c-fab__panel--open';
const CUSTOMIZER_PANEL = '.db-builder-customizer';
const HEADER_TARGET = '.markup-preview [data-component="header"].o-container';
const LAYOUT_CATEGORY_HEADER = '.db-category-header';
const CONTAINER_WIDTH_LABEL = 'Container Width';
const LOGOTYPE_HEIGHT_MULTIPLIER_LABEL = 'Logotype Height Multiplier';
const LOGOTYPE_AUTO_SCALE_LABEL = 'Logotype Auto Scale';
const HEIGHT_BOUNDS_LABEL = 'Height';
const MIN_HEIGHT_LABEL = 'Min Height';
const MAX_HEIGHT_LABEL = 'Max Height';

async function expandCategory(categoryHeader: Locator): Promise<void> {
	const category = categoryHeader.locator('..');
	const isCollapsed = await category.evaluate((el) => el.classList.contains('db-category-collapsed'));
	if (isCollapsed) {
		await categoryHeader.click();
	}
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

async function selectControlOption(page: Page, label: string, optionValue: string): Promise<void> {
	const row = await getControlRow(page, label);
	const select = row.locator('select').first();
	await expect(select).toBeVisible();
	await select.selectOption(optionValue);
}

async function setRangeValue(rangeLocator: Locator, value: string): Promise<void> {
	await rangeLocator.evaluate((input: HTMLInputElement, val: string) => {
		input.value = val;
		input.dispatchEvent(new Event('input', { bubbles: true }));
	}, value);
}

async function setRangeControl(page: Page, label: string, value: string): Promise<void> {
	const row = await getControlRow(page, label);
	const input = row.locator('input[type="range"]');
	await expect(input).toBeVisible();
	await setRangeValue(input, value);
}

async function setRangeBoundsHandle(page: Page, rowLabel: string, handleLabel: string, value: string): Promise<void> {
	const row = await getControlRow(page, rowLabel);
	const input = row.locator(`input[type="range"][aria-label="${handleLabel}"]`).first();
	await expect(input).toBeVisible();
	await setRangeValue(input, value);
}

async function getComputedPx(locator: Locator, property: string): Promise<number> {
	return locator.evaluate((el, prop) => Number.parseFloat(window.getComputedStyle(el).getPropertyValue(prop)), property);
}

async function resolveCssLengthPx(locator: Locator, expression: string): Promise<number> {
	return locator.evaluate((el, valueExpression) => {
		const probe = document.createElement('div');
		probe.style.position = 'absolute';
		probe.style.visibility = 'hidden';
		probe.style.inlineSize = valueExpression;
		probe.style.pointerEvents = 'none';
		el.appendChild(probe);
		const width = Number.parseFloat(window.getComputedStyle(probe).width);
		probe.remove();
		return width;
	}, expression);
}

async function getInlineCustomProperty(locator: Locator, propertyName: string): Promise<string> {
	return locator.evaluate((el, variableName) => el.style.getPropertyValue(variableName).trim(), propertyName);
}

test.describe('Header - design panel', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 2400, height: 1200 });
		await page.goto(HEADER_PAGE);
		await expect(page.locator(HEADER_TARGET).first()).toBeVisible();

		await page.getByRole('button', { name: FAB_TRIGGER_LABEL }).click();
		await expect(page.locator(`.${FAB_PANEL_OPEN_CLASS}`)).toBeVisible();
		await expect(page.locator(CUSTOMIZER_PANEL)).toBeVisible();
		await page.locator(COMPONENT_SELECT).selectOption({ value: 'header' });
	});

	test('layout settings include container width options from container definition', async ({ page }) => {
		const layoutHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Layout' });
		await expandCategory(layoutHeader);

		const row = await getControlRow(page, CONTAINER_WIDTH_LABEL);
		const select = row.locator('select').first();
		await expect(select).toBeVisible();

		const options = await select.locator('option').evaluateAll((nodes) =>
			nodes.map((option) => ({
				value: (option as HTMLOptionElement).value,
				label: option.textContent?.trim() ?? '',
			})),
		);

		expect(options).toEqual([
			{ value: '', label: 'Default' },
			{ value: 'var(--container-width-wide)', label: 'Wide' },
			{ value: '100%', label: 'Full Width' },
		]);
	});

	test('branding shows single shared min/max controls and hides them when autoscale is off', async ({ page }) => {
		const brandingHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Branding' });
		await expandCategory(brandingHeader);

		const minControlRow = page.locator('db-control-row').filter({ has: page.locator('.db-control-row-label-text').filter({ hasText: new RegExp(`^${escapeRegExp(MIN_HEIGHT_LABEL)}$`) }) });
		const maxControlRow = page.locator('db-control-row').filter({ has: page.locator('.db-control-row-label-text').filter({ hasText: new RegExp(`^${escapeRegExp(MAX_HEIGHT_LABEL)}$`) }) });
		const boundsControlRow = page.locator('db-control-row').filter({ has: page.locator('.db-control-row-label-text').filter({ hasText: new RegExp(`^${escapeRegExp(HEIGHT_BOUNDS_LABEL)}$`) }) });

		await expect(boundsControlRow).toHaveCount(1);
		await expect(minControlRow).toHaveCount(0);
		await expect(maxControlRow).toHaveCount(0);
		await expect(boundsControlRow).toBeVisible();

		await selectControlOption(page, LOGOTYPE_AUTO_SCALE_LABEL, '0');

		await expect(boundsControlRow).not.toBeVisible();
	});

	test('container width setting updates the rendered header width', async ({ page }) => {
		const layoutHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Layout' });
		await expandCategory(layoutHeader);

		const header = page.locator(HEADER_TARGET).first();

		await selectControlOption(page, CONTAINER_WIDTH_LABEL, '');
		const defaultContentWidth = await resolveCssLengthPx(header, 'var(--c-header--content-max-width)');

		await selectControlOption(page, CONTAINER_WIDTH_LABEL, 'var(--container-width-wide)');
		const wideContentWidth = await resolveCssLengthPx(header, 'var(--c-header--content-max-width)');

		await selectControlOption(page, CONTAINER_WIDTH_LABEL, '100%');
		const fullContentWidth = await resolveCssLengthPx(header, 'var(--c-header--content-max-width)');

		expect(wideContentWidth).toBeGreaterThan(defaultContentWidth + 20);
		expect(fullContentWidth).toBeGreaterThan(wideContentWidth + 20);
	});

	test('logotype height remains stable when multiplier returns to default value', async ({ page }) => {
		await page.setViewportSize({ width: 1200, height: 1000 });
		await page.goto(HEADER_PAGE);
		await expect(page.locator(HEADER_TARGET).first()).toBeVisible();

		await page.getByRole('button', { name: FAB_TRIGGER_LABEL }).click();
		await expect(page.locator(`.${FAB_PANEL_OPEN_CLASS}`)).toBeVisible();
		await expect(page.locator(CUSTOMIZER_PANEL)).toBeVisible();
		await page.locator(COMPONENT_SELECT).selectOption({ value: 'header' });

		const brandingHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Branding' });
		await expandCategory(brandingHeader);

		const logotype = page.locator('.markup-preview .c-header__logotype').first();
		await expect(logotype).toBeVisible();

		await setRangeControl(page, LOGOTYPE_HEIGHT_MULTIPLIER_LABEL, '2');
		const changedHeight = await getComputedPx(logotype, 'height');

		await setRangeControl(page, LOGOTYPE_HEIGHT_MULTIPLIER_LABEL, '1.5');
		const restoredHeight = await getComputedPx(logotype, 'height');

		await setRangeControl(page, LOGOTYPE_HEIGHT_MULTIPLIER_LABEL, '2');
		await setRangeControl(page, LOGOTYPE_HEIGHT_MULTIPLIER_LABEL, '1.5');
		const restoredHeightRepeat = await getComputedPx(logotype, 'height');

		expect(changedHeight).toBeGreaterThan(restoredHeight + 5);
		expect(Math.abs(restoredHeightRepeat - restoredHeight)).toBeLessThan(0.5);
	});

	test('max height control is a hard cap for logotype and brand', async ({ page }) => {
		const brandingHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Branding' });
		await expandCategory(brandingHeader);

		const header = page.locator(HEADER_TARGET).first();
		await selectControlOption(page, LOGOTYPE_AUTO_SCALE_LABEL, '1');
		await setRangeBoundsHandle(page, HEIGHT_BOUNDS_LABEL, MAX_HEIGHT_LABEL, '8');
		await setRangeControl(page, LOGOTYPE_HEIGHT_MULTIPLIER_LABEL, '3');

		const logotypeMax = await resolveCssLengthPx(header, 'var(--c-header--logotype-height-max)');
		const brandMax = await resolveCssLengthPx(header, 'var(--c-header--brand-height-max)');
		const logotypeHeight = await getComputedPx(page.locator('.markup-preview .c-header__logotype').first(), 'height');
		const brandHeight = await resolveCssLengthPx(header, 'var(--c-header--brand-height)');

		expect(Math.abs(logotypeMax - 64)).toBeLessThan(0.5);
		expect(Math.abs(brandMax - 64)).toBeLessThan(0.5);
		expect(logotypeHeight).toBeLessThanOrEqual(64.5);
		expect(brandHeight).toBeLessThanOrEqual(64.5);
	});

	test('linked min/max controls prevent conflicting values', async ({ page }) => {
		const brandingHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Branding' });
		await expandCategory(brandingHeader);

		const header = page.locator(HEADER_TARGET).first();
		await selectControlOption(page, LOGOTYPE_AUTO_SCALE_LABEL, '1');

		await setRangeBoundsHandle(page, HEIGHT_BOUNDS_LABEL, MAX_HEIGHT_LABEL, '8');
		await setRangeBoundsHandle(page, HEIGHT_BOUNDS_LABEL, MIN_HEIGHT_LABEL, '11');

		const minAfterClamp = Number.parseFloat(await getInlineCustomProperty(header, '--c-header--logotype-height-min-multiplier'));
		expect(minAfterClamp).toBe(8);

		await setRangeBoundsHandle(page, HEIGHT_BOUNDS_LABEL, MIN_HEIGHT_LABEL, '7');
		await setRangeBoundsHandle(page, HEIGHT_BOUNDS_LABEL, MAX_HEIGHT_LABEL, '6');

		const maxAfterClamp = Number.parseFloat(await getInlineCustomProperty(header, '--c-header--logotype-height-max-multiplier'));
		expect(maxAfterClamp).toBe(7);
	});

	test('container width math subtracts built-in container padding on mobile and sm breakpoints', async ({ page }) => {
		const layoutHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Layout' });
		await expandCategory(layoutHeader);

		const header = page.locator(HEADER_TARGET).first();
		await selectControlOption(page, CONTAINER_WIDTH_LABEL, '100%');

		await page.setViewportSize({ width: 500, height: 1000 });
		const mobileContainerMaxWidth = await resolveCssLengthPx(header, 'var(--c-header--container-max-width)');
		const mobileContentMaxWidth = await resolveCssLengthPx(header, 'var(--c-header--content-max-width)');
		const mobileContainerPadding = await resolveCssLengthPx(header, 'var(--c-header--container-padding-inline)');

		expect(Math.abs(mobileContainerMaxWidth - mobileContentMaxWidth - mobileContainerPadding * 2)).toBeLessThan(1);

		await page.setViewportSize({ width: 900, height: 1000 });
		const smContainerMaxWidth = await resolveCssLengthPx(header, 'var(--c-header--container-max-width)');
		const smContentMaxWidth = await resolveCssLengthPx(header, 'var(--c-header--content-max-width)');
		const smContainerPadding = await resolveCssLengthPx(header, 'var(--c-header--container-padding-inline)');

		expect(Math.abs(smContainerMaxWidth - smContentMaxWidth - smContainerPadding * 2)).toBeLessThan(1);
	});
});
