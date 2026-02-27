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

    describe('transitionImage', () => {

        it('keeps latest image when previous preload resolves late', () => {
            // Arrange
            jest.useFakeTimers()

            const originalWindowImage = window.Image
            const originalRequestAnimationFrame = window.requestAnimationFrame
            const preloadInstances: Array<{ triggerLoad: () => void }> = []

            class MockWindowImage {
                loadListener: null | (() => void)
                errorListener: null | (() => void)

                constructor() {
                    this.loadListener = null
                    this.errorListener = null
                }

                addEventListener(eventName: string, callback: () => void) {
                    if (eventName === 'load') {
                        this.loadListener = callback
                    }

                    if (eventName === 'error') {
                        this.errorListener = callback
                    }
                }

                set src(_value: string) {
                    preloadInstances.push({
                        triggerLoad: () => {
                            if (this.loadListener) {
                                this.loadListener()
                            }
                        }
                    })
                }
            }

            window.Image = MockWindowImage as unknown as typeof window.Image
            window.requestAnimationFrame = ((callback: FrameRequestCallback) => {
                callback(0)
                return 1
            }) as typeof window.requestAnimationFrame

            const gallery = new Gallery
            jest.spyOn(gallery, 'getImageTransitionDuration').mockReturnValue(0)

            const imageElement = document.createElement('img')
            imageElement.className = 'c-image__image c-image__image--is-visible'
            imageElement.setAttribute('src', 'imageZero')

            const firstImage = { image: 'imageOne', imageStep: '0', imageCaption: '' }
            const secondImage = { image: 'imageTwo', imageStep: '1', imageCaption: '' }

            // Act
            gallery.transitionImage(imageElement, firstImage)
            jest.runOnlyPendingTimers()

            gallery.transitionImage(imageElement, secondImage)
            jest.runOnlyPendingTimers()

            preloadInstances[1].triggerLoad()
            preloadInstances[0].triggerLoad()

            // Assert
            expect(imageElement.getAttribute('src')).toContain('imageTwo')
            expect(imageElement.getAttribute('data-step')).toEqual('1')
            expect(imageElement.classList.contains('c-image__image--is-visible')).toEqual(true)

            // Cleanup
            window.Image = originalWindowImage
            window.requestAnimationFrame = originalRequestAnimationFrame
            jest.useRealTimers()
        })
    })

})