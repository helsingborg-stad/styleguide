import { getByText } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { initializeFilterSelectComponents } from "./filterSelect";
import { IComponentData, renderComponent } from './helpers/ComponentRenderer';

interface IFilterSelectData extends IComponentData {
    options: string[]|Record<string, string>
    name: string,
    placeholder: string,
    preselected?: string
}

function initializeComponentJavaScript() {
    initializeFilterSelectComponents()
}

async function renderFilterSelectComponent(data: IFilterSelectData) {
    const componentClassName = "ComponentLibrary\\Component\\FilterSelect\\FilterSelect"
    const componentView = 'filterSelect'
    const component = await renderComponent(componentClassName, componentView, data)
    document.body.innerHTML = component.innerHTML
    initializeComponentJavaScript()
    return component
}

describe('filterSelect', () => {

    afterEach(() => {
        document.body.innerHTML = '';
    })

    it('is defined', () => {
        expect(initializeComponentJavaScript).toBeDefined()
    })

    it('updates value on select element when option is clicked', async () => {
            
            const data: IFilterSelectData = {
                options: {'option-1': 'Option 1'},
                name: 'filterSelect',
                placeholder: 'Select an option'
            }
    
            await renderFilterSelectComponent(data)
            const optionElement = document.querySelector('.c-filterselect__option') as HTMLElement
            const selectElement = document.querySelector('select') as HTMLSelectElement
    
            expect(selectElement.value).toEqual('')
            await userEvent.click(optionElement)
            
            expect(selectElement.selectedOptions).toHaveLength(1)
            expect(selectElement.selectedOptions[0].value).toEqual('option-1')
    })

    it('updates value on select element when multiple options are clicked', async () => {
            
            const data: IFilterSelectData = {
                options: {'option-1': 'Option 1', 'option-2': 'Option 2'},
                name: 'filterSelect',
                placeholder: 'Select an option'
            }
    
            await renderFilterSelectComponent(data)
            const optionsElements = document.querySelectorAll('.c-filterselect__option')
            const selectElement = document.querySelector('select') as HTMLSelectElement
    
            await userEvent.click(optionsElements[0])
            await userEvent.click(optionsElements[1])
            
            expect(selectElement.selectedOptions).toHaveLength(2)
            expect(selectElement.selectedOptions[0].value).toEqual('option-1')
            expect(selectElement.selectedOptions[1].value).toEqual('option-2')
    })
    
    it('sets preselected value in select element', async () => {
            
            const data: IFilterSelectData = {
                options: {'foo': 'bar'},
                name: 'filterSelect',
                placeholder: 'Select an option',
                preselected: 'foo'
            }
    
            await renderFilterSelectComponent(data)
            const selectElement = document.querySelector('select') as HTMLSelectElement
    
            expect(selectElement.value).toEqual('foo')
    })

    /**
     * @ticket #865c48eme: https://app.clickup.com/t/865c48eme
     */
    it('displays placeholder after deselecting selected values', async () => {

        const placeholderText = 'Select an option'
        const data: IFilterSelectData = {
            options: ['option1'],
            name: 'filterSelect',
            placeholder: placeholderText
        }

        await renderFilterSelectComponent(data)
        const placeHolderElement = getByText(document.body, placeholderText)
        const optionElement = document.querySelector('.c-filterselect__option') as HTMLElement

        expect(placeHolderElement).toBeDefined()
        await userEvent.click(optionElement)
        expect(placeHolderElement).toBeDefined()
    })

    it('placeholder is hidden when preselected values are set and visible when unset', async () => {

        const placeholderText = 'Select an option'
        const displayClass = 'u-display--none'
        const data: IFilterSelectData = {
            options: {'option1': 'Option 1'},
            name: 'filterSelect',
            placeholder: placeholderText,
            preselected: 'option1'
        }

        await renderFilterSelectComponent(data)
        const placeholderElement = getByText(document.body, placeholderText)
        const optionElement = document.querySelector('.c-filterselect__option') as HTMLElement

        expect(placeholderElement.classList.contains(displayClass)).toEqual(true)
        await userEvent.click(optionElement)
        expect(placeholderElement.classList.contains(displayClass)).toEqual(false)
    })

    it('toggles visibility class on placeholder on value select/deselect by clicking option', async () => {

        const placeholderText = 'Select an option'
        const displayClass = 'u-display--none'
        const data: IFilterSelectData = {
            options: ['option1'],
            name: 'filterSelect',
            placeholder: placeholderText
        }

        await renderFilterSelectComponent(data)
        const placeholderElement = getByText(document.body, placeholderText)
        const optionElement = document.querySelector('.c-filterselect__option') as HTMLElement

        expect(placeholderElement.classList.contains(displayClass)).toEqual(false)
        await userEvent.click(optionElement)
        expect(placeholderElement.classList.contains(displayClass)).toEqual(true)
        await userEvent.click(optionElement)
        expect(placeholderElement.classList.contains(displayClass)).toEqual(false)
    })

    it('toggles visibility class on placeholder on value select/deselect by clicking checked items', async () => {

        const placeholder = 'Select an option'
        const displayClass = 'u-display--none'
        const checkedItemElementSelector = '.c-filterselect__checked-item'
        const data: IFilterSelectData = {
            options: ['option1'],
            name: 'filterSelect',
            placeholder
        }

        await renderFilterSelectComponent(data)
        const placeholderElement = getByText(document.body, placeholder)
        const optionElement = document.querySelector('.c-filterselect__option') as HTMLElement

        expect(placeholderElement.classList.contains(displayClass)).toEqual(false)
        await userEvent.click(optionElement)
        expect(placeholderElement.classList.contains(displayClass)).toEqual(true)
        await userEvent.click(document.querySelector(checkedItemElementSelector) as HTMLElement)
        expect(placeholderElement.classList.contains(displayClass)).toEqual(false)
    })

    it('should hide placeholder until all selected values are deselected again', async () => {

        const displayClass = 'u-display--none'
        const placeholderText = 'Select an option'
        const optionValues = ['option1', 'option2']
        const clickOption = (index: number) => userEvent.click(document.querySelectorAll(`.c-filterselect__option`)[index] as HTMLElement)
        const clickCheckedItem = () => userEvent.click(document.querySelectorAll('.c-filterselect__checked-item')[0] as HTMLElement)
        const data: IFilterSelectData = {
            options: optionValues,
            name: 'filterSelect',
            placeholder: placeholderText
        }

        await renderFilterSelectComponent(data)
        const placeholderElement = getByText(document.body, placeholderText)

        await clickOption(0)
        await clickOption(1)
        expect(placeholderElement.classList.contains(displayClass)).toEqual(true)
        await clickCheckedItem()
        expect(placeholderElement.classList.contains(displayClass)).toEqual(true)
    })

    it('should set is-active class on component when clicking expand button', async () => {

        const data: IFilterSelectData = {
            options: ['option1'],
            name: 'filterSelect',
            placeholder: 'Select an option'
        }

        await renderFilterSelectComponent(data)
        const expandButton = document.querySelector('.c-filterselect__expand-button') as HTMLElement
        const component = document.querySelector('.c-filterselect') as HTMLElement

        expect(component.classList.contains('is-active')).toEqual(false)
        await userEvent.click(expandButton)
        expect(component.classList.contains('is-active')).toEqual(true)
    })

    it('should remove is-active class on component when clicking expand button twice', async () => {

        const data: IFilterSelectData = {
            options: ['option1'],
            name: 'filterSelect',
            placeholder: 'Select an option'
        }

        await renderFilterSelectComponent(data)
        const expandButton = document.querySelector('.c-filterselect__expand-button') as HTMLElement
        const component = document.querySelector('.c-filterselect') as HTMLElement

        expect(component.classList.contains('is-active')).toEqual(false)
        await userEvent.click(expandButton)
        expect(component.classList.contains('is-active')).toEqual(true)
        await userEvent.click(expandButton)
        expect(component.classList.contains('is-active')).toEqual(false)
    })

    it('should remove is-active class on component when clicking outside component', async () => {

        const data: IFilterSelectData = {
            options: ['option1'],
            name: 'filterSelect',
            placeholder: 'Select an option'
        }

        await renderFilterSelectComponent(data)
        const expandButton = document.querySelector('.c-filterselect__expand-button') as HTMLElement
        const component = document.querySelector('.c-filterselect') as HTMLElement

        expect(component.classList.contains('is-active')).toEqual(false)
        await userEvent.click(expandButton)
        expect(component.classList.contains('is-active')).toEqual(true)
        await userEvent.click(document.body)
        expect(component.classList.contains('is-active')).toEqual(false)
    })

    it('sets is-active class on component when clicking expand button', async () => {

        const data: IFilterSelectData = {
            options: ['option1'],
            name: 'filterSelect',
            placeholder: 'Select an option'
        }

        await renderFilterSelectComponent(data)
        const expandButton = document.querySelector('.c-filterselect__expand-button') as HTMLElement
        const component = document.querySelector('.c-filterselect') as HTMLElement

        expect(component.classList.contains('is-active')).toEqual(false)
        await userEvent.click(expandButton)
        expect(component.classList.contains('is-active')).toEqual(true)
    })

    it('removes is-active class on component when clicking expand button twice', async () => {
            
            const data: IFilterSelectData = {
                options: ['option1'],
                name: 'filterSelect',
                placeholder: 'Select an option'
            }
    
            await renderFilterSelectComponent(data)
            const expandButton = document.querySelector('.c-filterselect__expand-button') as HTMLElement
            const component = document.querySelector('.c-filterselect') as HTMLElement
    
            expect(component.classList.contains('is-active')).toEqual(false)
            await userEvent.click(expandButton)
            expect(component.classList.contains('is-active')).toEqual(true)
            await userEvent.click(expandButton)
            expect(component.classList.contains('is-active')).toEqual(false)
    })

})