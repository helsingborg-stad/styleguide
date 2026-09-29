import GalleryImage from '../components/gallery/image';
import Image from './image';

describe.each([GalleryImage, Image])('gallery image', (ImageClass) => {
    it('renders empty width and height attributes even when dimensions are supplied', () => {
        const container = document.createElement('div');
        const image = new ImageClass();

        image.initImage({
            elementContainer: container,
            attrList: {src: '/image.jpg', width: 640, height: 480},
            classList: ['c-image__image'],
        });

        const element = container.querySelector('img');
        expect(element?.getAttribute('width')).toBe('');
        expect(element?.getAttribute('height')).toBe('');
    });
});
