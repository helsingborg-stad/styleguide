/**
 * Component Steppers
 */

class Steppers {

    constructor() {
        this.dataSteps = null;
        this.stepperLength = null;
        this.modalId = null;
        this.container = null;
    }

    /**
     * Enable and init Steppers
     */
    enableStepper(stepperType, container, stepperLength, generate) {
        const self = this;
        this.container = container;
        this.stepperLength = stepperLength;

        switch (stepperType) {
            case 'dots':
                setTimeout(function () {
                    self.dots(generate);
                }, 500);
                break;
        }
    }


    /**
     * Steppers - Dots
     * @param generate
     */
    dots(generate) {

        if (generate) {

            if (this.container.querySelector('.c-steppers--type-dots').childElementCount !== 0) {
                this.container.querySelector('.c-steppers__dot').innerHTML = "";
            } else {
                for (let int = 0; int < this.stepperLength; int++) {
                    this.container.querySelector('.c-steppers--type-dots').insertAdjacentHTML("beforeend",
                        '<i class="c-steppers__dot c-steppers__dot-' + int + '"></i>');
                }
            }
        }

        for (let removeDot of this.container.querySelectorAll('.c-steppers__dot')) {
            if (removeDot.classList.contains('c-steppers__dot-active')) {
                removeDot.classList.remove('c-steppers__dot-active');
            }
        }

        let activeStep = this.container.querySelector('[data-step]').getAttribute('data-step');
        this.container.querySelector('.c-steppers__dot-' + activeStep + '').classList.add('c-steppers__dot-active');
    }


}

export default Steppers;
