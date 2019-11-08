/**
 * Component Steppers
 */

class Steppers  {

    constructor() {

        this.dataSteps = document.querySelectorAll("[data-step]");
        this.stepperLength = null;
        this.modalId = null;
        this.container = null;
    }

    /**
     * Enable and init Steppers
     */
    enableStepper(stepperType, container, stepperLength){
        const self = this;
        this.container = container;
        this.stepperLength = stepperLength;

        switch(stepperType){
            case 'dots':
                self.dots(true);
                break;
        }
    }

    /**
     * Steppers - Dots
     * @param generate
     */
    dots(generate){

        if (generate) {
            this.container.querySelector('.c-steppers').innerHTML = '';
            for (let int = 0; int < this.stepperLength ; int++) {
                this.container.querySelector('.c-steppers--type-dots').insertAdjacentHTML("beforeend",
                    '<i class="c-steppers__dot c-steppers__dot-' + int + '"></i>');
            }
        }

        // Position
        let activeStep = this.container.querySelector('[data-step]').getAttribute('data-step');

        // Removing active position
        for (const dot of this.container.querySelectorAll('.c-steppers__dot')) {
            dot.classList.remove('c-steppers__dot-active');
        }

        // Set active position
        this.container.querySelector('.c-steppers__dot-' + activeStep + '').classList.add('c-steppers__dot-active');
    }


}
export default Steppers;
