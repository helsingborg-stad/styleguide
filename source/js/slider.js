import Splide from '@splidejs/splide';
import VideoControls from './helpers/video';

const SLIDER_ITEM = 'c-slider__item';
const ATTR = 'js-slider';
const BTN = 'js-slider-btn';
const INDEX = 'js-slider-index';
const INNER = 'js-slider-inner';
const AUTOSLIDE = 'js-slider__autoslide';
const REPEAT = 'js-slider-repeat';

export default class Slider {
    constructor(slider) {
        this.sliderElement = slider;
        this.splide = new Splide(slider, {
            type: 'loop',
            autoWidth: true,
            focus: 'center',
            pagination: slider.classList.contains('c-slider--has-stepper'),
            classes: {
                arrows: 'c-slider__arrows',
                pagination: 'c-slider__steppers',
                page: 'c-slider__dot'
            }
        });
        this.PAUSEHOVER = false;

        if (this.sliderElement.querySelectorAll(`.${SLIDER_ITEM}`).length > 1) {
            this.splide.mount();
        }

        this.addVideoControls()
    }

    addVideoControls() {
        this.sliderElement.querySelectorAll(`.${SLIDER_ITEM}`).forEach((slide) => {
            if(slide.querySelectorAll('video').length > 0) {
                const player = new VideoControls(slide);
            }
        })
    }
}
