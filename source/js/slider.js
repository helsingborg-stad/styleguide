/* eslint-disable no-unused-expressions */

import Steppers from "./steppers";

export default class Slider {
    constructor() {
        this.CLASS = "c-segment";
        this.ATTR = "js-slider";
        this.BTN = "js-slider-btn";
        this.INDEX = "js-slider-index";
        this.INNER = "js-slider-inner";
        this.STEP = "data-step";
        this.StepperInstance = new Steppers;
    }

    /**
     * Finds all slides and attaches event listeners.
     * @return {void}
     */
    applySliders() {
        const sliders = document.querySelectorAll(`[${this.ATTR}]`);

        sliders.forEach((slider) => {
            this.StepperInstance.enableStepper('dots', slider.parentElement, this.getItemsLength(slider), true);

            slider.querySelectorAll(`[${this.BTN}]`).forEach((button) => {
                button.addEventListener('click', (e) => {
                    this.clickedBtn(e, slider);
                });
            })
        })
    }

    /**
     * Handles click on either next och previous button
     * @param {Object} e The click event
     * @param {Object} elm The slider element
     */
    clickedBtn(e, elm) {  
        let newIndex;

        if (e.target.closest("button").getAttribute(this.BTN) === 'prev') {
            newIndex = this.getCurrentIndex(elm) === 0 ? 
                this.getItemsLength(elm) -1 :
                    this.getCurrentIndex(elm) -1;

        } else if (e.target.closest("button").getAttribute(this.BTN) === 'next') {
            newIndex = this.getCurrentIndex(elm) <= (this.getItemsLength(elm) - 2) ?
                this.getCurrentIndex(elm) +1 :
                    0;
        }

        elm.setAttribute(this.INDEX, newIndex);
        elm.setAttribute(this.STEP, newIndex);
        this.StepperInstance.enableStepper(
            'dots',
            elm.parentElement,
            this.getItemsLength(elm),
            false
        );
        this.moveToIndex(elm);
    }

    /**
     * Sets the appropriate styling to slide to the requested slide
     * @param {Object} elm The slider element
     */
    moveToIndex(elm) {
        /* eslint-disable-next-line */
        elm.querySelector(`[${this.INNER}]`).style.transform =
            `translateX(-${elm.getAttribute(this.INDEX)}00%)`;
    }

    /**
     * Returns the current index of the slider component
     * @param {Object} elm The slider element
     * @return {Int} The current index
     */
    getCurrentIndex(elm) {
        return parseInt(elm.getAttribute(this.INDEX), 10)
    }

    /**
     * Returns how many slides are present inside the the slider.
     * Starts at 1.
     * @param {Object} elm 
     * @return {Int} The amount of slides
     */
    getItemsLength(elm) {
        return elm.getElementsByClassName(this.CLASS).length
    }
}