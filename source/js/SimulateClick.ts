export class SimulateClick {
  constructor() {
    this.init();
    this.observe();
  }

  private init() {
    const initElements = document.querySelectorAll("[data-simulate-click]");
    if(initElements.length) {
      initElements.forEach((element) => {
        const target = element.getAttribute('data-simulate-click') ?? ''; 
        this.applyOnClickEvent(element as HTMLElement, target); 
      });
    }
  }

  private applyOnClickEvent(element: HTMLElement, target: string): void {
    element.addEventListener('click', () => {
      console.log(element, target); 
    });
  }

  private observe(): void {
    const container = document.documentElement || document.body;
    const observerOptions = {
      childList: true,
      subtree: true,
      attributeFilter: ["data-simulate-click"]
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement && node.getAttribute('data-simulate-click')) {
              const target = node.getAttribute('data-simulate-click') ?? ''; 
              this.applyOnClickEvent(node, target); 
            }
          });
        }
      });
    });

    observer.observe(container, observerOptions);
  }
}
