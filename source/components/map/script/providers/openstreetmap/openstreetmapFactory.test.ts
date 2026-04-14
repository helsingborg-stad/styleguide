import Openstreetmap from './openstreetmap';
import OpenstreetmapFactory from './openstreetmapFactory';

jest.mock('./openstreetmap', () => ({
	__esModule: true,
	default: jest.fn().mockImplementation((args) => ({
		args,
	})),
}));

jest.mock('@helsingborg-stad/openstreetmap/dist/main.css?inline', () => ({
	__esModule: true,
	default: '/* mocked css */',
}));

class FakeCSSStyleSheet {
	public replaceSync(_content: string): void {}
}

const mockedOpenstreetmap = jest.mocked(Openstreetmap);

describe('OpenstreetmapFactory', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		OpenstreetmapFactory.stylesLoaded = false;

		document.body.innerHTML = '<div id="wrapper"><div id="map"></div></div>';
		Object.defineProperty(document, 'adoptedStyleSheets', {
			value: [],
			writable: true,
			configurable: true,
		});
		Object.defineProperty(globalThis, 'CSSStyleSheet', {
			value: FakeCSSStyleSheet,
			configurable: true,
		});
	});

	it('passes normalized marker configs to the map implementation', () => {
		// Arrange
		const factory = new OpenstreetmapFactory();
		const container = document.querySelector('#wrapper') as HTMLElement;

		// Act
		factory.create({
			container,
			id: 'map',
			lat: '56.0465',
			lng: '12.6945',
			style: 'dark',
			zoom: '12',
			markers: JSON.stringify([
				{ lat: '56.0465', lng: '12.6945', icon: 'pin_drop', content: 'Central square', color: '#123456' },
				{ lat: null, lng: '12.7' },
			]),
		});

		// Assert
		expect(mockedOpenstreetmap).toHaveBeenCalledTimes(1);
		expect(mockedOpenstreetmap).toHaveBeenCalledWith({
			id: 'map',
			lat: 56.0465,
			lng: 12.6945,
			zoom: 12,
			style: 'dark',
			markers: [
				{
					lat: 56.0465,
					lng: 12.6945,
					icon: 'pin_drop',
					content: 'Central square',
					color: '#123456',
				},
			],
		});
		expect(document.adoptedStyleSheets).toHaveLength(1);
	});

	it('falls back to the default zoom for invalid zoom values', () => {
		// Arrange
		const factory = new OpenstreetmapFactory();
		const container = document.querySelector('#wrapper') as HTMLElement;

		// Act
		factory.create({
			container,
			id: 'map',
			lat: '56.0465',
			lng: '12.6945',
			style: null,
			zoom: 'not-a-number',
			markers: null,
		});

		// Assert
		expect(mockedOpenstreetmap).toHaveBeenCalledWith(
			expect.objectContaining({
				zoom: 16,
				style: 'default',
				markers: [],
			}),
		);
	});
});
