export default class KeepInViewPort {
  constructor() {
    this.VIEWPORTRESIZE = 'js-keep-in-viewport-after-resize';
    this.VIEWPORT = 'js-keep-in-viewport';

    // Get containers.
    const ViewPortResizeContainer = document.querySelectorAll(`[${this.VIEWPORTRESIZE}]`);
      
    if(ViewPortResizeContainer) {
      ViewPortResizeContainer.forEach(item => {
        item.addEventListener('resizeByChildren', KeepInViewPort.resizeEvent);
      });
    }

    // Get containers.
    const ViewPortContainer = document.querySelectorAll(`[${this.VIEWPORT}]`);

    if(ViewPortContainer) {
      ViewPortContainer.forEach(item => {
        KeepInViewPort.moveInsideViewPort(item, 8);
      });
    }
  }

  /**
   * Keep the actual viewport function cleaned from event objects.
   * @param {object} event 
   * @return void
   */
  static resizeEvent(event) {
    KeepInViewPort.moveInsideViewPort(event.target, 8);
  }

  /**
   * Move element inside viewport.
   * @param {object} element 
   * @param {integer} margin
   * @return void
   */
  static moveInsideViewPort(element, margin) {
    // Enable calculations.
    element.classList.add('u-display--block');

    // Compare window width with right most position.
    const viewPortRightDistance = window.innerWidth - element.getBoundingClientRect().right;
    if (viewPortRightDistance < 0) {
        element.setAttribute('style', `${element.getAttribute('style')} left: ${viewPortRightDistance - margin}px;`);
    }

    // Disable calculations.
    element.classList.remove('u-display--block'); 
  }
}