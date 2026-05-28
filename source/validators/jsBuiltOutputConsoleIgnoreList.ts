export interface JsConsoleIgnoreRule {
	bundle?: string;
	method?: 'log' | 'info' | 'debug' | 'warn' | 'error';
	lineIncludes: string;
}

export const jsBuiltOutputConsoleIgnoreList: JsConsoleIgnoreRule[] = [
	{
		bundle: 'js/styleguide-js.js',
		method: 'error',
		lineIncludes: 'Form must have a submit button.',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'error',
		lineIncludes: 'Error copying text to clipboard:',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'error',
		lineIncludes: 'Error requesting permission:',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'warn',
		lineIncludes: 'Clipboard API not supported in this browser',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'error',
		lineIncludes: 'ExtendedDropdownMenu: Sibling element with class .c-nav__item-wrapper not found.',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'error',
		lineIncludes: 'ExtendedDropdownMenu: asyncChildContainer has no parent element.',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'error',
		lineIncludes: 'Notice template not found',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'error',
		lineIncludes: 'Notice message element not found.',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'error',
		lineIncludes: 'Failed to clone template elements for file preview list.',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'error',
		lineIncludes: 'FilePreviewStore: Input element must have an id or name attribute to register controller.',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'error',
		lineIncludes: 'FilePlaceholderCreator: No controller registered for the provided input element.',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'error',
		lineIncludes: 'FileInput: Missing required elements in dropzone.',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'warn',
		lineIncludes: 'Modal with ID',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'warn',
		lineIncludes: 'Failed to clear messages from localStorage. Messages may persist across page reloads.',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'warn',
		lineIncludes: 'Failed to save messages to localStorage. Messages will not persist across page reloads.',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'error',
		lineIncludes: 'Chat component initialization failed: Missing required attributes or elements.',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'warn',
		lineIncludes: 'Map element is missing required attributes: data-js-map and data-js-map-provider',
	},
	{
		bundle: 'js/styleguide-js.js',
		method: 'warn',
		lineIncludes: 'No button container found for slider:',
	},
	{
		bundle: 'js/design-builder.js',
		method: 'error',
		lineIncludes: 'Failed to parse options attribute:',
	},
	{
		bundle: 'js/design-builder.js',
		method: 'error',
		lineIncludes: 'Failed to parse swatch select options:',
	},
];