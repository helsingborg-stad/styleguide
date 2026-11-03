import { expect, type Locator, type Page, test } from '@playwright/test';

const SLIDER_PAGE = '/components/slider';
const SLIDER = '[data-component="slider"]';
const PEEK_SLIDER = `${SLIDER}.c-slider__peek`;
const AUTOPLAY_SLIDER = `${SLIDER}[data-js-slider__autoslide]`;

async function setRangeValue(input: Locator, value: string): Promise<void> {
	await input.evaluate((element: HTMLInputElement, nextValue: string) => {
		element.value = nextValue;
		element.dispatchEvent(new Event('input', { bubbles: true }));
	}, value);
}

async function openSliderCustomizer(page: Page): Promise<void> {
	await page.goto(SLIDER_PAGE);
	await page.getByRole('button', { name: 'Open component customizer' }).click();
	await expect(page.locator('.db-builder-customizer')).toBeVisible();
	await page.locator('#db-component-select').selectOption('slider');
}

async function expandCategory(page: Page, name: string): Promise<void> {
	const header = page.locator('.db-category-header').filter({ hasText: name });
	const category = header.locator('..');

	if (await category.evaluate((element) => element.classList.contains('db-category-collapsed'))) {
		await header.click();
	}
}

async function rangeControl(page: Page, category: string, label: string): Promise<Locator> {
	await expandCategory(page, category);
	const input = page.locator('db-control-row').filter({ hasText: label }).locator('input[type="range"]');
	await expect(input).toBeVisible();
	return input;
}

async function computedNumber(locator: Locator, property: string): Promise<number> {
	return locator.evaluate((element, name) => Number.parseFloat(getComputedStyle(element).getPropertyValue(name)), property);
}

test.describe('Slider – Design Center controls', () => {
	test.beforeEach(async ({ page }) => {
		await openSliderCustomizer(page);
	});

	test('each exposed range control writes a changed component variable', async ({ page }) => {
		const controls = [
			['Layout', 'Slide Gap', '--c-slider--gap-multiplier'],
			['Layout', 'Track Insets', '--c-slider--padding-multiplier'],
			['Layout', 'Card Shadow Clearance', '--c-slider--shadow-clearance-multiplier'],
			['Layout', 'Next-slide Peek', '--c-slider--peek-width-multiplier'],
			['Layout', 'Peek Edge Fade', '--c-slider--peek-fade-width-multiplier'],
			['Layout', 'Preamble Measure', '--c-slider--preamble-max-width'],
			['Layout', 'Slide Content Maximum Width', '--c-slider--item-container-max-width-multiplier'],
			['Layout', 'Segment Card Minimum Height', '--c-slider--segment-card-min-height-multiplier'],
			['Header and Controls', 'Header Column Gap', '--c-slider--header-column-gap-multiplier'],
			['Header and Controls', 'Header Row Gap', '--c-slider--header-row-gap-multiplier'],
			['Header and Controls', 'Header Bottom Gap', '--c-slider--header-bottom-gap-multiplier'],
			['Header and Controls', 'Floating Control Offset', '--c-slider--control-offset-multiplier'],
			['Header and Controls', 'Large Control Inset', '--c-slider--control-inset-multiplier'],
			['Header and Controls', 'Autoplay Control Size', '--c-slider--autoplay-control-size-multiplier'],
			['Header and Controls', 'Autoplay Control Inset', '--c-slider--autoplay-control-inset-multiplier'],
			['Motion', 'Slide Fade Duration', '--c-slider--slide-fade-duration'],
			['Motion', 'Peek Edge Fade Duration', '--c-slider--peek-fade-duration'],
			['Motion', 'Autoplay Control Fade Duration', '--c-slider--autoplay-control-fade-duration'],
			['Colors', 'Overlay Opacity', '--c-slider--overlay-opacity'],
		] as const;

		const slider = page.locator(SLIDER).first();

		for (const [category, label, variable] of controls) {
			const input = await rangeControl(page, category, label);
			const before = await slider.evaluate((element, name) => getComputedStyle(element).getPropertyValue(name).trim(), variable);
			const maximum = await input.getAttribute('max');
			await setRangeValue(input, maximum ?? '1');
			const after = await slider.evaluate((element, name) => getComputedStyle(element).getPropertyValue(name).trim(), variable);

			expect(after, `${label} should change ${variable}`).not.toBe(before);
		}
	});

	test('layout controls change actual rendered dimensions', async ({ page }) => {
		const peekSlider = page.locator(PEEK_SLIDER).first();
		const inner = peekSlider.locator('.c-slider__inner');
		const item = peekSlider.locator('.c-slider__item').first();
		const track = peekSlider.locator('.c-slider__container');

		const gapBefore = await computedNumber(inner, 'column-gap');
		await setRangeValue(await rangeControl(page, 'Layout', 'Slide Gap'), '6');
		expect(await computedNumber(inner, 'column-gap')).toBeGreaterThan(gapBefore);

		const paddingBefore = await computedNumber(inner, 'padding-left');
		await setRangeValue(await rangeControl(page, 'Layout', 'Track Insets'), '4');
		expect(await computedNumber(inner, 'padding-left')).toBeGreaterThan(paddingBefore);

		const shadowClearanceBefore = await computedNumber(track, 'padding-top');
		await setRangeValue(await rangeControl(page, 'Layout', 'Card Shadow Clearance'), '3');
		expect(await computedNumber(track, 'padding-top')).toBeGreaterThan(shadowClearanceBefore);

		const peekBefore = (await track.boundingBox())!.width - (await item.boundingBox())!.width - await computedNumber(inner, 'column-gap');
		await setRangeValue(await rangeControl(page, 'Layout', 'Next-slide Peek'), '8');
		const peekAfter = (await track.boundingBox())!.width - (await item.boundingBox())!.width - await computedNumber(inner, 'column-gap');
		expect(peekAfter).toBeGreaterThan(peekBefore);
	});

	test('navigation uses standard button sizing while autoplay and motion controls update computed styles', async ({ page }) => {
		const peekSlider = page.locator(PEEK_SLIDER).first();
		const arrow = peekSlider.locator('.c-slider__arrow').first();
		const ordinarySlide = page.locator(`${SLIDER}:not(.c-slider__peek) .c-slider__item`).first();
		const autoplayToggle = page.locator(`${AUTOPLAY_SLIDER} .c-slider__autoslide-toggle`).first();

		const arrowHeight = await computedNumber(arrow, 'height');
		const standardButtonHeight = await arrow.evaluate((element) =>
			Number.parseFloat(getComputedStyle(element).getPropertyValue('--c-button-height'))
		);
		expect(arrowHeight).toBeCloseTo(standardButtonHeight, 1);

		const autoplaySizeBefore = await computedNumber(autoplayToggle, 'width');
		await setRangeValue(await rangeControl(page, 'Header and Controls', 'Autoplay Control Size'), '7');
		expect(await computedNumber(autoplayToggle, 'width')).toBeGreaterThan(autoplaySizeBefore);

		const transitionBefore = await ordinarySlide.evaluate((element) => getComputedStyle(element).transitionDuration);
		await setRangeValue(await rangeControl(page, 'Motion', 'Slide Fade Duration'), '300');
		expect(await ordinarySlide.evaluate((element) => getComputedStyle(element).transitionDuration)).not.toBe(transitionBefore);
	});
});
