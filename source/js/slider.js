/* eslint-disable no-unused-expressions */

import Steppers from "./steppers";

export default class Slider {
    constructor(slider) {
        this.SLIDER     = slider;
        this.SLIDE      = "js-slider-slide";
        this.ATTR       = "js-slider";
        this.BTN        = "js-slider-btn";
        this.INDEX      = "js-slider-index";
        this.INNER      = "js-slider-inner";
        this.AUTOSLIDE  = "js-slider__autoslide";
        this.STEP       = "data-step";
        this.PAUSEHOVER = false;

        this.StepperInstance = new Steppers;

        if (this.getItemsLength() > 1) {
            this.applySliders();
            this.enableStepper();
            this.handleSwipes();
            this.fixTabbing();

            if(this.SLIDER.hasAttribute(this.AUTOSLIDE)) {
                this.autoSlider();
                this.autoSliderHoverHandler();
            };
        } else {
            this.hideControls();
        }
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

    /**
     * Handles swipeEvents
     */
    handleSwipes() {
        this.SLIDER.addEventListener('swipeLeft', (e) => {
            let newIndex;
            newIndex = this.nextIndex(this.getCurrentIndex(this.SLIDER));
            this.updateSlider(newIndex);
        })

        this.SLIDER.addEventListener('swipeRight', (e) => {
            let newIndex;
            newIndex = this.prevIndex(this.getCurrentIndex(this.SLIDER));
            this.updateSlider(newIndex);
        })
    }

    updateSlider(newIndex) {
        this.SLIDER.setAttribute(this.INDEX, newIndex);
        this.SLIDER.setAttribute(this.STEP, newIndex);
        this.updateStepper();
        this.moveToIndex();
        this.fixTabbing() 
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
        , this.getAutoSliderDelay());
    }

    getAutoSliderDelay() {
        return this.SLIDER.getAttribute(this.AUTOSLIDE) * 1000;
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
        return this.SLIDER.querySelectorAll(`[${this.SLIDE}]`).length
    }

    updateStepper() {
        const stepper = this.SLIDER.querySelector('[js-slider__stepper]');
        const currentActive = stepper.querySelector(`.c-slider__dot--active`)
        
        if(currentActive) {
            currentActive.classList.remove('c-slider__dot--active');
        }

        const dot = stepper.querySelector(`[js-slider__stepper__dot="${this.getCurrentIndex() ? this.getCurrentIndex() : 0}"]`);
        dot.classList.add('c-slider__dot--active')

    }

    enableStepper() {
        const stepper = this.SLIDER.querySelector('[js-slider__stepper]');
        const dot = stepper.querySelector('.c-slider__dot');

        stepper.setAttribute('js-slider__stepper__current', 1)
        stepper.innerHTML = ""

        for (let index = 0; index < this.getItemsLength(); index++) {
            const clone = dot.cloneNode();
            clone.setAttribute('js-slider__stepper__dot', index)
            stepper.appendChild(clone)
        }

        this.addStepperEvent()

        this.updateStepper();
    }

    addStepperEvent() {
        const stepper = this.SLIDER.querySelector('[js-slider__stepper]');

        stepper.querySelectorAll(`[js-slider__stepper__dot]`).forEach((dot) => {
            dot.addEventListener('click', (e) => {
                this.updateSlider(e.target.getAttribute('js-slider__stepper__dot'))
            });
        })
    }

    /**
     * Removes controls
     * @return {Void}
     */
    hideControls() {
        const controls = this.SLIDER.querySelectorAll('.c-slider__button');

        this.SLIDER.querySelector('[js-slider__stepper]').remove();

        controls.forEach(control => {
            control.remove();
        });
    }

    /**
     * Adds the appropriate tabindex's to not breaking slider when tabbing through site
     * @return {Void}
     */
    fixTabbing() {
        const slideElements = [...this.SLIDER.querySelector(`[${this.INNER}]`).children];
        const tabTargets = [
            'button',
            'video',
            'input',
            'textarea'
        ];

        slideElements.forEach((elm) => {
            tabTargets.forEach((item) => {
                elm.querySelectorAll(item).forEach((tabElm) => {
                    tabElm.setAttribute('tabindex', '-1');
                })
            })
        })

        slideElements[this.getCurrentIndex()].querySelectorAll('[tabindex]').forEach(elm => {
            elm.removeAttribute("tabindex");
        })
    }
}