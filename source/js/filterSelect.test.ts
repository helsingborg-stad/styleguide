import { getByText } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import FilterSelect from "./filterSelect";
import { IComponentData, ComponentRenderer, renderComponent } from './helpers/ComponentRenderer';

interface IFilterSelectData extends IComponentData {
    options: string[],
    name: string,
    placeholder: string,
    preselected?: string
}

function initializeComponentJavaScript() {
    new FilterSelect();
}

async function renderFilterSelectComponent(data: IFilterSelectData) {
    const componentClassName = "ComponentLibrary\\Component\\FilterSelect\\FilterSelect"
    const componentView = 'filterSelect'
    const component = await renderComponent( componentClassName, componentView, data )
    document.body.innerHTML = component.innerHTML
    initializeComponentJavaScript()
    return component
}

describe('filterSelect', () => {

    afterEach(() => {
        document.body.innerHTML = '';
    })

    it('is defined', () => {
        expect(FilterSelect).toBeDefined()
    })

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

})