import type { DesignBuilderThemeMode } from '../control-elements/controls/layout/ThemeModeSelector';

/** Match the visitor-facing scheme priority before the editor forces a preview. */
export function getPreferredDesignBuilderColorScheme(): DesignBuilderThemeMode {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'base';
	if (window.matchMedia('(prefers-contrast: more)').matches || window.matchMedia('(forced-colors: active)').matches) return 'contrast';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'base';
}

/** Derived colour roles resolve from their parents in every scheme. */
export function isThemeEditableVariable(variable: string): boolean {
	if (variable === '--color--border-mix-amount' || variable === '--shadow-color' || variable === '--shadow-amount') return true;
	return variable.startsWith('--color--') && !variable.endsWith('-border') && !variable.endsWith('-alt') && !variable.endsWith('-contrast-muted');
}
