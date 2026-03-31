import { normalizeComponentName, parseComponentTokenData, isTokenData } from '../index';
import { ComponentOverrideManager } from '../core/component-override-manager';

describe('normalizeComponentName', () => {
	it('lowercases and trims', () => {
		expect(normalizeComponentName('  Button  ')).toBe('button');
	});

	it('removes c- prefix', () => {
		expect(normalizeComponentName('c-button')).toBe('button');
		expect(normalizeComponentName('C-Button')).toBe('button');
	});

	it('returns empty for empty input', () => {
		expect(normalizeComponentName('')).toBe('');
		expect(normalizeComponentName('   ')).toBe('');
	});

	it('preserves names without c- prefix', () => {
		expect(normalizeComponentName('typography')).toBe('typography');
	});
});

describe('isTokenData', () => {
	it('returns true for valid token data', () => {
		expect(isTokenData({ categories: [] })).toBe(true);
		expect(isTokenData({ name: 'test', version: '1', categories: [{ id: 'a', label: 'A', settings: [] }] })).toBe(true);
	});

	it('returns false for invalid inputs', () => {
		expect(isTokenData(null)).toBe(false);
		expect(isTokenData(undefined)).toBe(false);
		expect(isTokenData('string')).toBe(false);
		expect(isTokenData(42)).toBe(false);
		expect(isTokenData([])).toBe(false);
		expect(isTokenData({})).toBe(false);
		expect(isTokenData({ categories: 'not-array' })).toBe(false);
	});
});

describe('parseComponentTokenData', () => {
	it('returns empty for invalid inputs', () => {
		expect(parseComponentTokenData(null)).toEqual({});
		expect(parseComponentTokenData(undefined)).toEqual({});
		expect(parseComponentTokenData('string')).toEqual({});
		expect(parseComponentTokenData([])).toEqual({});
	});

	it('parses valid component data', () => {
		const input = {
			button: { name: 'Button', slug: 'button', tokens: ['color--primary', 'color--background'] },
			typography: { name: 'Typography', tokens: ['font-size-200'] },
		};
		const result = parseComponentTokenData(input);
		expect(result).toEqual({
			button: { name: 'Button', slug: 'button', tokens: ['color--primary', 'color--background'] },
			typography: { name: 'Typography', slug: 'typography', tokens: ['font-size-200'] },
		});
	});

	it('normalizes component keys (lowercase, strip c-)', () => {
		const input = { 'C-Button': { name: 'Button', tokens: [] } };
		const result = parseComponentTokenData(input);
		expect(result['button']).toBeDefined();
		expect(result['C-Button']).toBeUndefined();
	});

	it('skips entries with invalid values', () => {
		const input = { button: 'invalid', card: null, good: { tokens: ['x'] } };
		const result = parseComponentTokenData(input);
		expect(result['button']).toBeUndefined();
		expect(result['card']).toBeUndefined();
		expect(result['good']).toBeDefined();
	});

	it('filters non-string tokens', () => {
		const input = { button: { tokens: ['valid', 42, null, 'also-valid'] } };
		const result = parseComponentTokenData(input);
		expect(result['button']?.tokens).toEqual(['valid', 'also-valid']);
	});
});

describe('ComponentOverrideManager', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('loads empty when nothing stored', () => {
		const manager = new ComponentOverrideManager();
		expect(manager.getOverrides()).toEqual({});
	});

	it('migrates legacy flat component overrides to global scope', () => {
		const legacy = { button: { '--x': '#ff0000' }, card: { '--y': '10px' } };
		localStorage.setItem('design-tokens-component-overrides', JSON.stringify(legacy));

		const manager = new ComponentOverrideManager();
		const overrides = manager.getOverrides();
		expect(overrides).toEqual({
			'__global__': { button: { '--x': '#ff0000' }, card: { '--y': '10px' } },
		});
	});

	it('returns empty for corrupted JSON', () => {
		localStorage.setItem('design-tokens-component-overrides', 'bad-json');
		const manager = new ComponentOverrideManager();
		expect(manager.getOverrides()).toEqual({});
	});

	it('returns empty for array JSON', () => {
		localStorage.setItem('design-tokens-component-overrides', '[]');
		const manager = new ComponentOverrideManager();
		expect(manager.getOverrides()).toEqual({});
	});
});
