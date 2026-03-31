import { hexToRgb, parseRgba, toRgbaString, toHex } from '../core/color-utils';

describe('hexToRgb', () => {
	it('converts 6-digit hex to RGB', () => {
		expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
		expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
		expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
		expect(hexToRgb('#1a2b3c')).toEqual({ r: 26, g: 43, b: 60 });
	});
});

describe('parseRgba', () => {
	it('parses rgb() strings', () => {
		expect(parseRgba('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
	});

	it('parses rgba() strings', () => {
		expect(parseRgba('rgba(10, 20, 30, 0.5)')).toEqual({ r: 10, g: 20, b: 30, a: 0.5 });
	});

	it('parses hex strings', () => {
		expect(parseRgba('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
	});

	it('falls back to opaque black for unrecognized values', () => {
		expect(parseRgba('invalid')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
		expect(parseRgba('')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
	});

	it('handles rgba with alpha of 0', () => {
		expect(parseRgba('rgba(100, 200, 50, 0)')).toEqual({ r: 100, g: 200, b: 50, a: 0 });
	});
});

describe('toRgbaString', () => {
	it('produces correct rgba() string', () => {
		expect(toRgbaString(10, 20, 30, 0.5)).toBe('rgba(10, 20, 30, 0.5)');
	});

	it('handles full opacity', () => {
		expect(toRgbaString(255, 0, 0, 1)).toBe('rgba(255, 0, 0, 1)');
	});
});

describe('toHex', () => {
	it('passes through valid 6-digit hex', () => {
		expect(toHex('#ff0000')).toBe('#ff0000');
		expect(toHex('#AABBCC')).toBe('#AABBCC');
	});

	it('expands 3-digit hex', () => {
		expect(toHex('#f00')).toBe('#ff0000');
		expect(toHex('#abc')).toBe('#aabbcc');
	});

	it('converts rgb() to hex', () => {
		expect(toHex('rgb(255, 0, 0)')).toBe('#ff0000');
		expect(toHex('rgb(0, 255, 0)')).toBe('#00ff00');
	});

	it('converts rgba() to hex (ignoring alpha)', () => {
		expect(toHex('rgba(255, 128, 0, 0.5)')).toBe('#ff8000');
	});

	it('falls back to #000000 for unrecognized values without DOM', () => {
		// jsdom doesn't support getComputedStyle color parsing, so named colors fall through
		expect(toHex('not-a-color')).toBe('#000000');
	});
});
