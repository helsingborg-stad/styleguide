/**
 * Component Steppers
 */
import Modal from "./modal";

class Steppers  {

    constructor() {

        this.dataSteps = document.querySelectorAll("[data-step]");
        this.modalId = null;
    }

    /**
     *
     */
    enableStepper(){


        let hasSteppers = document.querySelectorAll('.c-steppers- img');

        let imageDataSet = [];


        /*for(let img of imgSrc) {

            for (let int = 0; int < imageDataSet.length; int++) {
                console.log(imageDataSet);
                document.querySelector('.c-steppers--type-dots').insertAdjacentHTML("beforeend",
                    '<i class="c-steppers__dot c-steppers__dot-' + int + '"></i>');
            }
        }*/

    }


}
export default Steppers;
