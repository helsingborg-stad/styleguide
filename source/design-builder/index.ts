/**
 * Design Builder runtime entrypoint.
 */

import './shared/control-elements/controls/RangeControl';
import './shared/control-elements/controls/SelectControl';
import './shared/control-elements/controls/ColorControl';
import './shared/control-elements/controls/RgbaControl';
import './shared/control-elements/controls/FontControl';

import { initializeStyleguideDesignBuilder } from './hosts/styleguide/initializeStyleguideDesignBuilder';

function init(): void {
	initializeStyleguideDesignBuilder();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		void init();
	});
} else {
	void init();
}
