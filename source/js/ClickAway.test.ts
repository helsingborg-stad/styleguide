import { ClickAway, initializeClickAways } from "./ClickAway"
import userEvent from '@testing-library/user-event'


describe('ClickAway', () => {

    describe('Unit', () => {

        it('is defined', () => {
            expect(ClickAway).toBeDefined()
        })

        it('requires a target element', () => {
            const div = document.createElement('div')
            expect(() => new ClickAway(div)).not.toThrow()
        })

        describe('initialize', () => {
            
            it('sets up click event listener on document', () => {
                const spy = jest.spyOn(document, 'addEventListener')
                new ClickAway(document.body).initialize()
                expect(spy).toHaveBeenCalledWith('click', expect.anything())
            })

            it('separates multiple classes to remove by comma', () => {
                const div = document.createElement('div')
                div.setAttribute(ClickAway.attributeName, 'one, two')
                const clickAway = new ClickAway(div)
                clickAway.initialize()
    
                expect(clickAway.classesToRemove).toEqual(['one', 'two'])
            })
        })

        describe('handleClick', () => {

            it('does not call removeClasses if coordinates are inside bounds', () => {
                const div = document.createElement('div')
                const clickAway = new ClickAway(div)
                clickAway.removeClasses = jest.fn()
                clickAway.coordinatesAreOutsideBounds = jest.fn().mockReturnValue(false)

                clickAway.handleClick({ clientX: 0, clientY: 0 } as PointerEvent)

                expect(clickAway.removeClasses).not.toHaveBeenCalled()
            })

            it('does not call removeClasses if target is on or within element', () => {
                const div = document.createElement('div')
                const clickAway = new ClickAway(div)
                clickAway.removeClasses = jest.fn()
                clickAway.coordinatesAreOutsideBounds = jest.fn().mockReturnValue(true)
                clickAway.targetIsOnOrWithinElement = jest.fn().mockReturnValue(true)

                clickAway.handleClick({ clientX: 0, clientY: 0 } as PointerEvent)

                expect(clickAway.removeClasses).not.toHaveBeenCalled()
            })
        })

        describe('coordinatesAreOutsideBounds', () => {

            it.each([
                { bounds: { left: 1, right: 0, top: 0, bottom: 0 }, x: 0, y: 0 },
                { bounds: { left: 0, right: 0, top: 0, bottom: 0 }, x: 1, y: 0 },
                { bounds: { left: 0, right: 0, top: 1, bottom: 0 }, x: 0, y: 0 },
                { bounds: { left: 0, right: 0, top: 0, bottom: 0 }, x: 0, y: 1 }
            ])('returns true if coordinates are outside bounds', ({ bounds, x, y }) => {
                const clickAway = new ClickAway(document.createElement('div'))
                const result = clickAway.coordinatesAreOutsideBounds(bounds, x, y)
                expect(result).toEqual(true)
            })

            it('returns false if coordinates are inside bounds', () => {
                const clickAway = new ClickAway(document.createElement('div'))
                const result = clickAway.coordinatesAreOutsideBounds({ left: 10, right: 20, top: 10, bottom: 20 }, 15, 15)
                expect(result).toEqual(false)
            })
        })

        describe('targetIsOnOrWithinElement', () => {
            it('returns true if target node is the element', () => {
                const div = document.createElement('div')
                const clickAway = new ClickAway(div)
                const result = clickAway.targetIsOnOrWithinElement(div, div)
                expect(result).toEqual(true)
            })

            it('returns true if target node is a child of the element', () => {
                const div = document.createElement('div')
                const child = document.createElement('div')
                div.appendChild(child)
                const clickAway = new ClickAway(div)
                const result = clickAway.targetIsOnOrWithinElement(div, child)
                expect(result).toEqual(true)
            })

            it('returns false if target node is not the element or a child of the element', () => {
                const div = document.createElement('div')
                const child = document.createElement('div')
                const clickAway = new ClickAway(div)
                const result = clickAway.targetIsOnOrWithinElement(div, child)
                expect(result).toEqual(false)
            })
        })
    })

    describe('Integration', () => {
        
        it('removes class on click outside', async () => {

            const element = document.createElement('div')
            element.getBoundingClientRect = jest.fn().mockReturnValue({ left: 100, right: 200, top: 100, bottom: 200 })
            element.setAttribute(ClickAway.attributeName, 'testclass')
            element.classList.add('testclass')
            document.body.appendChild(element)
            initializeClickAways()

            await userEvent.click(document.body)

            expect(element.classList.contains('testclass')).toEqual(false)
        })
    })
})