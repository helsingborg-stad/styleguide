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
        const ariaLabels = slider.hasAttribute('data-aria-labels') ? JSON.parse(slider.getAttribute('data-aria-labels')) : false;
        const sliderAttributes = this.getAttributes();

        let hasCustomButtons = false;
        
        if(slider.hasAttribute('data-custom-buttons'))  {
            hasCustomButtons = true;
            const buttonContainer = document.querySelector('#' + slider.getAttribute('data-custom-buttons'));
            const prev = buttonContainer.querySelector('.splide__arrow--prev');
            const next = buttonContainer.querySelector('.splide__arrow--next');

            prev.addEventListener('click', () => {
                this.splide.go('<');
            });

            next.addEventListener('click', () => {
                this.splide.go('>');
            })
        }

        this.splide = new Splide(slider, {
            type: slider.hasAttribute('data-slider-loop') ? 'loop' : 'slide',
            start: sliderAttributes.start,
            clone: slider.hasAttribute('data-slider-loop') ? true : false,
            autoWidth: sliderAttributes.perPage == 1 ? true : false,
            perPage: sliderAttributes.perPage,
            perMove: sliderAttributes.perPage,
            focus: slider.hasAttribute('data-slider-focus-center') ? 'center' : 0,
            gap: sliderAttributes.gap,
            padding: sliderAttributes.padding,
            autoplay: Boolean(autoPlay) && (!mediaQuery || !mediaQuery.matches),
            interval: Boolean(autoPlay) ? autoPlay * 1000 : 5000,
            pagination: slider.classList.contains('c-slider--has-stepper'),
            pauseOnHover: true,
            pauseOnFocus: true,
            lazyLoad: "nearby",
            slideFocus: false,
            classes: {
                arrows: 'c-slider__arrows',
                pagination: 'c-slider__steppers',
                page: 'c-slider__dot',
            },
            arrows: !hasCustomButtons,
    
            i18n: {
                prev: ariaLabels ?  ariaLabels.prev : 'Previous slider item',
                next: ariaLabels ? ariaLabels.next : 'Next slider item',
                first: ariaLabels ? ariaLabels.first : 'First slider item',
                last: ariaLabels ? ariaLabels.last : 'Last slider item',
                slideX: ariaLabels ? ariaLabels.slideX : 'Go to slide %s',
            },
            breakpoints: {
                896: {
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

    getAttributes() {
        let padding = this.sliderElement.hasAttribute('data-show-adjacent-slides') ? parseInt(this.sliderElement.getAttribute('data-show-adjacent-slides')) : 1;
        let gap = this.sliderElement.hasAttribute('data-slider-gap') ? parseInt(this.sliderElement.getAttribute('data-slider-gap')) : 48;
        let start = this.sliderElement.hasAttribute('data-slider-loop') ? 1 : 0;
        let slidesPerPage = this.sliderElement.hasAttribute('data-slides-per-page') ? this.sliderElement.getAttribute('data-slides-per-page') : 1;

        if (padding && slidesPerPage == 1) {
            return {'gap': gap/2, 'padding': '5rem', 'start': 1, 'perPage': slidesPerPage};
        }
        
        return { 'gap': gap, 'padding': 0, 'start': start, 'perPage': slidesPerPage }; 
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
