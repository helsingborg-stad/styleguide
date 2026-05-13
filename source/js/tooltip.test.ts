import { afterEach, describe, expect, it } from '@jest/globals';
import Tooltip from './tooltip';

type RectInit = {
	top: number;
	left: number;
	width: number;
	height: number;
};

function createRect({ top, left, width, height }: RectInit): DOMRect {
	return {
		x: left,
		y: top,
		top,
		left,
		width,
		height,
		right: left + width,
		bottom: top + height,
		toJSON: () => '',
	} as DOMRect;
}

describe('Tooltip', () => {
	let tooltipInstance: Tooltip | null = null;

	afterEach(() => {
		tooltipInstance?.destroy();
		tooltipInstance = null;
		document.body.innerHTML = '';
		jest.restoreAllMocks();
	});

	it('renders a shared body tooltip on hover', () => {
		document.body.innerHTML = '<button type="button" data-tooltip="Tooltip text">Hover</button>';
		const trigger = document.querySelector('button') as HTMLButtonElement;

		tooltipInstance = new Tooltip();

		jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function mockGetBoundingClientRect(this: HTMLElement): DOMRect {
			if (this === trigger) {
				return createRect({ top: 100, left: 200, width: 80, height: 32 });
			}

			if (this.id === 'styleguide-tooltip') {
				return createRect({ top: 0, left: 0, width: 140, height: 40 });
			}

			return createRect({ top: 0, left: 0, width: 0, height: 0 });
		});

		trigger.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));

		const tooltip = document.body.querySelector<HTMLDivElement>('#styleguide-tooltip');
		expect(tooltip).toBeTruthy();
		expect(tooltip?.textContent).toBe('Tooltip text');
		expect(tooltip?.getAttribute('aria-hidden')).toBe('false');
		expect(tooltip?.classList.contains('is-visible')).toBe(true);
		expect(trigger.getAttribute('aria-describedby')).toBe('styleguide-tooltip');
	});

	it('flips to bottom placement when there is not enough room above', () => {
		document.body.innerHTML = '<button type="button" data-tooltip="Tooltip text">Hover</button>';
		const trigger = document.querySelector('button') as HTMLButtonElement;

		tooltipInstance = new Tooltip();

		jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function mockGetBoundingClientRect(this: HTMLElement): DOMRect {
			if (this === trigger) {
				return createRect({ top: 10, left: 40, width: 80, height: 32 });
			}

			if (this.id === 'styleguide-tooltip') {
				return createRect({ top: 0, left: 0, width: 180, height: 50 });
			}

			return createRect({ top: 0, left: 0, width: 0, height: 0 });
		});

		trigger.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));

		const tooltip = document.body.querySelector<HTMLDivElement>('#styleguide-tooltip');
		expect(tooltip?.dataset.placement).toBe('bottom');
	});

	it('hides the tooltip on pointer out', () => {
		document.body.innerHTML = '<button type="button" data-tooltip="Tooltip text">Hover</button>';
		const trigger = document.querySelector('button') as HTMLButtonElement;

		tooltipInstance = new Tooltip();

		jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function mockGetBoundingClientRect(this: HTMLElement): DOMRect {
			if (this === trigger) {
				return createRect({ top: 100, left: 200, width: 80, height: 32 });
			}

			if (this.id === 'styleguide-tooltip') {
				return createRect({ top: 0, left: 0, width: 140, height: 40 });
			}

			return createRect({ top: 0, left: 0, width: 0, height: 0 });
		});

		trigger.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));
		trigger.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: null }));

		const tooltip = document.body.querySelector<HTMLDivElement>('#styleguide-tooltip');
		expect(tooltip?.getAttribute('aria-hidden')).toBe('true');
		expect(tooltip?.classList.contains('is-visible')).toBe(false);
		expect(trigger.hasAttribute('aria-describedby')).toBe(false);
	});
});