import Splide from '@splidejs/splide';

const SLIDE = 'js-slider-slide';
const ATTR = 'js-slider';
const BTN = 'js-slider-btn';
const INDEX = 'js-slider-index';
const INNER = 'js-slider-inner';
const AUTOSLIDE = 'js-slider__autoslide';
const REPEAT = 'js-slider-repeat';
const STEP = 'data-step';

export default class Slider {
    constructor(slider) {
        this.sliderElement = slider;
        const gap = 2; // TODO: Move
        this.splide = new Splide(slider, {
            type: 'loop',
            gap: `${gap}rem`,
            autoWidth: true,
            focus: 'center',
            classes: {
                arrows: 'c-slider__arrows',
                pagination: 'c-slider__steppers',
                page: 'c-slider__dot'
            }
        });
        this.PAUSEHOVER = false;

        this.splide.mount();
    }
}
