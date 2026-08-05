import { expect, type Locator, type Page, test } from '@playwright/test';

const HEADER_PAGE = '/components/header';
const FAB_TRIGGER_LABEL = 'Open component customizer';
const COMPONENT_SELECT = '#db-component-select';
const FAB_PANEL_OPEN_CLASS = 'c-fab__panel--open';
const CUSTOMIZER_PANEL = '.db-builder-customizer';
const HEADER_TARGET = '.markup-preview [data-component="header"].o-container';
const LAYOUT_CATEGORY_HEADER = '.db-category-header';
const CONTAINER_WIDTH_LABEL = 'Container Width';
const HORIZONTAL_MARGIN_LABEL = 'Horizontal Margin';

const CONTAINER_WIDTH_VARIANTS = [
	{ optionValue: '', label: 'Default', containerModifierClass: '' },
	{ optionValue: 'var(--container-width-wide)', label: 'Wide', containerModifierClass: 'o-container--wide' },
	{ optionValue: '100%', label: 'Full Width', containerModifierClass: 'o-container--fullwidth' },
] as const;

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

async function getHeaderContentWidthPx(header: Locator): Promise<number> {
	return header.evaluate((el) => {
		const rect = el.getBoundingClientRect();
		const styles = getComputedStyle(el);
		const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
		const paddingRight = Number.parseFloat(styles.paddingRight) || 0;
		return rect.width - paddingLeft - paddingRight;
	});
}

async function getContainerVariantWidthPx(page: Page, containerModifierClass: string): Promise<number> {
	return page.evaluate((modifier) => {
		const probe = document.createElement('div');
		probe.className = ['o-container', modifier].filter(Boolean).join(' ');
		probe.style.padding = '0';
		probe.style.margin = '0 auto';
		probe.style.border = '0';
		probe.style.visibility = 'hidden';

		const mountPoint = document.querySelector('.markup-preview') ?? document.body;
		mountPoint.appendChild(probe);
		const width = probe.getBoundingClientRect().width;
		probe.remove();

		return width;
	}, containerModifierClass);
}

test.describe('Header - container width parity with o-container variants', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 2400, height: 1200 });
		await page.goto(HEADER_PAGE);
		await expect(page.locator(HEADER_TARGET).first()).toBeVisible();

		await page.getByRole('button', { name: FAB_TRIGGER_LABEL }).click();
		await expect(page.locator(`.${FAB_PANEL_OPEN_CLASS}`)).toBeVisible();
		await expect(page.locator(CUSTOMIZER_PANEL)).toBeVisible();
		await page.locator(COMPONENT_SELECT).selectOption({ value: 'header' });

		const layoutHeader = page.locator(LAYOUT_CATEGORY_HEADER).filter({ hasText: 'Layout' });
		await expandCategory(layoutHeader);
	});

	test('container width variants resolve to the same rendered width as matching o-container variants', async ({ page }) => {
		// Arrange
		const header = page.locator(HEADER_TARGET).first();
		await selectControlOption(page, HORIZONTAL_MARGIN_LABEL, '0');

		// Act + Assert
		for (const variant of CONTAINER_WIDTH_VARIANTS) {
			await selectControlOption(page, CONTAINER_WIDTH_LABEL, variant.optionValue);

			const renderedHeaderContentWidth = await getHeaderContentWidthPx(header);
			const renderedContainerVariantWidth = await getContainerVariantWidthPx(page, variant.containerModifierClass);

			expect(renderedHeaderContentWidth, `Expected header content width for ${variant.label} to match o-container variant width`).toBeCloseTo(renderedContainerVariantWidth, 0);
		}
	});
});
