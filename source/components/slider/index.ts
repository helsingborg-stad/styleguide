import VideoControls from '../../js/helpers/video';

const AUTOSLIDE = 'data-js-slider__autoslide';
const PAUSE_TOGGLE = 'c-slider__autoslide-toggle';
const IS_PAUSED = 'c-slider--is-paused';
const SLIDER_ITEM = 'c-slider__item';
const MOBILE_BREAKPOINT = 896;

export const SLIDER_READY_EVENT = 'slider:ready';

type SliderReadyEventDetail = {
    sliderElement: Element;
    slider: Slider;
};

export default class Slider {
    private readonly sliderElement: HTMLElement;
    private readonly track: HTMLElement | null;
    private readonly slides: HTMLElement[];
    private readonly prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    private readonly autoplayDelay: number;
    private readonly resizeObserver: ResizeObserver;
    private autoplayTimer: number | undefined;
    private scrollAnimationFrame: number | undefined;
    private slidesPerPage = 1;

    constructor(slider: Element) {
        this.sliderElement = slider as HTMLElement;
        this.track = this.sliderElement.querySelector<HTMLElement>('[data-js-slider-track]');
        this.slides = Array.from(this.sliderElement.querySelectorAll<HTMLElement>(`[data-js-slider-slide], .${SLIDER_ITEM}`));
        this.autoplayDelay = this.getAutoplayDelay();
        this.resizeObserver = new ResizeObserver(() => this.updateLayout());

        this.setTrackLabel();
        this.lazyloadVideo();
        this.addVideoControls();

        if (!this.track || this.slides.length < 2) {
            this.sliderElement.querySelector('.c-slider__arrows')?.remove();
            this.dispatchReadyEvent();
            return;
        }

        this.updateLayout();
        this.setupNavigation();
        this.setupAutoplay();
        this.resizeObserver.observe(this.sliderElement);
        this.dispatchReadyEvent();
    }

    private getAutoplayDelay(): number {
        const delay = Number.parseInt(this.sliderElement.getAttribute(AUTOSLIDE) ?? '0', 10);
        return Number.isFinite(delay) && delay > 0 ? delay * 1000 : 0;
    }

    private getConfiguredSlidesPerPage(): number {
        const value = Number.parseInt(this.sliderElement.getAttribute('data-slides-per-page') ?? '1', 10);
        return Number.isFinite(value) && value > 0 ? value : 1;
    }

    private getConfiguredPadding(): number {
        const value = Number.parseInt(this.sliderElement.getAttribute('data-slider-padding') ?? '0', 10);
        return Number.isFinite(value) && value > 0 ? value * 8 : 0;
    }

    private getConfiguredGap(): number {
        const value = Number.parseInt(this.sliderElement.getAttribute('data-slider-gap') ?? '2', 10);
        return Number.isFinite(value) && value >= 0 ? value * 8 : 16;
    }

    private updateLayout(): void {
        if (!this.track) return;

        this.slidesPerPage = window.innerWidth < MOBILE_BREAKPOINT ? 1 : Math.min(this.getConfiguredSlidesPerPage(), this.slides.length);
        this.sliderElement.style.setProperty('--c-slider--slides-per-page', String(this.slidesPerPage));
        this.sliderElement.style.setProperty('--c-slider--gap', `${this.getConfiguredGap()}px`);
        this.sliderElement.style.setProperty('--c-slider--padding', `${this.getConfiguredPadding()}px`);
        this.updateSlideMotionFromScroll();
        this.updateNavigation();
    }

    private setupNavigation(): void {
        const buttons = this.getNavigationButtons();
        buttons.previous?.addEventListener('click', () => this.goBy(-this.slidesPerPage, true));
        buttons.next?.addEventListener('click', () => this.goBy(this.slidesPerPage, true));
        this.track?.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.track?.addEventListener('keydown', (event) => this.handleKeydown(event));
    }

