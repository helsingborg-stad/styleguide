import { renderComponent } from '../helpers/ComponentRenderer';
import { SelectElementSelector } from './Select';
import UserEvent from '@testing-library/user-event';
import { findByRole, getByRole, getByText } from "@testing-library/dom";
import { SelectComponentObserver } from './SelectComponentObserver';
import ToggleClasses from '../toggle';

interface ISelectData {
	label: string,
	id?: string,
	description: string,
	required: boolean,
	options: { [key: string]: string },
	errorMessage: string
	preselected: string[]|false,
	multiple: boolean,
	name: string,
	hideLabel: boolean,
	size: string
	maxSelections?: number,
	placeholder: string
}

const defaultComponentData: ISelectData = {
	label: '',
	description: '',
	required: false,
	options: { 'option1': 'Option 1' },
	errorMessage: '',
	multiple: false,
	hideLabel: false,
	size: '',
	name: 'foo',
	placeholder: '',
	preselected: false
}

async function renderSelectComponent(partialModalData: Partial<ISelectData>) {
	const data = { ...defaultComponentData, ...partialModalData }
	const componentClassName = "ComponentLibrary\\Component\\Select\\Select"
	const componentView = 'select'
	const component = await renderComponent(componentClassName, componentView, data)
	document.body.innerHTML = document.body.innerHTML + component.innerHTML
	new SelectComponentObserver();
	return component
}

