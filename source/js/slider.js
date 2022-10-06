import Splide from '@splidejs/splide';
import VideoControls from './helpers/video';

const SLIDER_ITEM = 'c-slider__item';
const AUTOSLIDE = 'js-slider__autoslide';
const PAUSE_TOGGLE = 'c-slider__autoslide-toggle';
const IS_PAUSED = 'c-slider--is-paused';


export default class Slider {
    constructor(slider) {
        this.sliderElement = slider;
        this.autoslideToggleButton = this.sliderElement.querySelector(`.${PAUSE_TOGGLE}`);
        const autoPlay = parseInt(slider.getAttribute(AUTOSLIDE));
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        this.splide = new Splide(slider, {
            type: 'loop',
            autoWidth: slider.getAttribute('data-slides-per-page') == 1 ? true : false,
            perPage: slider.getAttribute('data-slides-per-page'),
            gap: 10,
            focus: slider.hasAttribute('data-slider-focus-center') ? 'center' : 1,
            autoplay: Boolean(autoPlay) && (!mediaQuery || !mediaQuery.matches),
            interval: Boolean(autoPlay) ? autoPlay * 1000 : 5000,
            pagination: slider.classList.contains('c-slider--has-stepper'),
            pauseOnHover: true,
            pauseOnFocus: true,
            lazyLoad: "nearby",
            classes: {
                arrows: 'c-slider__arrows',
                pagination: 'c-slider__steppers',
                page: 'c-slider__dot',
            },
            breakpoints: {
                992: {
                    perPage: 1,
                }
            }

        });

        if (this.sliderElement.querySelectorAll(`.${SLIDER_ITEM}`).length > 1) {
            this.splide.mount();
        } else {
            this.sliderElement.querySelector('.c-slider__arrows').remove();
        }

        if (this.sliderElement.classList.contains(IS_PAUSED)) {
            this.splide.Components.Autoplay.pause();
        }

        if (this.autoslideToggleButton) {
            this.autoslideToggleButton.addEventListener('click', this.autoslideToggle.bind(this));
        }

        this.addVideoControls();
    }

    autoslideToggle() {
        const { Autoplay } = this.splide.Components;
        if (this.sliderElement.classList.contains(IS_PAUSED)) {
            Autoplay.play();
            this.sliderElement.classList.remove(IS_PAUSED);
        } else {
            Autoplay.pause();
            this.sliderElement.classList.add(IS_PAUSED);
        }
    }

    addVideoControls() {
        this.sliderElement.querySelectorAll(`.${SLIDER_ITEM}`).forEach((slide) => {
            if (slide.querySelectorAll('video').length > 0) {
                const player = new VideoControls(slide);
            }
        });
    }
}
