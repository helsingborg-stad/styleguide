import { AriaPressedToggler } from './AriaPressedToggler';

/** Dispatches the native popover event shape in jsdom. */
function dispatchToggle(popover: Element, newState: 'open' | 'closed'): void {
  popover.dispatchEvent(Object.assign(new Event('toggle'), { newState }));
}

describe('AriaPressedToggler', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('updates popover controls on actual open and close, not on trigger clicks', () => {
    document.body.innerHTML = `
      <button aria-pressed="false" popovertarget="drawer">Menu</button>
      <div id="drawer" popover></div>
    `;
    new AriaPressedToggler();
    const trigger = document.querySelector('button')!;
    const popover = document.getElementById('drawer')!;

    trigger.click();
    expect(trigger.getAttribute('aria-pressed')).toBe('false');

    dispatchToggle(popover, 'open');
    expect(trigger.getAttribute('aria-pressed')).toBe('true');

    dispatchToggle(popover, 'closed');
    expect(trigger.getAttribute('aria-pressed')).toBe('false');
  });

  it('keeps click-to-toggle behavior for a standalone pressed button', () => {
    document.body.innerHTML = '<button aria-pressed="false">Play</button>';
    new AriaPressedToggler();
    const button = document.querySelector('button')!;

    button.click();
    expect(button.getAttribute('aria-pressed')).toBe('true');

    button.click();
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });
});
