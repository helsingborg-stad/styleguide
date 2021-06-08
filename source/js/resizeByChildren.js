export default class ResizeByChildren {
  constructor() {
    this.RESIZE = 'js-resize-by-children';

    //Get containers
    let resizeContainer = document.querySelectorAll(`[${this.RESIZE}]`);

    if(resizeContainer) {

      resizeContainer.forEach(item => {

        //Enale calculations
        item.classList.add('u-display--block'); 

        //Declare
        let currentChilds = item.querySelectorAll('li > a'); 
        let widthStack = []; 

        //Get all widts as array
        currentChilds.forEach(child => {
          widthStack.push(child.getBoundingClientRect().width);
        }); 

        //Get largest
        let maxSize = Math.round(Math.max.apply(null, widthStack)); 

        if(item.getBoundingClientRect().width > maxSize) {
          item.setAttribute("style", "width:" + maxSize + "px !important;");
        }

        //Disable calculations
        item.classList.remove('u-display--block'); 
      
        //Add class as calc
        item.classList.add(item.classList[0] + '--calculated'); 

      }); 
    }
  }
}