import Splide, { Options } from '@splidejs/splide';
import VideoControls from './helpers/video';

const SLIDER_ITEM = 'c-slider__item';
const AUTOSLIDE = 'data-js-slider__autoslide';
const PAUSE_TOGGLE = 'c-slider__autoslide-toggle';
const IS_PAUSED = 'c-slider--is-paused';


export default class Slider {
    sliderElement: Element;
    autoslideToggleButton: any;
    splide: Splide;
    sliderAttributes: Options;

    constructor(slider: Element) {
        this.sliderElement = slider;
        this.autoslideToggleButton = this.sliderElement.querySelector(`.${PAUSE_TOGGLE}`);
        const autoPlay = parseInt(slider.getAttribute(AUTOSLIDE) ?? '0');
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const ariaLabels = slider.hasAttribute('data-aria-labels') ? JSON.parse(slider.getAttribute('data-aria-labels') as string) : false;
        this.sliderAttributes = this.getAttributes();

        const buttonContainer = document.querySelector(`#${slider.getAttribute('data-js-slider-buttons')}`);

        if (buttonContainer) {
            this.setupClickNavigation(buttonContainer);
        } else {
            console.warn('No button container found for slider: ' + slider);
        }

        this.splide = new Splide(slider as HTMLElement, {
            type: this.sliderAttributes.sliderType,
            start: 0,
            autoWidth: this.sliderAttributes.perPage == 1 ? true : false,
            perPage: this.sliderAttributes.perPage,
            perMove: this.sliderAttributes.perPage,
            focus: slider.hasAttribute('data-slider-focus-center') ? 'center' : 0,
            gap: this.sliderAttributes.gap,
            padding: this.sliderAttributes.padding,
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
            arrows: false,

            i18n: {
                prev: ariaLabels ? ariaLabels.prev : 'Previous slider item',
                next: ariaLabels ? ariaLabels.next : 'Next slider item',
                first: ariaLabels ? ariaLabels.first : 'First slider item',
                last: ariaLabels ? ariaLabels.last : 'Last slider item',
                slideX: ariaLabels ? ariaLabels.slideX : 'Go to slide %s',
            },
            breakpoints: {
                896: {
                    perPage: 1,
                    perMove: 1,
                    padding: 0,
                }
            }
        });

        this.splide.on('pagination:mounted', (data) => {
            data.items.forEach((item, index) => {
                const span = document.createElement('span');

                span.className = item.button.className;
                span.classList.add('c-slider__dot');
                span.textContent = item.button.textContent;

                item.button.replaceWith(span);
                item.button = span as HTMLButtonElement;
            });
        });

        if (this.sliderElement.querySelectorAll(`.${SLIDER_ITEM}`).length > 1) {
            this.splide.mount();

        } else {
            this.sliderElement.querySelector('.c-slider__arrows')?.remove();
        }

        if (this.sliderElement.classList.contains(IS_PAUSED)) {
            this.splide.Components.Autoplay.pause();
        }

        if (this.autoslideToggleButton) {
            this.autoslideToggleButton.addEventListener('click', this.autoslideToggle.bind(this));
        }

        slider.hasAttribute('data-observe-resizes') && this.observe(slider);
        this.addVideoControls();
    }

    observe(slider: Element) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (!slider.classList.contains('c-slider--size-md') && this.splide.options.perPage !== 1) {
                        this.splide.options.perPage = 1;
                        this.splide.options.perMove = 1;
                        handleObserver();
                    }

                    if (slider.classList.contains('c-slider--size-lg') && !(this.splide.options.perPage === 2 || this.splide.options.perPage === 3)) {
                        this.splide.options.perPage = this.sliderAttributes.perPage;
                        this.splide.options.perMove = this.sliderAttributes.perPage;
                        handleObserver();
                    }
                }
            });
        });

        const handleObserver = () => {
            observer.disconnect();
            this.splide.refresh();
            observer.observe(slider, { subtree: false, attributes: true, attributeFilter: ['class'] });
        }

        observer.observe(slider, { subtree: false, attributes: true, attributeFilter: ['class'] });
    }

    getAttributes(): Options {
        let padding = parseInt(this.sliderElement.getAttribute('data-slider-padding') || '0', 10);
        const gap = parseInt(this.sliderElement.getAttribute('data-slider-gap') || '2', 10);
        const slidesPerPage = parseInt(this.sliderElement.getAttribute('data-slides-per-page') || '1', 10);
        const sliderType = this.sliderElement.hasAttribute('data-slider-loop') && !this.sliderElement.querySelector('video') ? 'loop' : 'slide';

        return { gap: gap * 8, padding: padding * 8, perPage: slidesPerPage, sliderType: sliderType };
    }

    private setupClickNavigation(buttonContainer: Element) {
        buttonContainer.querySelector('[data-js-slider-prev]')?.addEventListener('click', () => {
            this.splide.go('<');
        });

        buttonContainer.querySelector('[data-js-slider-next]')?.addEventListener('click', () => {
            this.splide.go('>');
        })
    }


    autoslideToggle() {
        const { Autoplay } = this.splide.Components;
        const videos = this.sliderElement.querySelectorAll('video');
        if (this.sliderElement.classList.contains(IS_PAUSED)) {
            if (videos && videos.length > 0) {
                videos.forEach(video => {
                    video.play();
                });
            }
            Autoplay.play();
            this.sliderElement.classList.remove(IS_PAUSED);
        } else {
            if (videos && videos.length > 0) {
                videos.forEach(video => {
                    video.pause();
                });
            }
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

export function initializeSlider() {
    const sliders = document.querySelectorAll('.c-slider');
    if (sliders) {
        sliders.forEach((slider) => {
            const SliderInstance = new Slider(slider);
        });
    }
}
