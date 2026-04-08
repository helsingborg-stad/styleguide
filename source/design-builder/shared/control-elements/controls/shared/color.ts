/**
 * Best-effort conversion to hex for the native color picker.
 * Falls back to #000000 for rgba/complex values.
 */
export function toHex(color: string): string {
	if (/^#[0-9a-f]{6}$/i.test(color)) return color;
	if (/^#[0-9a-f]{3}$/i.test(color)) {
		return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
	}

	const temp = document.createElement('div');
	temp.style.color = color;
	document.body.appendChild(temp);
	const computed = getComputedStyle(temp).color;
	document.body.removeChild(temp);

	const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
	if (match) {
		const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
		const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
		const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
		return `#${r}${g}${b}`;
	}

	return '#000000';
}
