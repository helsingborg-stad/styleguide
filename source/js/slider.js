import Splide from '@splidejs/splide';
import VideoControls from './helpers/video';

const SLIDER_ITEM = 'c-slider__item';
const AUTOSLIDE = 'js-slider__autoslide';

export default class Slider {
    constructor(slider) {
        const autoPlay = parseInt(slider.getAttribute(AUTOSLIDE));
        this.sliderElement = slider;
        this.splide = new Splide(slider, {
            type: 'loop',
            autoWidth: true,
            focus: 'center',
            autoplay: !!autoPlay,
            interval: !!autoPlay ? autoPlay * 1000 : 5000,
            pagination: slider.classList.contains('c-slider--has-stepper'),
            classes: {
                arrows: 'c-slider__arrows',
                pagination: 'c-slider__steppers',
                page: 'c-slider__dot',
            },
        });

        if (this.sliderElement.querySelectorAll(`.${SLIDER_ITEM}`).length > 1) {
            this.splide.mount();
        } else {
            this.sliderElement.querySelector('.c-slider__arrows').remove();
        }

        this.addVideoControls();
    }

    addVideoControls() {
        this.sliderElement.querySelectorAll(`.${SLIDER_ITEM}`).forEach((slide) => {
            if (slide.querySelectorAll('video').length > 0) {
                const player = new VideoControls(slide);
            }
        });
    }
}
