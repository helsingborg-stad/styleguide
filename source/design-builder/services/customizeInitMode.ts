import {
	CUSTOMIZE_INIT_MODE_MANUAL,
	CUSTOMIZE_INIT_MODE_ONLOAD,
	type CustomizeInitMode,
} from '../state/runtimeConstants';

export function resolveCustomizeInitMode(): CustomizeInitMode {
	const rawMode =
		typeof window.styleguideCustomizeInitMode === 'string'
			? window.styleguideCustomizeInitMode.toLowerCase().trim()
			: '';

	if (rawMode === CUSTOMIZE_INIT_MODE_MANUAL) {
		return CUSTOMIZE_INIT_MODE_MANUAL;
	}

	return CUSTOMIZE_INIT_MODE_ONLOAD;
}
