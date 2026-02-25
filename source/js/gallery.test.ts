import Gallery from "./gallery"

describe('Gallery', () => {

    describe('cycleImage', () => {

        function createImageDataSet() {
            return [
                { image: 'imageOne', imageStep: '0', imageCaption: '' },
                { image: 'imageTwo', imageStep: '1', imageCaption: '' },
                { image: 'imageThree', imageStep: '2', imageCaption: '' }
            ]
        }

        it('returns next image when input param is "next"', () => {
            // Given
            const gallery = new Gallery
            gallery.container = document.createElement('div')
            gallery.imageDataSet = createImageDataSet()
            gallery.imageData = { imageStep: '0' }
            jest.spyOn(gallery, 'createImg').mockImplementation(jest.fn())

            // When
            const nextImage = gallery.cycleImage('next')

            // Then
            expect(nextImage).toEqual(gallery.imageDataSet[1])
        })
        
        it('returns first image when input param is "next" and current is last image', () => {
            // Given
            const gallery = new Gallery
            gallery.container = document.createElement('div')
            gallery.imageDataSet = createImageDataSet()
            gallery.imageData = { imageStep: '2' }
            jest.spyOn(gallery, 'createImg').mockImplementation(jest.fn())

            // When
            const nextImage = gallery.cycleImage('next')

            // Then
            expect(nextImage).toEqual(gallery.imageDataSet[0])
        })
        
        it('returns previous image when input param is not "next"', () => {
            // Given
            const gallery = new Gallery
            gallery.container = document.createElement('div')
            gallery.imageDataSet = createImageDataSet()
            gallery.imageData = { imageStep: '1' }
            jest.spyOn(gallery, 'createImg').mockImplementation(jest.fn())

            // When
            const nextImage = gallery.cycleImage()

            // Then
            expect(nextImage).toEqual(gallery.imageDataSet[0])
        })
        
        it('returns last image when input param is not "next" and current is first image', () => {
            // Given
            const gallery = new Gallery
            gallery.container = document.createElement('div')
            gallery.imageDataSet = createImageDataSet()
            gallery.imageData = { imageStep: '0' }
            jest.spyOn(gallery, 'createImg').mockImplementation(jest.fn())

            // When
            const nextImage = gallery.cycleImage()

            // Then
            expect(nextImage).toEqual(gallery.imageDataSet[2])
        })

        it('returns null when gallery state is incomplete', () => {
            // Given
            const gallery = new Gallery
            gallery.imageDataSet = createImageDataSet()
            gallery.imageData = { imageStep: '0' }

            // When
            const nextImage = gallery.cycleImage('next')

            // Then
            expect(nextImage).toBeNull()
        })

    })

    describe('updateImageCounter', () => {

        it('writes current and total image counter into modal counter container', () => {
            // Arrange
            const gallery = new Gallery
            const container = document.createElement('div')
            const modalContent = document.createElement('section')
            modalContent.className = 'c-modal__content'
            const counter = document.createElement('div')
            counter.className = 'c-modal__counter'
            modalContent.appendChild(counter)
            container.appendChild(modalContent)

            gallery.imageDataSet = [
                { image: 'imageOne', imageStep: '0', imageCaption: '' },
                { image: 'imageTwo', imageStep: '1', imageCaption: '' }
            ]
            gallery.imageData = { image: 'imageTwo', imageStep: '1', imageCaption: '' }

            // Act
            gallery.updateImageCounter(container)

            // Assert
            expect(counter.textContent).toEqual('2/2')
        })

        it('creates counter container when missing', () => {
            // Arrange
            const gallery = new Gallery
            const container = document.createElement('div')
            const modalContent = document.createElement('section')
            modalContent.className = 'c-modal__content'
            container.appendChild(modalContent)
            gallery.imageDataSet = [{ image: 'imageOne', imageStep: '0', imageCaption: '' }]
            gallery.imageData = { image: 'imageOne', imageStep: '0', imageCaption: '' }

            // Act
            gallery.updateImageCounter(container)

            // Assert
            expect(container.querySelector('.c-modal__counter')?.textContent).toEqual('1/1')
        })
    })

})