declare module 'playwright-core/lib/utilsBundle' {
	interface PngImage {
		width: number;
		height: number;
		data: Buffer;
	}

	export const PNG: {
		sync: {
			read(buffer: Buffer): PngImage;
		};
	};
}
