import { getByTestId, getByText, screen } from "@testing-library/dom"
import { IComponentData, renderComponent } from "./helpers/ComponentRenderer"
import Modal from "./modal"
import userEvent from "@testing-library/user-event"
import Gallery from "./gallery"

jest.mock('./gallery')

interface IModalData extends IComponentData {
    heading?: string,
    slot?: string,
    bottom?: boolean,
    overlay?: string,
    isPanel?: boolean,
    id?: string,
    animation?: string,
    navigation?: boolean,
    size?: string,
    padding?: number,
    borderRadius?: boolean,
    transparent?: boolean
}

const defaultModalData: IModalData = {
    heading: 'Modal heading',
    slot: 'Modal content',
    bottom: false,
    overlay: 'dark',
    isPanel: false,
    id: 'modal',
    animation: 'slide',
    navigation: false,
    size: 'medium',
    padding: 0,
    borderRadius: false,
    transparent: false
}

function initializeModalComponent() {
    const modalInstance = new Modal()
    modalInstance.enableModals()
}

async function renderModalComponent(partialModalData: Partial<IModalData>) {
    const data = { ...defaultModalData, ...partialModalData }
    const componentClassName = "ComponentLibrary\\Component\\Modal\\Modal"
    const componentView = 'modal'
    const component = await renderComponent(componentClassName, componentView, data)
    document.body.innerHTML = document.body.innerHTML + component.innerHTML
    initializeModalComponent()
    return component
}

const customDialogCloseEvent = new CustomEvent('close')

// Mocks required to test dialog element.
// See: https://github.com/jsdom/jsdom/issues/3294
HTMLDialogElement.prototype.show = jest.fn(function mock(this: HTMLDialogElement) {
    this.open = true;
});

HTMLDialogElement.prototype.showModal = jest.fn(function mock(this: HTMLDialogElement) {
    this.open = true;
});

HTMLDialogElement.prototype.close = jest.fn(function mock(this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(customDialogCloseEvent)
});

describe('modal', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    })

    it('renders component', async () => {
        await renderModalComponent({})
        expect(document.querySelector('.c-modal')).not.toBeNull()
    })

    it('renders modal title', async () => {
        const heading = 'Modal title'
        await renderModalComponent({ heading })
        expect(getByText(document.body, heading)).not.toBeNull()
    })

    it('opens modal on trigger click', async () => {
        const modalId = "foo"
        const trigger = `<button data-open="${modalId}" data-testid="trigger-button">Trigger Button</button>`
        document.body.innerHTML = trigger
        await renderModalComponent({ id: modalId })
        const modalElement = document.querySelector('.c-modal') as HTMLDialogElement
        const openTrigger = document.querySelector('[data-open]') as HTMLButtonElement

        await userEvent.click(openTrigger)
        expect(modalElement.open).toEqual(true)
    })

    it('adds visibility class when opening modal', async () => {
        const modalId = "foo"
        const trigger = `<button data-open="${modalId}" data-testid="trigger-button">Trigger Button</button>`
        document.body.innerHTML = trigger
        await renderModalComponent({ id: modalId })
        const modalElement = document.querySelector('.c-modal') as HTMLDialogElement
        const openTrigger = document.querySelector('[data-open]') as HTMLButtonElement

        await userEvent.click(openTrigger)
        expect(modalElement.classList.contains('c-modal--visible')).toEqual(true)
    })
    
    it('closes modal on trigger click', async () => {
        await renderModalComponent({})
        const modalElement = document.querySelector('.c-modal') as HTMLDialogElement
        const closeTrigger = document.querySelector('[data-close]') as HTMLButtonElement
        modalElement.open = true

        await userEvent.click(closeTrigger)
        expect(modalElement.open).toEqual(false)
    })
    
    it('removes visibility class when closing open modal', async () => {
        const visibilityClass = 'c-modal--visible'
        await renderModalComponent({})
        const modalElement = document.querySelector('.c-modal') as HTMLDialogElement
        const closeTrigger = document.querySelector('[data-close]') as HTMLButtonElement
        modalElement.open = true
        modalElement.classList.add(visibilityClass)

        await userEvent.click(closeTrigger)
        expect(modalElement.classList.contains(visibilityClass)).toEqual(false)
    })

    it('instantiates gallery component when modal is opened if data-large-img attribute is present on the trigger button', async () => {
        const modalId = "foo"
        const trigger = `<button data-open="${modalId}" data-large-img="https://www.example.com/image.jpg" data-testid="trigger-button">Trigger Button</button>`
        document.body.innerHTML = trigger
        
        await renderModalComponent({ id: modalId })
        const openTrigger = document.querySelector('[data-open]') as HTMLButtonElement
        
        await userEvent.click(openTrigger)

        expect(Gallery).toHaveBeenCalledTimes(1)
    })

    it.only('close modal on backdrop click', async () => {
        document.body.innerHTML = `<p>test</p>`
        await renderModalComponent({heading: 'Modal heading'})
        const modalElement = document.querySelector('.c-modal') as HTMLDialogElement
        modalElement.open = true
        const p = getByText(document.body, 'test')
        modalElement.getBoundingClientRect = jest.fn(() => ({
            bottom: 748.5,
            height: 543,
            left: 880,
            right: 1680,
            top: 205.5,
            width: 800,
            x: 880,
            y: 205.5
        } as DOMRect))

        const modalCoordinates = modalElement.getBoundingClientRect()

        await userEvent.pointer({keys: '[MouseLeft]', target: modalElement, coords: {x: modalCoordinates.left - 20, y: modalCoordinates.top - 20}})
        
        expect(modalElement.open).toEqual(false)
    })
})

