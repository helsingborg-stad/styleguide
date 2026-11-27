import { test, expect } from '@playwright/test';
import * as sass from 'sass';

const boundaryCss = sass.compile('source/components/inheritboundary/entry.scss').css;
const layerOrder = sass.compile('source/sass/_layers.scss').css;

for (const boundaryFirst of [true, false]) {
    test(`boundary resets win with boundary asset loaded ${boundaryFirst ? 'first' : 'last'}`, async ({ page }) => {
        const competingCss = `${layerOrder}
            @layer components { #container .root { --inherit-color-contrast: red; } }
            @layer theme { #container .root { --inherit-color-contrast: blue; } }
            @layer components {
                .local-context { --inherit-color-contrast: green; }
                .consumer { color: var(--inherit-color-contrast, rgb(1, 2, 3)); }
            }`;
        await page.setContent(`
            <style>${boundaryFirst ? boundaryCss + competingCss : competingCss + boundaryCss}</style>
            <div id="container" style="--inherit-color-contrast: purple">
                <div class="root" data-inherit-boundary>
                    <span id="reset" class="consumer">Reset</span>
                    <div class="local-context">
                        <span id="local" class="consumer">Local context</span>
                        <div data-inherit-boundary><span id="nested" class="consumer">Nested reset</span></div>
                    </div>
                </div>
                <span id="outside" class="consumer">Outside</span>
            </div>`);
        await expect(page.locator('#reset')).toHaveCSS('color', 'rgb(1, 2, 3)');
        await expect(page.locator('#local')).toHaveCSS('color', 'rgb(0, 128, 0)');
        await expect(page.locator('#nested')).toHaveCSS('color', 'rgb(1, 2, 3)');
        await expect(page.locator('#outside')).toHaveCSS('color', 'rgb(128, 0, 128)');
    });
}
