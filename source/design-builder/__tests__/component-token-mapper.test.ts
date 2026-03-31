import { buildCategoriesForComponent } from '../core/component-token-mapper';
import type { ComponentTokenData, TokenData } from '../core/types';

const tokenLibrary: TokenData = {
	name: 'Test',
	version: '1.0',
	categories: [
		{
			id: 'colors',
			label: 'Colors',
			settings: [
				{ variable: '--color--primary', label: 'Primary', type: 'color', default: '#0000ff' },
				{ variable: '--color--secondary', label: 'Secondary', type: 'color', default: '#00ff00' },
			],
		},
		{
			id: 'typography',
			label: 'Typography',
			settings: [
				{ variable: '--font-size-200', label: 'Font Size 200', type: 'range', default: '1rem', min: 0.5, max: 3, step: 0.125, unit: 'rem' },
			],
		},
	],
};

const componentData: ComponentTokenData = {
	button: { name: 'Button', tokens: ['color--primary', 'font-size-200'] },
	card: { name: 'Card', tokens: ['color--secondary'] },
	empty: { name: 'Empty', tokens: [] },
};

describe('buildCategoriesForComponent', () => {
	it('returns matching categories with prefixed variables', () => {
		const result = buildCategoriesForComponent('button', componentData, tokenLibrary);
		expect(result).toHaveLength(2);
		expect(result[0].id).toBe('colors');
		expect(result[0].settings[0].variable).toBe('--c-button--color--primary');
		expect(result[1].id).toBe('typography');
		expect(result[1].settings[0].variable).toBe('--c-button--font-size-200');
	});

	it('returns only matching categories', () => {
		const result = buildCategoriesForComponent('card', componentData, tokenLibrary);
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('colors');
		expect(result[0].settings).toHaveLength(1);
		expect(result[0].settings[0].variable).toBe('--c-card--color--secondary');
	});

	it('returns empty array for component with no tokens', () => {
		expect(buildCategoriesForComponent('empty', componentData, tokenLibrary)).toEqual([]);
	});

	it('returns empty array for unknown component', () => {
		expect(buildCategoriesForComponent('unknown', componentData, tokenLibrary)).toEqual([]);
	});
});
