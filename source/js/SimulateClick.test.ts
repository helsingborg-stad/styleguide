import UserEvent from '@testing-library/user-event'
import { SimulateClick } from "./SimulateClick";

describe('SimulateClick', () => {

  beforeAll(() => {
    new SimulateClick();
  })

  it('simulates click on target element', async () => {
    const targetElement = document.createElement('button');
    const triggerElement = document.createElement('button');
    targetElement.setAttribute('id', 'target');
    triggerElement.setAttribute('data-simulate-click', '#target');
    const targetElementClickHandler = jest.fn()
    targetElement.addEventListener('click', targetElementClickHandler);

    document.body.appendChild(targetElement);
    document.body.appendChild(triggerElement);

    await UserEvent.click(triggerElement);

    expect(targetElementClickHandler).toHaveBeenCalledTimes(1)
  })
  
  it('simulates only 1 click if trigger element was handled by mutation observer', async () => {
    const targetElement = document.createElement('button');
    const triggerElement = document.createElement('button');
    targetElement.setAttribute('id', 'target');
    triggerElement.setAttribute('data-simulate-click', '#target');
    const targetElementClickHandler = jest.fn()
    targetElement.addEventListener('click', targetElementClickHandler);

    document.body.appendChild(targetElement);
    document.body.appendChild(triggerElement);
    document.body.removeChild(triggerElement);
    document.body.appendChild(triggerElement);

    await UserEvent.click(triggerElement);

    expect(targetElementClickHandler).toHaveBeenCalledTimes(1)
  })
})