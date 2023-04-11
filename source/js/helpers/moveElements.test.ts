import { moveElements } from "./moveElements"

describe('moveElements', () => {
    
    it('is defined', () => {
        expect(moveElements).toBeDefined()
    })

    it('calls moveElement for each element with data-move-to attribute', () => {
        // Arrange
        const moveElement = jest.fn()
        document.body.innerHTML = `<div id="target"></div><div data-move-to="#target"/>`

        // Act
        moveElements(moveElement)

        // Assert
        expect(moveElement).toHaveBeenCalledTimes(1)
    })
    
    it('removes the moveToSelector attribute from element on move to avoid secondary move', () => {
        // Arrange
        const moveElement = jest.fn()
        document.body.innerHTML = `<div id="target"></div><div data-move-to="#target"/>`

        // Act
        moveElements(moveElement)

        // Assert
        expect(document.querySelector('[data-move-to]')).toBeNull()
    })
})