describe('Select', () => {

	afterEach(() => {
		document.body.innerHTML = '';
	})

	it('should update value on select when clicking option list item', async () => {
		const options = { 'test-1': 'Test 1', 'test-2': 'Test 2' };
		await renderSelectComponent({ options });
		const select = document.querySelector('select') as HTMLSelectElement
		const secondOptionListItem = document.querySelector('[data-js-dropdown-option="test-2"]') as HTMLLIElement

		await UserEvent.click(secondOptionListItem);

		expect(select.value).toBe('test-2');
	});

	it('should allow selecting multiple values when attribute "multiple" is true', async () => {
		const options = { 'test-1': 'Test 1', 'test-2': 'Test 2' };
		await renderSelectComponent({ options, multiple: true });
		const select = document.querySelector('select') as HTMLSelectElement
		const firstOptionListItem = document.querySelector('[data-js-dropdown-option="test-1"]') as HTMLLIElement
		const secondOptionListItem = document.querySelector('[data-js-dropdown-option="test-2"]') as HTMLLIElement

		await UserEvent.click(firstOptionListItem);
		await UserEvent.click(secondOptionListItem);

		expect(select.selectedOptions).toHaveLength(2)
	});
	
	it('should be able to deselect selected value in multiselect', async () => {
		const options = { 'test-1': 'Test 1' };
		await renderSelectComponent({ options, multiple: true, preselected: ['test-1'] });
		const select = document.querySelector('select') as HTMLSelectElement
		const firstOptionListItem = document.querySelector('[data-js-dropdown-option="test-1"]') as HTMLLIElement

		expect(select.selectedOptions).toHaveLength(1)
		await UserEvent.click(firstOptionListItem);

		expect(select.selectedOptions).toHaveLength(0)
	});
	
	it('placeholder should be visible if set and not empty', async () => {
		const options = { 'test-1': 'Test 1' };
		const placeholderText = "Select something";
		await renderSelectComponent({ options, multiple: true, placeholder: placeholderText });

		expect(getByText(document.body, placeholderText)).toBeVisible()
	});

	it('should comma separate selected values in multiselect', async () => {
		const options = { 'test-1': 'Test 1', 'test-2': 'Test 2' };
		await renderSelectComponent({ options, multiple: true });
		const firstOptionListItem = document.querySelector('[data-js-dropdown-option="test-1"]') as HTMLLIElement
		const secondOptionListItem = document.querySelector('[data-js-dropdown-option="test-2"]') as HTMLLIElement

		await UserEvent.click(firstOptionListItem);
		await UserEvent.click(secondOptionListItem);
		const selectedOptionElements = document.querySelectorAll('option:checked') as NodeListOf<HTMLOptionElement>
		const selectedOptionLabels = Array.from(selectedOptionElements).map((option) => option.textContent || '')
		const selectedOptionLabelsString = selectedOptionLabels.join('')

		expect(selectedOptionLabelsString).toBe('Test 1, Test 2')
	});

	describe('attribute maxSelections', () => {

		it('should allow only max number of selected values when maxSelections is set', async () => {
			const maxSelections = 1;
			const options = { 'test-1': 'Test 1', 'test-2': 'Test 2' };
			await renderSelectComponent({ options, maxSelections, multiple: true });
			const select = document.querySelector('select') as HTMLSelectElement
			const firstOptionListItem = document.querySelector('[data-js-dropdown-option="test-1"]') as HTMLLIElement
			const secondOptionListItem = document.querySelector('[data-js-dropdown-option="test-2"]') as HTMLLIElement

			await UserEvent.click(firstOptionListItem);
			await UserEvent.click(secondOptionListItem);

			expect(select.selectedOptions).toHaveLength(1)
		});

		it('should set NOT selected values as disabled when max number of values are selected', async () => {
			const maxSelections = 1;
			const options = { 'test-1': 'Test 1', 'test-2': 'Test 2' };
			await renderSelectComponent({ options, maxSelections, multiple: true });
			const firstOptionListItem = document.querySelector('[data-js-dropdown-option="test-1"]') as HTMLLIElement
			const secondOptionListItem = document.querySelector('[data-js-dropdown-option="test-2"]') as HTMLLIElement
			const secondOptionElement = document.querySelector('option[value="test-2"]') as HTMLOptionElement

			await UserEvent.click(firstOptionListItem);

			expect(secondOptionElement.disabled).toBe(true);
			expect(secondOptionListItem.getAttribute('aria-disabled')).toBe('true');
		});

		it('should NOT disable selected values when max number of values are selected', async () => {
			const maxSelections = 1;
			const options = { 'test-1': 'Test 1', 'test-2': 'Test 2' };
			await renderSelectComponent({ options, maxSelections, multiple: true });
			const firstOptionListItem = document.querySelector('[data-js-dropdown-option="test-1"]') as HTMLLIElement
			const firstOptionElement = document.querySelector('option[value="test-1"]') as HTMLOptionElement

			await UserEvent.click(firstOptionListItem);

			expect(firstOptionElement.disabled).toBe(false);
			expect(firstOptionListItem.getAttribute('aria-disabled')).toBe('false');
		});

	})

	describe('clear button', () => {

		it('should show clear button when single select is not required', async () => {
			const options = { 'test-1': 'Test 1' };
			await renderSelectComponent({ options, required: false });

			expect(document.querySelector(`[${SelectElementSelector.selectClearAttribute}]`)).not.toBeNull();
		});

		it('should clear value when clicked and hide clear button', async () => {
			const options = { 'test-1': 'Test 1' };
			await renderSelectComponent({ options, required: false });
			const select = document.querySelector('select') as HTMLSelectElement
			const firstOptionListItem = document.querySelector('[data-js-dropdown-option="test-1"]') as HTMLLIElement
			const clearButton = document.querySelector(`[${SelectElementSelector.selectClearAttribute}]`) as HTMLButtonElement

			await UserEvent.click(firstOptionListItem);
			await UserEvent.click(clearButton);

			expect(select.value).toBe('');
			expect(clearButton.getAttribute('aria-hidden')).toBe('true');
		});
	})

	describe('accessibility', () => {
		it('keyboard navigation should enable selecting options', async () => {
			const options = { 'test-1': 'Test 1' };
			await renderSelectComponent({ options });
			const select = document.querySelector('select') as HTMLSelectElement
			const actionOverlay = document.querySelector(`[${SelectElementSelector.actionOverlayElementAttribute}]`) as HTMLDivElement

			await UserEvent.type(actionOverlay, ' '); // Open dropdown by clicking space on action overlay.
			await UserEvent.tab() // Step into dropdown list onto the first option.
			await UserEvent.type(document.activeElement as HTMLElement, ' ') // Select first option by clicking space on it.

			expect(select.value).toBe('test-1');
		})		
	})
});