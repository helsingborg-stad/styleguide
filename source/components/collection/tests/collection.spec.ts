import { expect, test, type Page } from '@playwright/test';

const COLLECTION_PAGE = '/components/collection';

async function mountNestedNavigation(page: Page) {
	await page.evaluate(() => {
		document.body.insertAdjacentHTML('beforeend', `
			<ul class="c-collection c-collection--nav" data-test-collection-nav>
				<li class="c-collection__item" data-test-parent>
					<button class="c-collection__secondary" type="button">
						<i data-test-disclosure-icon></i>
					</button>
				</li>
				<ul class="c-collection" data-test-nested-collection>
					<li class="c-collection__item">Nested item</li>
				</ul>
			</ul>
		`);
	});
}

test.describe('Collection navigation disclosure motion', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(COLLECTION_PAGE);
		await mountNestedNavigation(page);
	});

	test('bridges nested navigation state with a short reveal and icon rotation', async ({ page }) => {
		const parent = page.locator('[data-test-parent]');
		const icon = page.locator('[data-test-disclosure-icon]');
		const nestedCollection = page.locator('[data-test-nested-collection]');

		await expect(nestedCollection).toHaveCSS('display', 'none');
		await expect(nestedCollection).toHaveCSS('transition-duration', '0.18s, 0.18s, 0.18s');
		await expect(icon).toHaveCSS('transition-duration', '0.16s');

		await parent.evaluate((element) => element.classList.add('is-open'));
		await expect(nestedCollection).toHaveCSS('display', 'block');
		await expect(nestedCollection).toHaveCSS('opacity', '1');
		await expect(icon).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');
	});

	test('uses the existing reduced-motion duration override', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.reload();
		await mountNestedNavigation(page);

		const nestedCollection = page.locator('[data-test-nested-collection]');
		const duration = await nestedCollection.evaluate((element) => {
			return Number.parseFloat(window.getComputedStyle(element).transitionDuration);
		});

		expect(duration).toBeLessThanOrEqual(0.001);
	});
});
