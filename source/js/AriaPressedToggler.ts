/** Keeps pressed-state controls in sync with their click or popover state. */
export class AriaPressedToggler {
  private readonly selector = "[aria-pressed='true'], [aria-pressed='false']";
  private readonly registeredElements = new WeakSet<Element>();

  /** Registers existing controls and observes newly inserted controls. */
  constructor() {
    this.init();
    this.observe();
  }

  /** Registers controls already present in the document. */
  private init() {
    document.querySelectorAll(this.selector).forEach((element) => {
      this.register(element);
    });
  }

  /** Binds a control to its popover when present, or to its own click otherwise. */
  private register(element: Element): void {
    if (this.registeredElements.has(element)) {
      return;
    }

    this.registeredElements.add(element);
    const popoverId = element.getAttribute('popovertarget');
    const popover = popoverId ? document.getElementById(popoverId) : null;

    if (popover?.hasAttribute('popover')) {
      if (typeof popover.showPopover === 'function') {
        element.setAttribute('aria-pressed', String(popover.matches(':popover-open')));
      }

      popover.addEventListener('toggle', (event) => {
        if (event.newState === 'open' || event.newState === 'closed') {
          element.setAttribute('aria-pressed', String(event.newState === 'open'));
        }
      });
      return;
    }

    element.addEventListener('click', () => {
      element.setAttribute('aria-pressed', String(element.getAttribute('aria-pressed') !== 'true'));
    });
  }

  /** Registers controls inserted alone or as part of a subtree. */
  private observe(): void {
    const container = document.documentElement || document.body;
    const observerOptions = {
      childList: true,
      subtree: true
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              if (node.matches(this.selector)) {
                this.register(node);
              }
              node.querySelectorAll(this.selector).forEach((element) => {
                this.register(element);
              });
            }
          });
        }
      });
    });

    observer.observe(container, observerOptions);
  }
}
