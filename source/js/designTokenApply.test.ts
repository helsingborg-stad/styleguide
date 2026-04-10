import { DESIGN_BUILDER_STORAGE_ATTRIBUTE, LOCAL_STORAGE_PERSISTENCE_MODE } from '../design-builder/shared/persistence/designBuilderStorageOptIn';
import { STORAGE_KEY } from '../design-builder/shared/persistence/TokenOverrideLocalStorageStore';

describe('designTokenApply', () => {
	beforeEach(() => {
		jest.resetModules();
		localStorage.clear();
		document.documentElement.removeAttribute(DESIGN_BUILDER_STORAGE_ATTRIBUTE);
		document.documentElement.style.removeProperty('--color-primary');
	});

	afterEach(() => {
		document.documentElement.removeAttribute(DESIGN_BUILDER_STORAGE_ATTRIBUTE);
		document.documentElement.style.removeProperty('--color-primary');
	});

	it('does not apply persisted overrides without a localStorage opt-in', () => {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				token: {
					'--color-primary': '#123456',
				},
			}),
		);

		jest.isolateModules(() => {
			require('./designTokenApply.ts');
		});

		expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('');
	});

	it('applies persisted overrides when the document opts in to localStorage', () => {
		document.documentElement.setAttribute(DESIGN_BUILDER_STORAGE_ATTRIBUTE, LOCAL_STORAGE_PERSISTENCE_MODE);
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				token: {
					'--color-primary': '#123456',
				},
			}),
		);

		jest.isolateModules(() => {
			require('./designTokenApply.ts');
		});

		expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#123456');
	});
});
