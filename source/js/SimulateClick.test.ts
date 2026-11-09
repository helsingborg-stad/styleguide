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

  it('simulates click when click target is an SVG child element', async () => {
    const targetElement = document.createElement('button');
    const triggerElement = document.createElement('button');
    const iconElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const iconPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    targetElement.setAttribute('id', 'target-svg');
    triggerElement.setAttribute('data-simulate-click', '#target-svg');

    iconElement.appendChild(iconPathElement);
    triggerElement.appendChild(iconElement);

    const targetElementClickHandler = jest.fn();
    targetElement.addEventListener('click', targetElementClickHandler);

    document.body.appendChild(targetElement);
    document.body.appendChild(triggerElement);

    await UserEvent.click(iconPathElement as unknown as Element);

    expect(targetElementClickHandler).toHaveBeenCalledTimes(1);
  })
})