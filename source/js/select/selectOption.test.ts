import { renderComponent } from '../helpers/ComponentRenderer';
import { SelectComponentObserver } from './selectOption';
import UserEvent from '@testing-library/user-event';

interface ISelectData {
  label: string,
  id?: string,
  description: string,
  required: boolean,
  options: { [key: string]: string },
  errorMessage: string
  preselected: false
  multiple: boolean,
  name: string,
  hideLabel: boolean,
  size: string
  maxSelections?: number
}

const defaultComponentData: ISelectData = {
  label: '',
  description: '',
  required: false,
  options: {'option1': 'Option 1'},
  errorMessage: '',
  preselected: false,
  multiple: false,
  hideLabel: false,
  size: '',
  name: 'foo',
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

describe('selectOption', () => {

  afterEach(() => {
    document.body.innerHTML = '';
  })

  it('should update value on select when clicking option list item', async () => {
    const options = {'test-1': 'Test 1', 'test-2': 'Test 2'};
    await renderSelectComponent({options});
    const select = document.querySelector('select') as HTMLSelectElement
    const secondOptionListItem = document.querySelector('[data-js-dropdown-option="test-2"]') as HTMLLIElement
    
    await UserEvent.click(secondOptionListItem);

    expect(select.value).toBe('test-2');
  });
  
  it('should allow selecting multiple values when attribute "multiple" is true', async () => {
    const options = {'test-1': 'Test 1', 'test-2': 'Test 2'};
    await renderSelectComponent({options, multiple: true});
    const select = document.querySelector('select') as HTMLSelectElement
    const firstOptionListItem = document.querySelector('[data-js-dropdown-option="test-1"]') as HTMLLIElement
    const secondOptionListItem = document.querySelector('[data-js-dropdown-option="test-2"]') as HTMLLIElement
    
    await UserEvent.click(firstOptionListItem);
    await UserEvent.click(secondOptionListItem);

    expect(select.selectedOptions).toHaveLength(2)
  });
  
  it('should allow only max number of selected values when maxSelections is set', async () => {
    const maxSelections = 1;
    const options = {'test-1': 'Test 1', 'test-2': 'Test 2'};
    await renderSelectComponent({options, maxSelections, multiple: true});
    const select = document.querySelector('select') as HTMLSelectElement
    const firstOptionListItem = document.querySelector('[data-js-dropdown-option="test-1"]') as HTMLLIElement
    const secondOptionListItem = document.querySelector('[data-js-dropdown-option="test-2"]') as HTMLLIElement
    
    await UserEvent.click(firstOptionListItem);
    await UserEvent.click(secondOptionListItem);

    expect(select.selectedOptions).toHaveLength(1)
  });
  
  it.skip('should set not selected values as disabled when max number of values are selected', async () => {
    const maxSelections = 1;
    const options = {'test-1': 'Test 1', 'test-2': 'Test 2'};
    await renderSelectComponent({options, maxSelections, multiple: true});
    const firstOptionListItem = document.querySelector('[data-js-dropdown-option="test-1"]') as HTMLLIElement
    const secondOptionListItem = document.querySelector('[data-js-dropdown-option="test-2"]') as HTMLLIElement
    const secondOptionElement = document.querySelector('option[value="test-2"]') as HTMLOptionElement
    
    await UserEvent.click(firstOptionListItem);

    expect(secondOptionElement.getAttributeNames).toContain('disabled');
    expect(secondOptionListItem.getAttributeNames).toContain('data-js-dropdown-option-disabled');
  });
});