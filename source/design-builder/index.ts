/**
 * Design Builder runtime entrypoint.
 */

import './controls/RangeControl';
import './controls/SelectControl';
import './controls/ColorControl';
import './controls/RgbaControl';
import './controls/FontControl';

import { initializeDesignBuilderRootRuntime } from './app/initializeDesignBuilderRootRuntime';

function init(): void {
initializeDesignBuilderRootRuntime();
}

if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', () => {
void init();
});
} else {
void init();
}
