export default class TestimonialCarousel {
    constructor (carousel) {
        this.CAROUSEL = carousel;
        this.ITEMS = carousel.querySelectorAll('.c-testimonial');
        this.IS_LARGE_SCREEN = this.isLargeScreen();

        this.init(this.ITEMS);
        this.windowResize();
        this.addButtonListeners();
    }

    // eslint-disable-next-line class-methods-use-this
    init() {
        // If desktop show two first card, else just one
        const KEYS = Array.from(this.ITEMS.keys());
        const show = this.IS_LARGE_SCREEN ? KEYS.slice(0,2) : KEYS.slice(0,1);
        const hide = this.IS_LARGE_SCREEN ? KEYS.slice(2) : KEYS.slice(1);
        const buttons = this.CAROUSEL.parentElement.querySelectorAll('.c-testimonials__button');

        if (hide.length === 0) {
            buttons.forEach((button) => {
                button.classList.add('u-display--none');
            });
        } else {
            buttons.forEach((button) => {
                button.classList.remove('u-display--none');
            });
        }

        this.CAROUSEL.setAttribute('js-testimonials-iteration', 0);

        this.toggleVisible(show);
        this.toggleHidden(hide);
    }

    addButtonListeners() {
        const backButton = this.CAROUSEL.parentElement.querySelector('[js-testimonials__back]');
        const forwardButton = this.CAROUSEL.parentElement.querySelector('[js-testimonials__forward]');

        backButton.addEventListener('click', () => {
            const current = parseInt(this.CAROUSEL.getAttribute('js-testimonials-iteration'), 10);
            const amount = this.IS_LARGE_SCREEN ? this.ITEMS.length /2 : this.ITEMS.length; // Desktop has half the slides
            const next = current === 0 ? amount -1 : current -1;

            this.CAROUSEL.setAttribute('js-testimonials-iteration', next);
            this.updateCarousel(current)
        })

        forwardButton.addEventListener('click', () => {
            const current = parseInt(this.CAROUSEL.getAttribute('js-testimonials-iteration'), 10);
            const amount = this.IS_LARGE_SCREEN ? this.ITEMS.length /2 : this.ITEMS.length; // Desktop has half amount of slides as it shows two slides at a time
            const next = current === amount -1 ? 0 : current +1;

            this.CAROUSEL.setAttribute('js-testimonials-iteration', next);
            this.updateCarousel(current)
        })
    }

    updateCarousel(currentIndex) {
        const nextInt = parseInt(this.CAROUSEL.getAttribute('js-testimonials-iteration'), 10);

        if(!this.IS_LARGE_SCREEN) {
            // setTimeout(() => {
                this.toggleVisible([nextInt]);
                this.toggleHidden([currentIndex]);
            // }, 800/2)
        } else {
            // setTimeout(() => {
                const sibling = nextInt * 2;
                const currentSibling = currentIndex * 2;

                this.toggleVisible([nextInt *2, sibling +1]);
                this.toggleHidden([currentIndex*2, currentSibling +1]);
            // }, 800/2)
        }
    }

    toggleVisible(list) {
        list.forEach((i) => {
            if(this.ITEMS[i] !== undefined) {
                this.ITEMS[i].classList.add('c-testimonial--is-visible');
                this.ITEMS[i].classList.remove('c-testimonial--is-hidden');
            }
        })
    }

    toggleHidden(list) {
        list.forEach((i) => {
            if(this.ITEMS[i] !== undefined) {
                this.ITEMS[i].classList.add('c-testimonial--is-hidden');
                this.ITEMS[i].classList.remove('c-testimonial--is-visible');
            }
        })
    }

    windowResize() {
        window.addEventListener('resize', (e) => {
            if(this.isLargeScreen() !== this.IS_LARGE_SCREEN) {
                this.IS_LARGE_SCREEN = this.isLargeScreen();
                this.init(this.ITEMS)
            }
        });
    }

    // eslint-disable-next-line class-methods-use-this
    isLargeScreen() {
        const body = document.querySelector('body');
        const width = window.innerWidth / parseFloat(getComputedStyle(body)['font-size']);
          
        return width >= 78; // 78em is the breakpoint for large screen
    }
}
