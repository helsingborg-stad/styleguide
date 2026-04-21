import type { ComponentTokenData } from '../../shared/types/designBuilderDataTypes';
import { parseComponentTokenData } from './componentTokenDefinitions';

describe('parseComponentTokenData', () => {
	it('preserves token-backed and custom-variable component settings', () => {
		const raw = {
			brand: {
				name: 'Brand',
				tokens: ['space', 'color--primary'],
				componentSettings: [
					{
						id: 'settings',
						label: 'Settings',
						settings: [
							{
								token: 'space',
								label: 'Space',
								description: 'Adjusts the spacing between logo and text.',
							},
							{
								variable: '--font-size-multiplier',
								label: 'Font Size Multiplier',
								type: 'range',
								default: '1',
								min: 0.1,
								max: 4,
								step: 0.05,
							},
							{
								token: '',
								label: 'Broken token reference',
							},
						],
					},
				],
			},
		};

		const parsed = parseComponentTokenData(raw);
		const brandDefinition = parsed.brand as ComponentTokenData['brand'];

		expect(brandDefinition?.tokens).toEqual(['space', 'color--primary']);
		expect(brandDefinition?.componentSettings).toEqual([
			{
				id: 'settings',
				label: 'Settings',
				settings: [
					{
						token: 'space',
						label: 'Space',
						description: 'Adjusts the spacing between logo and text.',
					},
					{
						variable: '--font-size-multiplier',
						label: 'Font Size Multiplier',
						type: 'range',
						default: '1',
						min: 0.1,
						max: 4,
						step: 0.05,
					},
				],
			},
		]);
	});
});
