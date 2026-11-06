import { readFileSync } from 'fs';

type Theme = Record<string, string>;

function getContrastRatio(first: string, second: string): number {
	const luminance = (color: string): number => {
		const channels = color
			.slice(1)
			.match(/.{2}/g)!
			.map((channel) => parseInt(channel, 16) / 255)
			.map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
		return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
	};

	const [lightest, darkest] = [luminance(first), luminance(second)].sort((left, right) => right - left);
	return (lightest + 0.05) / (darkest + 0.05);
}

describe('dark theme accessibility', () => {
	const theme = JSON.parse(readFileSync('source/themes/dark.json', 'utf8')) as Theme;

	it('keeps background and surface text comfortably legible with distinguishable surfaces', () => {
		expect(getContrastRatio(theme['--color--background'], theme['--color--background-contrast'])).toBeGreaterThanOrEqual(7);
		expect(getContrastRatio(theme['--color--background'], theme['--color--background-contrast-muted'])).toBeGreaterThanOrEqual(7);
		expect(getContrastRatio(theme['--color--surface'], theme['--color--surface-contrast'])).toBeGreaterThanOrEqual(7);
		expect(getContrastRatio(theme['--color--surface'], theme['--color--surface-contrast-muted'])).toBeGreaterThanOrEqual(7);
		expect(getContrastRatio(theme['--color--background'], theme['--color--surface'])).toBeGreaterThanOrEqual(1.05);
	});

	it('keeps text on interactive and status colours at AA contrast', () => {
		for (const color of ['primary', 'secondary', 'success', 'warning', 'danger', 'info']) {
			expect(getContrastRatio(theme[`--color--${color}`], theme[`--color--${color}-contrast`])).toBeGreaterThanOrEqual(4.5);
		}
	});
});
