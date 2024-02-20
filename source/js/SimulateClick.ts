export class SimulateClick {
  private readonly simulateClickAttr = 'data-simulate-click';
  private triggers:Node[] = []

  constructor() {
    this.init();
    this.observe();
  } 

  private init() {
    const initElements = document.querySelectorAll(`[${this.simulateClickAttr}]`);
    if(initElements.length) {
      initElements.forEach((element) => {
        const target = element.getAttribute(this.simulateClickAttr) ?? ''; 
        if(document.querySelectorAll(target).length) {
          this.applyOnClickEvent(element as HTMLElement, target); 
        }
      });
    }
  }

  private applyOnClickEvent(element: HTMLElement, target: string): void {

    if( this.triggers.includes(element) ) return
    this.triggers.push(element)

    element.addEventListener('click', (event:MouseEvent) => {

      if (event.target instanceof HTMLElement) {
        const targetElements = document.querySelectorAll<HTMLElement>(target);
  
        targetElements.forEach((targetElement) => {
          targetElement.click();
        });
      }
    });
  }
  
  private observe(): void {
    const container = document.documentElement || document.body;
    const observerOptions = {
      childList: true,
      subtree: true,
      attributeFilter: [this.simulateClickAttr]
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement && node.getAttribute(this.simulateClickAttr)) {
              const target = node.getAttribute(this.simulateClickAttr) ?? ''; 
              this.applyOnClickEvent(node, target); 
            }
          });
        }
      });
    });

    observer.observe(container, observerOptions);
  }
}
