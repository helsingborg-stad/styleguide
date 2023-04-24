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

        it('sets up click event listener on document', () => {
            const spy = jest.spyOn(document, 'addEventListener')
            new ClickAway(document.body)
            expect(spy).toHaveBeenCalledWith('click', expect.anything())
        })

        it('separates multiple classes to remove by comma', () => {
            const div = document.createElement('div')
            div.setAttribute(ClickAway.attributeName, 'one, two')
            const clickAway = new ClickAway(div)

            expect(clickAway.classesToRemove).toEqual(['one', 'two'])
        })

        describe('coordinatesAreOutsideBounds', () => {
            it('returns true if coordinates are outside bounds', () => {
                const clickAway = new ClickAway(document.createElement('div'))
                const result = clickAway.coordinatesAreOutsideBounds({ left: 0, right: 0, top: 0, bottom: 0 }, 1, 1)
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

        it.todo('removes event listener on document when element is removed')
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

        it.todo('adds ClickAway to elements added after initialization')
        
    })
})