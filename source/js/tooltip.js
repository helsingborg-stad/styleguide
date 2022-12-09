class Tooltip {
constructor(){
    this.setDebounce();
}

    setDebounce() {
        
        const containers = document.querySelectorAll('.c-tooltip__container');
        if(containers.length > 0) {
            window.addEventListener('resize', this.debounce(containers, 1000));
        } else { return false;};
    }

    debounce(containers, delay) {
        let timer;
        
        this.tooltipLoop(containers);
        return () => {
            timer ? clearTimeout(timer) : '';
            timer = setTimeout(() => {
               this.tooltipLoop(containers);
            }, delay);
        }
    }

    tooltipLoop(containers) {
            containers.forEach(container => this.handleTooltip(container));
    }

    handleTooltip(container) {
        let position = container.getBoundingClientRect();
        const parent = container.parentElement;
        const originalDirection = parent.getAttribute('original');

        if (!parent.classList.contains(originalDirection) || 
        parent.classList.contains('c-tooltip--overflow-left') ||
        parent.classList.contains('c-tooltip--overflow-right')) {
            this.resetDirection(parent, position, originalDirection);
        }

        if (position.width > document.documentElement.clientWidth) {
            this.overflowBoth(parent);
            return;
        }

        if (position.right > document.documentElement.clientWidth) {
            this.overflowRight(parent, position);
        }

        if (position.left < 0) {
            this.overflowLeft(parent);
        }
    }

    overflowRight(parent, position) {
        if(parent.classList.contains('c-tooltip--right')) {
            this.handleClasses(parent, ['c-tooltip--right'], 'c-tooltip--left');
        } else {
            this.handleClasses(parent, ['c-tooltip--overflow-left'], 'c-tooltip--overflow-right');
        }
    }

    overflowLeft(parent) {
        if(parent.classList.contains('c-tooltip--left')) {
            this.handleClasses(parent, ['c-tooltip--left'], 'c-tooltip--right');
        }
        else {
            this.handleClasses(parent, ['c-tooltip--overflow-right'], 'c-tooltip--overflow-left');
        }
    }

    overflowBoth(parent) {
        this.handleClasses(parent, ['c-tooltip--overflow-left', 'c-tooltip--overflow-left'], 'c-tooltip--full-width')
    }

    resetDirection(parent, position, originalDirection) {
        if(originalDirection === 'c-tooltip--right') {
            if(position.right + position.width < document.documentElement.clientWidth) {
                this.overflowLeft(parent);  
            }
        }

        if(originalDirection === 'c-tooltip--left') {
            if(position.left > position.width) {
                this.overflowRight(parent); 
            }
        }
        
        if(originalDirection === 'c-tooltip--bottom' ||
           originalDirection === 'c-tooltip--top') {

            if(parent.classList.contains('c-tooltip--overflow-left')) {
                if(position.left - (position.width/2) > 0 ) {
                    this.handleClasses(parent, ['c-tooltip--overflow-left']);
                }
            }

            if(parent.classList.contains('c-tooltip--overflow-right')) {
                if (document.documentElement.clientWidth - position.right > position.width/2) {
                    this.handleClasses(parent, ['c-tooltip--overflow-right']);
                }
            }
        }
    }

    handleClasses(element, removeClasses, addClass = false) {
        removeClasses.forEach(className => {
            element.classList.remove(className);
        });

        addClass ? element.classList.add(addClass) : '';
    }
}
export default Tooltip;