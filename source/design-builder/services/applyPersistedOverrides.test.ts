import {
	applyPersistedComponentOverrides,
	applyPersistedTokenOverrides,
	clearPersistedComponentOverrides,
	clearPersistedTokenOverrides,
} from './applyPersistedOverrides';
import { GENERAL_SCOPE_KEY } from '../state/runtimeConstants';

describe('applyPersistedOverrides', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<div data-component="button"></div>
		`;
		document.documentElement.style.removeProperty('--color-primary');
	});

	afterEach(() => {
		document.body.innerHTML = '';
		document.documentElement.style.removeProperty('--color-primary');
	});

	it('applies and clears token overrides on the document root', () => {
		applyPersistedTokenOverrides({
			'--color-primary': '#123456',
		});

		expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#123456');

		clearPersistedTokenOverrides({
			'--color-primary': '#123456',
		});

		expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('');
	});

	it('applies and clears component overrides on matching component elements', () => {
		const target = document.querySelector<HTMLElement>('[data-component="button"]');
		const overrides = {
			[GENERAL_SCOPE_KEY]: {
				button: {
					'--c-button--color-bg': '#abcdef',
				},
			},
		};

		applyPersistedComponentOverrides(overrides);
		expect(target?.style.getPropertyValue('--c-button--color-bg')).toBe('#abcdef');

		clearPersistedComponentOverrides(overrides);
		expect(target?.style.getPropertyValue('--c-button--color-bg')).toBe('');
	});
});
