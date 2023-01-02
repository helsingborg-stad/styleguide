import Gallery from "./gallery"

describe('Gallery', () => {

    describe('cycleImage', () => {

        it('returns next image when input param is "next"', () => {
            // Given
            const gallery = new Gallery
            gallery.imageDataSet = ['imageOne', 'imageTwo', 'imageThree']
            gallery.imageData = {imageStep: 0}
            jest.spyOn(gallery, 'createImg').mockImplementation(jest.fn())

            // When
            const nextImage = gallery.cycleImage('next')

            // Then
            expect(nextImage).toEqual('imageTwo')
        })
        
        it('returns first image when input param is "next" and current is last image', () => {
            // Given
            const gallery = new Gallery
            gallery.imageDataSet = ['imageOne', 'imageTwo', 'imageThree']
            gallery.imageData = {imageStep: 2}
            jest.spyOn(gallery, 'createImg').mockImplementation(jest.fn())

            // When
            const nextImage = gallery.cycleImage('next')

            // Then
            expect(nextImage).toEqual('imageOne')
        })
        
        it('returns previous image when input param is not "next"', () => {
            // Given
            const gallery = new Gallery
            gallery.imageDataSet = ['imageOne', 'imageTwo', 'imageThree']
            gallery.imageData = {imageStep: 1}
            jest.spyOn(gallery, 'createImg').mockImplementation(jest.fn())

            // When
            const nextImage = gallery.cycleImage()

            // Then
            expect(nextImage).toEqual('imageOne')
        })
        
        it('returns last image when input param is not "next" and current is first image', () => {
            // Given
            const gallery = new Gallery
            gallery.imageDataSet = ['imageOne', 'imageTwo', 'imageThree']
            gallery.imageData = {imageStep: 0}
            jest.spyOn(gallery, 'createImg').mockImplementation(jest.fn())

            // When
            const nextImage = gallery.cycleImage()

            // Then
            expect(nextImage).toEqual('imageThree')
        })

    })

})