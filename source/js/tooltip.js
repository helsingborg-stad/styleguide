class Tooltip {
    constructor() {
        this.setListener();
    }

    setListener() {
        const tooltips = document.querySelectorAll('.c-tooltip');
        if(tooltips.length > 0) {
            tooltips.forEach(tooltip => {
                const container = tooltip.querySelector('.c-tooltip__container');
                const tooltipLabel = tooltip.querySelector('.c-tooltip__wrapper');
    
                ['mouseleave', 'focusout'].forEach(key => {
                    tooltipLabel.addEventListener(key, () => {
                        this.handleLeave(tooltip, container);
                    })
                });
    
                ['mouseenter', 'focusin'].forEach(key => {
                    tooltipLabel.addEventListener(key, () => {
                        this.handleHover(tooltip, container, tooltipLabel);
                    })
                });
            });
        }
    }

    handleLeave(tooltip, container) {
        this.handleClasses(tooltip, ['is-visible'], 'is-hidden');
        container.setAttribute('aria-hidden', 'true');
    }

    handleHover(tooltip, container, tooltipLabel) {
        const originalDirection = tooltip.getAttribute('original-placement');
        let tooltipWidth = parseInt(getComputedStyle(container).getPropertyValue('max-width'), 10);
        let position = tooltipLabel.getBoundingClientRect();

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

        this.handleClasses(tooltip, ['is-hidden'], 'is-visible');
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