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
      this.resizeObserver = new ResizeObserver(function(entries) {
        
        const defaultBreakpoints = {xs: 384, sm: 576, md: 768, lg: 960};

        entries.forEach(function(entry) {
          
          // If breakpoints are defined on the observed element,
          let breakpoints = entry.target.dataset.breakpoints ?
          JSON.parse(entry.target.dataset.breakpoints) :
          defaultBreakpoints;

          // Update the matching breakpoints on the observed element.
          Object.keys(breakpoints).forEach(function(breakpoint) {

            let minWidth = breakpoints[breakpoint];

            if (entry.contentRect.width >= minWidth) {
              entry.target.classList.add(entry.target.classList[0] + prefixName + breakpoint);
            } else {
              entry.target.classList.remove(entry.target.classList[0] + prefixName + breakpoint);
            }

          });
        });  
      }); 

      this.initMediaQueryElements(); 
    }
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
      for(let element of targetElemets) {
        this.resizeObserver.observe(element);
      }
    }

  }

  getTargetElements() {
    return document.querySelectorAll('[data-observe-resizes]');
  }

  

}

export default ContainerMediaQuery;



/*console.log("Rez"); 

if ('ResizeObserver' in self) {
  console.log("rez init"); 
  let resizeObserver = new ResizeObserver(function(entries) {
    
    let defaultBreakpoints = {SM: 384, MD: 576, LG: 768, XL: 960};

    entries.forEach(function(entry) {

      

    });
  });

  let elements = document.querySelectorAll('[data-observe-resizes]');

  console.log(elements); 
 
  for (var element, i = 0; element = elements[i]; i++) {
    resizeObserver.observe(element);
  }
}*/ 