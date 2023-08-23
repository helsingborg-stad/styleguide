export class IsCheckedToggler {
  constructor() {
    this.init();
    this.observe();
  }

  private init() {
    const initElements = document.querySelectorAll("select[multiple] option");
    if(initElements.length) {
      initElements.forEach((element) => {
        this.applyOnClickEvent(element as HTMLOptionElement); 
      });
    }
  }

  private applyOnClickEvent(element: HTMLOptionElement): void {
    element.addEventListener('mouseup', () => {
      console.log("remove"); 
      this.toggleIsChecked(element);
    });
  }

  private toggleIsChecked(element: HTMLOptionElement) {

    const newState = element.defaultSelected === false ? true : false;

    if(newState === true) {
      element.setAttribute('selected', 'true');
    } else {
      element.removeAttribute('selected');
    }

    element.selected = newState;
  }

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
            if (node instanceof HTMLOptionElement) {
              this.applyOnClickEvent(node); 
            }
          });
        }
      });
    });

    observer.observe(container, observerOptions);
  }
}
