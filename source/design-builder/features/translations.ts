export type Translations = {
	showUneditable: string;
	hideUneditable: string;
	general: string;
	components: string;
	chooseAPreset: string;
	pickOnPage: string;
	stopPicking: string;
	preset: string;
	importExportJson: string;
	exportJson: string;
	importJson: string;
	resetActions: string;
	resetAll: string;
	presetActions: string;
	savePreset: string;
	deletePreset: string;
	component: string;
	scope: string;
	resetSelected: string;
	savedPresets: string;
	generalAllScopes: string;
};

declare global {
	interface Window {
		styleguide: {
			translations?: Translations;
		} | null;
	}
}

export const translations: Translations = {
	showUneditable: 'Show uneditable',
	hideUneditable: 'Hide uneditable',
	general: 'General',
	components: 'Components',
	chooseAPreset: 'Choose a preset',
	pickOnPage: 'Pick on page',
	stopPicking: 'Stop picking',
	preset: 'Preset',
	importExportJson: 'Import / export JSON',
	exportJson: 'Export JSON',
	importJson: 'Import JSON',
	resetActions: 'Reset actions',
	resetAll: 'Reset all',
	presetActions: 'Preset actions',
	savePreset: 'Save preset',
	deletePreset: 'Delete preset',
	component: 'Component',
	scope: 'Scope',
	resetSelected: 'Reset selected',
	savedPresets: 'Saved presets',
	generalAllScopes: 'General (all scopes)',
};

document.addEventListener('DOMContentLoaded', () => {
	if (window.styleguide?.translations) {
		Object.assign(translations, window.styleguide.translations);
	}
});
