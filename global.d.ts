export {};

declare module '*.css?inline' {
	const content: string;
	export default content;
}

declare global {
	interface Window {
		styleguideCustomizeData?: unknown;
		styleguideDesignTokenLibrary?: unknown;
		styleguideCustomizeInitMode?: unknown;
	}
}
