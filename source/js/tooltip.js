class Tooltip {
    constructor() {
        this.setListener();
    }

    setListener() {
        let tooltips = document.querySelectorAll('.c-tooltip');
        tooltips.forEach(tooltip => {
            const container = tooltip.querySelector('.c-tooltip__container');

            ['mouseleave', 'focusout'].forEach(key => {
                tooltip.addEventListener(key, () => {
                    this.handleLeave(tooltip, container);
                })
            });

            ['mouseenter', 'focusin'].forEach(key => {
                tooltip.addEventListener(key, () => {
                    this.handleHover(tooltip, container);
                })
            });
        });
    }

    handleLeave(tooltip, container) {
        this.handleClasses(tooltip, ['c-tooltip--visible'], 'c-tooltip--hidden');
        container.setAttribute('aria-hidden', 'true');
    }

    handleHover(tooltip, container) {
        const originalDirection = tooltip.getAttribute('original-placement');
        let tooltipWidth = parseInt(getComputedStyle(container).getPropertyValue('max-width'), 10);
        let position = tooltip.getBoundingClientRect();

        if (!tooltip.classList.contains(originalDirection) ||
            tooltip.classList.contains('c-tooltip--overflow-left') ||
            tooltip.classList.contains('c-tooltip--overflow-right')) {
            this.resetDirection(tooltip, originalDirection);
        }


        if (position.right + (tooltipWidth / (tooltip.classList.contains('c-tooltip--bottom') || tooltip.classList.contains('c-tooltip--top') ? 2 : 1)) > document.documentElement.clientWidth) {
            this.overflowRight(tooltip);
        }

        if (position.left - (tooltipWidth / (tooltip.classList.contains('c-tooltip--bottom') || tooltip.classList.contains('c-tooltip--top') ? 2 : 1)) < 0) {
            this.overflowLeft(tooltip);
        }

        this.handleClasses(tooltip, ['c-tooltip--hidden'], 'c-tooltip--visible');
        container.setAttribute('aria-hidden', 'false');
    }

    overflowRight(tooltip) {
        if (tooltip.classList.contains('c-tooltip--right')) {
            this.handleClasses(tooltip, ['c-tooltip--right'], 'c-tooltip--left');
        } else {
            this.handleClasses(tooltip, ['c-tooltip--overflow-left'], 'c-tooltip--overflow-right');
        }
    }

    overflowLeft(tooltip) {
        if (tooltip.classList.contains('c-tooltip--left')) {
            this.handleClasses(tooltip, ['c-tooltip--left'], 'c-tooltip--right');
        } else {
            this.handleClasses(tooltip, ['c-tooltip--overflow-right'], 'c-tooltip--overflow-left');
        }
    }

    resetDirection(tooltip, originalDirection) {
        this.handleClasses(tooltip, ['c-tooltip--left', 'c-tooltip--right', 'c-tooltip--overflow-left', 'c-tooltip--overflow-right'], originalDirection);
    }

    handleClasses(element, removeClasses, addClass = false) {
        removeClasses.forEach(className => {
            element.classList.remove(className);
        });

        addClass && element.classList.add(addClass);

    }
}
export default Tooltip;
























































/* class Tooltip {
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
            this.overflowLeft(parent, position);
        }
    }

    overflowRight(parent, position) {
        if(parent.classList.contains('c-tooltip--right')) {
            if(position.left - position.width > 0) {
                this.handleClasses(parent, ['c-tooltip--right'], 'c-tooltip--left');
            } else {
                this.handleClasses(parent, ['c-tooltip--right'], 'c-tooltip--bottom');
            }
        } else {
            this.handleClasses(parent, ['c-tooltip--overflow-left'], 'c-tooltip--overflow-right');
        }
    }

    overflowLeft(parent, position) {
        if(parent.classList.contains('c-tooltip--left')) {
            if(document.documentElement.clientWidth - position.width > 0) {
                this.handleClasses(parent, ['c-tooltip--left'], 'c-tooltip--right');
            } else {
                this.handleClasses(parent, ['c-tooltip--left'], 'c-tooltip--bottom');
            }
        }
        else {
            this.handleClasses(parent, ['c-tooltip--overflow-right'], 'c-tooltip--overflow-left');
        }
    }

    overflowBoth(parent) {
        this.handleClasses(parent, ['c-tooltip--overflow-left', 'c-tooltip--overflow-right'], 'c-tooltip--full-width')
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

        addClass && element.classList.add(addClass);

    }
}
export default Tooltip; */