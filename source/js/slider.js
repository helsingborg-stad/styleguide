/* eslint-disable no-unused-expressions */

import Steppers from "./steppers";

export default class Slider {
    constructor(slider) {
        this.SLIDER     = slider;
        this.CLASS      = "c-segment";
        this.ATTR       = "js-slider";
        this.BTN        = "js-slider-btn";
        this.INDEX      = "js-slider-index";
        this.INNER      = "js-slider-inner";
        this.AUTOSLIDE  = "js-slider__autoslide";
        this.STEP       = "data-step";
        this.PAUSEHOVER = false;

        this.StepperInstance = new Steppers;
        
        this.applySliders();
        this.enableStepper();
        
        if(this.SLIDER.hasAttribute(this.AUTOSLIDE)) {
            this.autoSlider();
            this.autoSliderHoverHandler();
        };
        
    }

    /**
     * Finds all slides and attaches event listeners.
     * @return {void}
     */
    applySliders() {
        this.SLIDER.querySelectorAll(`[${this.BTN}]`).forEach((button) => {
            button.addEventListener('click', (e) => {
                this.clickedBtn(e);
            });
        })
    }

    /**
     * Handles click on either next och previous button
     * @param {Object} e The click event
     */
    clickedBtn(e) {  
        let newIndex;

        if (e.target.closest("button").getAttribute(this.BTN) === 'prev') {
            newIndex = this.prevIndex(this.getCurrentIndex(this.SLIDER))

        } else if (e.target.closest("button").getAttribute(this.BTN) === 'next') {
            newIndex = this.nextIndex(this.getCurrentIndex(this.SLIDER))
        }

        this.updateSlider(newIndex);
    }

    updateSlider(newIndex) {
        this.SLIDER.setAttribute(this.INDEX, newIndex);
        this.SLIDER.setAttribute(this.STEP, newIndex);
        this.updateStepper();
        this.moveToIndex();
    }

    // eslint-disable-next-line class-methods-use-this
    autoSlider() {
        setTimeout(
            () => {
                if(!this.PAUSEHOVER) {
                    this.updateSlider(this.nextIndex(this.getCurrentIndex(this.SLIDER)));
                    
                }
                this.autoSlider();
            }
        , 3000);
    }

    autoSliderHoverHandler () {
        this.SLIDER.addEventListener('mouseenter', () => {
            this.PAUSEHOVER = true
        })

        this.SLIDER.addEventListener('mouseleave', (e) => {
            if (e.target === this.SLIDER) {
                this.PAUSEHOVER = false
            }
        })
    }

    prevIndex(current) {
        return current === 0 ? this.getItemsLength(this.SLIDER) -1 : current -1;
    }

    nextIndex(current) {
        return current <= (this.getItemsLength(this.SLIDER) - 2) ? current +1 : 0;
    }

    /**
     * Sets the appropriate styling to slide to the requested slide
     */
    moveToIndex() {
        /* eslint-disable-next-line */
        this.SLIDER.querySelector(`[${this.INNER}]`).style.transform =
            `translateX(-${this.SLIDER.getAttribute(this.INDEX)}00%)`;
    }

    /**
     * Returns the current index of the slider component
     * @return {Int} The current index
     */
    getCurrentIndex() {
        return parseInt(this.SLIDER.getAttribute(this.INDEX), 10)
    }

    /**
     * Returns how many slides are present inside the the slider.
     * Starts at 1.
     * @return {Int} The amount of slides
     */
    getItemsLength() {
        return this.SLIDER.getElementsByClassName(this.CLASS).length
    }

    updateStepper() {
        this.StepperInstance.enableStepper(
            'dots',
            this.SLIDER.parentElement,
            this.getItemsLength(this.SLIDER),
            false
        );
    }

    enableStepper() {
        this.StepperInstance.enableStepper(
            'dots',
            this.SLIDER.parentElement,
            this.getItemsLength(this.SLIDER),
            true
        );
    }
}