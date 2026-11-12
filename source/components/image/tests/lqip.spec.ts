import { expect, test } from '@playwright/test';

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
	test(`the low quality preview matches the loaded crop at ${viewport.width}px`, async ({ page }) => {
		await page.setViewportSize(viewport);
		// This example is self-contained; unrelated external images and fonts must not affect the test.
		await page.route(/^https:\/\//, (route) => route.abort());
		let releasePhoto!: () => void;
		const photoGate = new Promise<void>((resolve) => { releasePhoto = resolve; });
		await page.route(/\/assets\/img\/1026-(300x200|900x600)\.jpg$/, async (route) => {
			await photoGate;
			await route.continue();
		});

		try {
			await page.goto('/components/image', { waitUntil: 'domcontentloaded' });
			const figure = page.locator('figure.c-image').filter({ hasText: 'The preview and the full image use the same focus point' });
			const frame = figure.locator('.c-image__image-wrapper');
			const photo = frame.locator('img');
			await frame.scrollIntoViewIfNeeded();
			await expect(frame).toBeInViewport();

			await expect(frame).toHaveCSS('background-position', '80% 60%');
			await expect(photo).toHaveCSS('object-position', '80% 60%');
			await expect(photo).toHaveCSS('object-fit', 'cover');
			const preview = await frame.evaluate(async (element) => {
				const background = getComputedStyle(element, '::before').backgroundImage;
				const url = background.match(/^url\("(.*)"\)$/)?.[1];
				if (!url) throw new Error('No placeholder background');
				const img = new Image();
				img.src = url;
				await img.decode();
				return [img.naturalWidth, img.naturalHeight];
			});
			expect(preview).toEqual([36, 24]);
			expect(await photo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(0);
			const before = await frame.boundingBox();

			releasePhoto();
			await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(36);
			const after = await frame.boundingBox();
			const loaded = await photo.boundingBox();
			expect(before).not.toBeNull();
			expect(after).not.toBeNull();
			expect(loaded).not.toBeNull();
			expect(after!.width).toBeCloseTo(before!.width, 0);
			expect(after!.height).toBeCloseTo(before!.height, 0);
			expect(loaded!.width).toBeCloseTo(after!.width, 0);
			expect(loaded!.height).toBeCloseTo(after!.height, 0);
			expect(loaded!.x).toBeCloseTo(after!.x, 0);
			expect(loaded!.y).toBeCloseTo(after!.y, 0);
		} finally {
			releasePhoto();
		}
	});
}
