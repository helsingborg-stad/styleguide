export class AriaPressedToggler {
  constructor() {
    this.init();
    this.observe();
  }

  private init() {
    const initElements = document.querySelectorAll("[aria-pressed='true'], [aria-pressed='false']");
    if(initElements.length) {
      initElements.forEach((element) => {
        this.applyOnClickEvent(element as HTMLElement); 
      });
    }
  }

  private applyOnClickEvent(element: HTMLElement): void {
    element.addEventListener('click', () => {
      this.toggleAriaPressed(element);
    });
  }

  private toggleAriaPressed(el: HTMLElement) {
    const currentState = el.getAttribute('aria-pressed');
    const newState = currentState === 'true' ? 'false' : 'true';
    el.setAttribute('aria-pressed', newState);
  }

  private observe(): void {
    const container = document.documentElement || document.body;
    const observerOptions = {
      childList: true,
      subtree: true,
      attributeFilter: ["aria-pressed"]
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement && node.getAttribute('aria-pressed')) {
              this.applyOnClickEvent(node); 
            }
          });
        }
      });
    });

    observer.observe(container, observerOptions);
  }
}
