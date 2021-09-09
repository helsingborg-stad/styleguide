export default class TestimonialCarousel {
    constructor (carousel) {
        this.CAROUSEL = carousel;
        this.ITEMS = carousel.querySelectorAll('.c-testimonial');

        this.init(this.ITEMS);
        this.addButtonListeners();
    }

    // eslint-disable-next-line class-methods-use-this
    init(items) {
        let first = true;

        this.CAROUSEL.setAttribute('js-testimonials-iteration', 0);

        items.forEach((item) => {
            if(first) {
                first = false;
                item.classList.add('c-testimonial--is-visible');
            } else {
                item.classList.add('c-testimonial--is-hidden');
            }
        })
    }

    addButtonListeners() {
        const backButton = this.CAROUSEL.parentElement.querySelector('[js-testimonials__back]');
        const forwardButton = this.CAROUSEL.parentElement.querySelector('[js-testimonials__forward]');

        backButton.addEventListener('click', () => {
            const current = parseInt(this.CAROUSEL.getAttribute('js-testimonials-iteration'), 10);
            const next = current === 0 ? this.ITEMS.length - 1 : current - 1;

            this.CAROUSEL.setAttribute('js-testimonials-iteration', next);
            this.updateCarousel()

        })

        forwardButton.addEventListener('click', () => {
            const current = parseInt(this.CAROUSEL.getAttribute('js-testimonials-iteration'), 10);
            const next = current === this.ITEMS.length - 1 ? 0 : current +1;

            this.CAROUSEL.setAttribute('js-testimonials-iteration', next);
            this.updateCarousel()
        })
    }

    updateCarousel() {
        const nextInt = parseInt(this.CAROUSEL.getAttribute('js-testimonials-iteration'), 10);
        const next = this.ITEMS[nextInt];
        const current = this.CAROUSEL.querySelector('.c-testimonial--is-visible');

        current.classList.remove('c-testimonial--is-visible');
        current.classList.add('c-testimonial--is-hidden');

        next.classList.add('c-testimonial--is-visible');
        next.classList.remove('c-testimonial--is-hidden');

        setTimeout(() => {
            this.CAROUSEL.style.transform = `translateX(-${nextInt}00%)`;
        }, 800/2)
    }
}