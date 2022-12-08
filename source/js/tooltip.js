class Tooltip {
constructor(){

    //this.tooltip();
    this.setMarginEventListener();
}

    setMarginEventListener() {
        const container = document.querySelector('.c-tooltip__container');
        const arrow = container.querySelector('.c-tooltip__arrow');
        const containerWidth = container.offsetWidth;

        window.addEventListener('resize', this.debounce({container, arrow, containerWidth}, 1000));
    }

    handleTooltip({ container, arrow, containerWidth }) {
        let position = container.getBoundingClientRect();

        console.log(position.right, document.documentElement.clientWidth);

        if(position.width > document.documentElement.clientWidth) {
                container.parentElement.classList.remove('c-tooltip--overflow-left');
                container.parentElement.classList.remove('c-tooltip--overflow-right');
                container.parentElement.classList.add('c-tooltip--full-width');
        }

        if (position.right > document.documentElement.clientWidth) {
            container.parentElement.classList.add('c-tooltip--overflow-right');
            container.parentElement.classList.remove('c-tooltip--overflow-left');
        }

        if (position.left < 0) {
            container.parentElement.classList.add('c-tooltip--overflow-left');
            container.parentElement.classList.remove('c-tooltip--overflow-right');

        } 

        
    }

    debounce({ container, arrow, containerWidth }, delay) {
        let timer;

        this.handleTooltip({ container, arrow, containerWidth });

        return () => {
            timer ? clearTimeout(timer) : '';
            timer = setTimeout(() => {
                this.handleTooltip({ container, arrow, containerWidth });
            }, delay);
        }
    }

/*     tooltip() {
        const container = document.querySelector('.c-tooltip__container');
        const arrow = container.querySelector('.c-tooltip__arrow');
        const containerWidth = container.offsetWidth;
        this.handlePostion(container, arrow, containerWidth);
        window.addEventListener('resize', () => {
            this.handlePostion(container, arrow, containerWidth);
        });
    } */

/*     handlePostion(container, arrow, containerWidth) {
        let position = container.getBoundingClientRect();
        let widthIsSet = false; */
        //console.log(position.left, position.right, document.documentElement.clientWidth);
        /* if(document.documentElement.clientWidth < containerWidth) {
            container.style.width = 'calc(100vw - 32px)';
            widthIsSet = true;

        } else {
            container.style.width = containerWidth + 'px';
            widthIsSet = false;
        } */

        /* if (position.left < 0 && !widthIsSet) {
            arrow.style.marginLeft = position.left - 5 + 'px';
            container.style.marginLeft = Math.abs(position.left) + 'px';
        } 

        console.log(document.documentElement.clientWidth, window.innerWidth, position.right);
        console.log(position.right > document.documentElement.clientWidth);
        if (position.right > document.documentElement.clientWidth && !widthIsSet) {
            arrow.style.marginLeft = position.right - document.documentElement.clientWidth + 5 + 'px';
            container.style.left = -(position.right - document.documentElement.clientWidth) + 'px';
        }
    } */


}
export default Tooltip;