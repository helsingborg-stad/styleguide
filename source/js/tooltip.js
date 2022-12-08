class Tooltip {
constructor(){

    this.tooltip();
}

    tooltip() {
        const container = document.querySelector('.c-tooltip__container');
        const arrow = container.querySelector('.c-tooltip__arrow');
        const containerWidth = container.offsetWidth;
        this.handlePostion(container, arrow, containerWidth);
        window.addEventListener('resize', () => {
            this.handlePostion(container, arrow, containerWidth);
        });
    }

    handlePostion(container, arrow, containerWidth) {
        let position = container.getBoundingClientRect();
        let widthIsSet = false;
        //console.log(position.left, position.right, document.documentElement.clientWidth);
        if(document.documentElement.clientWidth < containerWidth) {
            container.style.width = 'calc(100vw - 32px)';
            widthIsSet = true;

        } else {
            container.style.width = containerWidth + 'px';
            widthIsSet = false;
        }

        if (position.left < 0 && !widthIsSet) {
            arrow.style.marginLeft = position.left - 21 + 'px';
            container.style.marginLeft = Math.abs(position.left - 16) + 'px';
        } 

        console.log(position.right > document.documentElement.clientWidth);
        if (position.right > document.documentElement.clientWidth && !widthIsSet) {
        }
    }


}
export default Tooltip;