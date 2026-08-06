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
