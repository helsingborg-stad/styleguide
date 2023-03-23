import { moveElement } from "./moveElement"

describe('moveElement', () => {

    it('should be defined', () => {
        expect(moveElement).toBeDefined()
    })

    it('should move element to target', () => {
        // Arrange
        document.body.innerHTML = '<div> ' + ' <div id="drawer-element" />' + '</div>';
        const element = document.querySelector('#drawer-element') as Element
        const target = document.querySelector('div') as Element

        // Act
        moveElement(element, target)

        // Assert
        expect(target.children.length).toBe(1)
        expect(target.children[0]).toBe(element)
    })

})