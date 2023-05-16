/* eslint-disable no-restricted-globals */
/* eslint-disable class-methods-use-this */
/**
 * Component Image
 */
class ContainerMediaQuery {
  constructor() {

    // Class vars
    const prefixName = "--size-"; 
      
    // Init only if browser supports ResizeObserver
    if ('ResizeObserver' in self) {
      this.resizeObserver = new ResizeObserver((entries) => {
        const defaultBreakpoints = {xs: 384, sm: 576, md: 768, lg: 960, xl: 1200};

        entries.forEach((entry) => {
          
          // If breakpoints are defined on the observed element,
          const breakpoints = entry.target.dataset.breakpoints ?
          JSON.parse(entry.target.dataset.breakpoints) :
          defaultBreakpoints;

          // Update the matching breakpoints on the observed element.
          Object.keys(breakpoints).forEach((breakpoint) => {

            const minWidth = breakpoints[breakpoint];

            if (entry.contentRect.width >= minWidth) {
              entry.target.classList.add(entry.target.classList[0] + prefixName + breakpoint);
            } else {
              entry.target.classList.remove(entry.target.classList[0] + prefixName + breakpoint);
            }

          });
        });  
      }); 

      this.initMediaQueryElements(); 
      this.observerNewElements();
    }
  }

  observerNewElements() {
    const observer = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        const elements = mutation.addedNodes;
        if (elements?.length) {
          elements.forEach(element => {
            if (element?.nodeType === Node.ELEMENT_NODE && element.matches('[data-observe-resizes]')) {
              this.resizeObserver.observe(element);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Init
   * @return void
   */
  initMediaQueryElements() {

    // Get elements
    const targetElemets = this.getTargetElements(); 

    // Init observer on all target elements
    if(targetElemets.length) {
      targetElemets.forEach((element) => {
        this.resizeObserver.observe(element);
      }); 
    }
  }

  /**
   * Makes query to dom, for observe data attr. 
   */
  getTargetElements() {
    return document.querySelectorAll('[data-observe-resizes]');
  }
}

export default ContainerMediaQuery;