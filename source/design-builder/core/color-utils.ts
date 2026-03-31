/**
 * Color Utility Functions
 *
 * Pure color conversion helpers used by design builder controls.
 */

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
	return {
		r: parseInt(hex.slice(1, 3), 16),
		g: parseInt(hex.slice(3, 5), 16),
		b: parseInt(hex.slice(5, 7), 16),
	};
}

export function parseRgba(value: string): { r: number; g: number; b: number; a: number } {
	const m = value.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
	if (m) {
		return {
			r: parseInt(m[1]),
			g: parseInt(m[2]),
			b: parseInt(m[3]),
			a: m[4] !== undefined ? parseFloat(m[4]) : 1,
		};
	}
	if (/^#[0-9a-f]{6}$/i.test(value)) {
		return {
			r: parseInt(value.slice(1, 3), 16),
			g: parseInt(value.slice(3, 5), 16),
			b: parseInt(value.slice(5, 7), 16),
			a: 1,
		};
	}
	return { r: 0, g: 0, b: 0, a: 1 };
}

export function toRgbaString(r: number, g: number, b: number, a: number): string {
	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function rgbToHex(r: number, g: number, b: number): string {
	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Best-effort conversion to 6-digit hex for the native color picker.
 * Handles hex (3/6-digit), rgb(), and rgba() strings.
 * Falls back to DOM-based parsing for named colors, then to #000000.
 */
export function toHex(color: string): string {
	if (/^#[0-9a-f]{6}$/i.test(color)) return color;
	if (/^#[0-9a-f]{3}$/i.test(color)) {
		return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
	}

	const rgbMatch = color.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);
	if (rgbMatch) {
		return rgbToHex(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3]));
	}

	// DOM-based fallback for named colors and other CSS color values
	if (typeof document !== 'undefined') {
		const temp = document.createElement('div');
		temp.style.color = color;
		document.body.appendChild(temp);
		const computed = getComputedStyle(temp).color;
		document.body.removeChild(temp);

		const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
		if (match) {
			return rgbToHex(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
		}
	}

	return '#000000';
}
