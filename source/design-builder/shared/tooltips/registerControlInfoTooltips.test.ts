import { registerControlInfoTooltips, resetControlInfoTooltipsForTests } from './registerControlInfoTooltips';

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

describe('registerControlInfoTooltips', () => {
	const originalInnerWidth = window.innerWidth;
	const originalInnerHeight = window.innerHeight;

	beforeEach(() => {
		document.body.innerHTML = '';
		Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
		Object.defineProperty(window, 'innerHeight', { configurable: true, value: 768 });
		registerControlInfoTooltips();
	});

	afterEach(() => {
		resetControlInfoTooltipsForTests();
		document.body.innerHTML = '';
		jest.restoreAllMocks();
		Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth });
		Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInnerHeight });
	});

	it('renders control info text in a shared body-level tooltip', () => {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'db-control-info-btn db-tooltip-target';
		button.dataset.tooltip = 'Controls body text size\n--font-size-body';
		document.body.appendChild(button);

		jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function mockGetBoundingClientRect(this: HTMLElement): DOMRect {
			if (this === button) {
				return createRect({ top: 40, left: 500, width: 16, height: 16 });
			}

			if (this.id === 'db-control-info-tooltip') {
				return createRect({ top: 0, left: 0, width: 180, height: 48 });
			}

			return createRect({ top: 0, left: 0, width: 0, height: 0 });
		});

		button.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));

		const tooltip = document.body.querySelector<HTMLDivElement>('#db-control-info-tooltip');
		expect(tooltip).toBeTruthy();
		expect(tooltip?.textContent).toBe('Controls body text size\n--font-size-body');
		expect(tooltip?.getAttribute('aria-hidden')).toBe('false');
		expect(tooltip?.style.left).toBe('418px');
		expect(tooltip?.style.top).toBe('62px');
		expect(tooltip?.style.getPropertyValue('--db-tooltip-arrow-left')).toBe('90px');
		expect(tooltip?.dataset.placement).toBe('bottom');
		expect(button.getAttribute('aria-describedby')).toBe('db-control-info-tooltip');
	});

	it('clamps the shared tooltip inside the viewport when space is limited', () => {
		Object.defineProperty(window, 'innerHeight', { configurable: true, value: 100 });
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'db-control-info-btn db-tooltip-target';
		button.dataset.tooltip = 'Token info';
		document.body.appendChild(button);

		jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function mockGetBoundingClientRect(this: HTMLElement): DOMRect {
			if (this === button) {
				return createRect({ top: 20, left: 980, width: 16, height: 16 });
			}

			if (this.id === 'db-control-info-tooltip') {
				return createRect({ top: 0, left: 0, width: 300, height: 60 });
			}

			return createRect({ top: 0, left: 0, width: 0, height: 0 });
		});

		button.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));

		const tooltip = document.body.querySelector<HTMLDivElement>('#db-control-info-tooltip');
		expect(tooltip?.style.left).toBe('712px');
		expect(tooltip?.style.top).toBe('42px');
		expect(tooltip?.style.getPropertyValue('--db-tooltip-arrow-left')).toBe('276px');
		expect(tooltip?.dataset.placement).toBe('bottom');
	});

	it('hides the shared tooltip when leaving the info button', () => {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'db-control-info-btn db-tooltip-target';
		button.dataset.tooltip = 'Token info';
		document.body.appendChild(button);

		jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function mockGetBoundingClientRect(this: HTMLElement): DOMRect {
			if (this === button) {
				return createRect({ top: 20, left: 40, width: 16, height: 16 });
			}

			if (this.id === 'db-control-info-tooltip') {
				return createRect({ top: 0, left: 0, width: 140, height: 40 });
			}

			return createRect({ top: 0, left: 0, width: 0, height: 0 });
		});

		button.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));
		button.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: null }));

		const tooltip = document.body.querySelector<HTMLDivElement>('#db-control-info-tooltip');
		expect(tooltip?.getAttribute('aria-hidden')).toBe('true');
		expect(tooltip?.textContent).toBe('');
		expect(tooltip?.style.getPropertyValue('--db-tooltip-arrow-left')).toBe('');
		expect(tooltip?.dataset.placement).toBeUndefined();
		expect(button.hasAttribute('aria-describedby')).toBe(false);
	});
});