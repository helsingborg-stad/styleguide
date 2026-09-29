import GalleryImage from '../components/gallery/image';
import Image from './image';

describe.each([GalleryImage, Image])('gallery image', (ImageClass) => {
	it('preserves supplied dimensions', () => {
		const container = document.createElement('div');
		const image = new ImageClass();

		image.initImage({
			elementContainer: container,
			attrList: {src: '/image.jpg', width: 640, height: 480},
			classList: ['c-image__image'],
		});

		const element = container.querySelector('img');
		expect(element?.getAttribute('width')).toBe('640');
		expect(element?.getAttribute('height')).toBe('480');
	});

	it('uses dimensions encoded in the image URL', () => {
		const container = document.createElement('div');
		const image = new ImageClass();

		image.initImage({
			elementContainer: container,
			attrList: {src: 'https://picsum.photos/id/1026/300/200'},
			classList: ['c-image__image'],
		});

		const element = container.querySelector('img');
		expect(element?.getAttribute('width')).toBe('300');
		expect(element?.getAttribute('height')).toBe('200');
	});

	it('omits dimensions when the image size is unknown', () => {
		const container = document.createElement('div');
		const image = new ImageClass();

		image.initImage({
			elementContainer: container,
			attrList: {src: '/image.jpg'},
			classList: ['c-image__image'],
		});

		const element = container.querySelector('img');
		expect(element?.hasAttribute('width')).toBe(false);
		expect(element?.hasAttribute('height')).toBe(false);

		Object.defineProperty(element, 'naturalWidth', {value: 1024});
		Object.defineProperty(element, 'naturalHeight', {value: 768});
		element?.dispatchEvent(new Event('load'));
		expect(element?.getAttribute('width')).toBe('1024');
		expect(element?.getAttribute('height')).toBe('768');
	});
});
