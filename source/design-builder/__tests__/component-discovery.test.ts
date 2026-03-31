import {
	normalizeComponentName,
	getScopeKeyForElement,
	getScopeLabel,
	getScopeOptionLabel,
	GLOBAL_SCOPE_KEY,
	GENERAL_SCOPE_KEY,
} from '../core/component-discovery';

describe('normalizeComponentName', () => {
	it('lowercases, trims, and strips c- prefix', () => {
		expect(normalizeComponentName('  C-Button  ')).toBe('button');
		expect(normalizeComponentName('typography')).toBe('typography');
		expect(normalizeComponentName('')).toBe('');
	});
});

describe('getScopeKeyForElement', () => {
	it('returns global scope when no data-scope ancestor', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		expect(getScopeKeyForElement(el)).toBe(GLOBAL_SCOPE_KEY);
		document.body.removeChild(el);
	});

	it('returns scoped key when data-scope ancestor exists', () => {
		const wrapper = document.createElement('div');
		wrapper.dataset.scope = 'hero';
		const el = document.createElement('div');
		wrapper.appendChild(el);
		document.body.appendChild(wrapper);
		expect(getScopeKeyForElement(el)).toBe('scope:hero');
		document.body.removeChild(wrapper);
	});
});

describe('getScopeLabel', () => {
	it('returns empty for global scope', () => {
		expect(getScopeLabel(GLOBAL_SCOPE_KEY)).toBe('');
	});

	it('returns formatted label for named scope', () => {
		expect(getScopeLabel('scope:hero')).toBe('Scope: hero');
	});
});

describe('getScopeOptionLabel', () => {
	it('returns general label for general scope', () => {
		expect(getScopeOptionLabel(GENERAL_SCOPE_KEY)).toBe('Scope: General (all scopes)');
	});

	it('returns general label for global scope', () => {
		expect(getScopeOptionLabel(GLOBAL_SCOPE_KEY)).toBe('Scope: General');
	});

	it('returns named label for specific scope', () => {
		expect(getScopeOptionLabel('scope:sidebar')).toBe('Scope: sidebar');
	});
});
