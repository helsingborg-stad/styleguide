/** Derived colour roles resolve from their parents in every scheme. */
export function isThemeEditableVariable(variable: string): boolean {
	if (variable === '--color--border-mix-amount' || variable === '--shadow-color' || variable === '--shadow-amount') return true;
	return variable.startsWith('--color--') && !variable.endsWith('-border') && !variable.endsWith('-alt') && !variable.endsWith('-contrast-muted');
}