    private handleScroll(): void {
        if (this.scrollAnimationFrame !== undefined) return;

        this.scrollAnimationFrame = window.requestAnimationFrame(() => {
            this.updateSlideMotionFromScroll();
            this.updateNavigation();
            this.scrollAnimationFrame = undefined;
        });
    }

    /**
     * Mirrors Minimal Slider's scroll-driven fade: a slide's opacity reflects
     * the proportion currently visible in the viewport.
     */
    private updateSlideMotionFromScroll(): void {
        if (!this.track || this.prefersReducedMotion.matches) {
            this.slides.forEach((slide) => slide.style.removeProperty('--c-slider--slide-progress'));
            return;
        }

        const viewportLeft = this.track.scrollLeft;
        const viewportRight = viewportLeft + this.track.clientWidth;

        this.slides.forEach((slide) => {
            const slideLeft = slide.offsetLeft;
            const slideWidth = Math.max(1, slide.offsetWidth);
            const slideRight = slideLeft + slideWidth;
            const visibleWidth = Math.max(0, Math.min(slideRight, viewportRight) - Math.max(slideLeft, viewportLeft));

            slide.style.setProperty('--c-slider--slide-progress', (visibleWidth / slideWidth).toFixed(3));
        });
    }

    private handleKeydown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.goBy(-this.slidesPerPage, true);
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.goBy(this.slidesPerPage, true);
                break;
            case 'Home':
                event.preventDefault();
                this.goTo(0, true);
                break;
            case 'End':
                event.preventDefault();
                this.goTo(this.slides.length - this.slidesPerPage, true);
                break;
        }
    }

    private goBy(offset: number, announce = false): void {
        this.goTo(this.getCurrentIndex() + offset, announce);
    }

    private goTo(index: number, announce = false): void {
        const targetIndex = Math.max(0, Math.min(index, this.slides.length - this.slidesPerPage));
        const target = this.slides[targetIndex];
        if (announce) this.announceSlide(targetIndex);
        target?.scrollIntoView({
            behavior: this.prefersReducedMotion.matches ? 'auto' : 'smooth',
            block: 'nearest',
            inline: 'start',
        });
    }

    private getCurrentIndex(): number {
        if (!this.track) return 0;

        return this.slides.reduce((currentIndex, slide, index) => {
            const currentDistance = Math.abs(this.slides[currentIndex].offsetLeft - this.track!.scrollLeft);
            const nextDistance = Math.abs(slide.offsetLeft - this.track!.scrollLeft);
            return nextDistance < currentDistance ? index : currentIndex;
        }, 0);
    }

    private getNavigationButtons(): { previous: HTMLButtonElement | null; next: HTMLButtonElement | null } {
        const selector = this.sliderElement.getAttribute('data-js-slider-buttons');
        const container = selector ? document.getElementById(selector) : this.sliderElement;
        return {
            previous: container?.querySelector<HTMLButtonElement>('[data-js-slider-prev]') ?? null,
            next: container?.querySelector<HTMLButtonElement>('[data-js-slider-next]') ?? null,
        };
    }

    private updateNavigation(): void {
        if (!this.track) return;

        const { previous, next } = this.getNavigationButtons();
        const atStart = this.track.scrollLeft <= 1;
        const atEnd = this.track.scrollLeft >= this.track.scrollWidth - this.track.clientWidth - 1;
        this.setButtonState(previous, atStart);
        this.setButtonState(next, atEnd);

        const currentSlide = this.getCurrentIndex() + 1;
        this.slides.forEach((slide, index) => slide.setAttribute('aria-label', `${index + 1} of ${this.slides.length}`));
        this.track.setAttribute('aria-label', `Slider, slide ${currentSlide} of ${this.slides.length}`);
    }

    private announceSlide(startIndex: number): void {
        const status = this.sliderElement.querySelector<HTMLElement>('[data-js-slider-status]');
        if (!status) return;

        const endIndex = Math.min(this.slides.length - 1, startIndex + this.slidesPerPage - 1);
        status.textContent = startIndex === endIndex
            ? `Slide ${startIndex + 1} of ${this.slides.length}`
            : `Slides ${startIndex + 1} to ${endIndex + 1} of ${this.slides.length}`;
    }

    private setButtonState(button: HTMLButtonElement | null, disabled: boolean): void {
        if (!button) return;
        button.disabled = disabled;
        button.setAttribute('aria-disabled', String(disabled));
    }

    private setupAutoplay(): void {
        const toggle = this.sliderElement.querySelector<HTMLElement>(`.${PAUSE_TOGGLE}`);
        if (!this.autoplayDelay || !toggle) return;

        toggle.setAttribute('aria-label', 'Pause slider');
        toggle.addEventListener('click', () => this.toggleAutoplay());
        this.sliderElement.addEventListener('mouseenter', () => this.stopAutoplay());
        this.sliderElement.addEventListener('mouseleave', () => this.startAutoplay());
        this.sliderElement.addEventListener('focusin', () => this.stopAutoplay());
        this.sliderElement.addEventListener('focusout', () => this.startAutoplay());

        if (!this.prefersReducedMotion.matches && !this.sliderElement.classList.contains(IS_PAUSED)) {
            this.startAutoplay();
        }
    }

    private toggleAutoplay(): void {
        const paused = !this.sliderElement.classList.contains(IS_PAUSED);
        this.sliderElement.classList.toggle(IS_PAUSED, paused);
        const toggle = this.sliderElement.querySelector(`.${PAUSE_TOGGLE}`);
        toggle?.setAttribute('aria-label', paused ? 'Play slider' : 'Pause slider');
        this.announceAutoplay(paused);
        this.sliderElement.querySelectorAll<HTMLVideoElement>('video').forEach((video) => paused ? video.pause() : video.play());
        paused ? this.stopAutoplay() : this.startAutoplay();
    }

    private announceAutoplay(paused: boolean): void {
        const status = this.sliderElement.querySelector<HTMLElement>('[data-js-slider-status]');
        if (status) status.textContent = paused ? 'Autoplay paused' : 'Autoplay playing';
    }

    private startAutoplay(): void {
        if (!this.autoplayDelay || this.prefersReducedMotion.matches || this.sliderElement.classList.contains(IS_PAUSED) || this.autoplayTimer) return;
        this.autoplayTimer = window.setInterval(() => {
            const atEnd = this.getCurrentIndex() >= this.slides.length - this.slidesPerPage;
            this.goTo(atEnd ? 0 : this.getCurrentIndex() + this.slidesPerPage);
        }, this.autoplayDelay);
    }

    private stopAutoplay(): void {
        if (this.autoplayTimer === undefined) return;
        window.clearInterval(this.autoplayTimer);
        this.autoplayTimer = undefined;
    }

    private lazyloadVideo(): void {
        this.slides.forEach((slide) => {
            const sourceUrl = slide.getAttribute('data-js-slider-video');
            const source = slide.querySelector<HTMLSourceElement>('video source');
            if (sourceUrl && source) {
                source.src = sourceUrl;
                source.closest('video')?.load();
            }
        });
    }

    private addVideoControls(): void {
        this.slides.forEach((slide) => {
            if (slide.querySelector('video')) new VideoControls(slide);
        });
    }

    private setTrackLabel(): void {
        this.track?.setAttribute('aria-label', this.sliderElement.getAttribute('aria-label') ?? 'Slider');
    }

    private dispatchReadyEvent(): void {
        document.dispatchEvent(new CustomEvent<SliderReadyEventDetail>(SLIDER_READY_EVENT, {
            bubbles: true,
            detail: { sliderElement: this.sliderElement, slider: this },
        }));
    }
}

export function init(): void {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.c-slider').forEach((slider) => new Slider(slider));
    });
}
