/**
 * Component Gallery
 */
import Image from "../image/image";

class Gallery {

    /**
     * @param {string|null} modalId
     */
    constructor(modalId = null) {
        this.imageDataSet = [];
        this.imageData = null;
        this.modalImg = '';
        this.modalId = modalId;
        this.container = null;
        this.isEnabled = false;
        this.imageTransitionTimeoutId = null;
        this.imageTransitionAnimationFrameId = null;
        this.imageTransitionId = 0;

        this.Image = new Image();

        this.handleContainerClickBound = (event) => this.handleContainerClick(event);
        this.handleKeyboardNavigationBound = (event) => this.handleKeyboardNavigation(event);
    }

    /**
     * Init Modal Image in Gallery
     * @param modalId
     * @param modalImage
     */
    initImage(modalId, modalImage) {
        this.modalId = modalId;
        this.modalImg = modalImage;
        this.enableGallery(modalId);

        if (!this.container) {
            return;
        }

        this.imageDataSet = this.collectImageDataSet(this.modalId);
        this.imageData = this.getImageDataByUrl(this.modalImg) || this.imageDataSet[0] || null;

        if (!this.imageData) {
            return;
        }

        this.createImg(this.container, this.imageData);
    }

    /**
     * Collect all image metadata connected to a specific modal id.
     * @param {string} modalId
     * @returns {Array<{image: string, imageStep: string, imageCaption: string}>}
     */
    collectImageDataSet(modalId) {
        const imageDataSet = [];
        const imageTriggers = document.querySelectorAll(`[data-open="${modalId}"][data-large-img]`);

        for (const trigger of imageTriggers) {
            const image = trigger.getAttribute('data-large-img');
            const imageStep = trigger.getAttribute('data-stepping') || String(imageDataSet.length);
            const imageCaption = trigger.getAttribute('data-caption') || '';

            if (image) {
                imageDataSet.push({
                    image,
                    imageStep,
                    imageCaption
                });
            }
        }

        return imageDataSet;
    }

    /**
     * Get image metadata by full image url.
     * @param {string} imageUrl
     * @returns {{image: string, imageStep: string, imageCaption: string}|null}
     */
    getImageDataByUrl(imageUrl) {
        for (const imageData of this.imageDataSet) {
            if (imageData.image === imageUrl) {
                return imageData;
            }
        }

        return null;
    }

    /**
     * Enable Gallery
     * Next, Previous image by click or keys
     */
    enableGallery(modalId = this.modalId) {
        if (modalId) {
            this.modalId = modalId;
        }

        if (!this.modalId) {
            return;
        }

        this.container = document.getElementById(this.modalId);

        if (!this.container) {
            return;
        }

        if (!this.isEnabled) {
            this.container.addEventListener('click', this.handleContainerClickBound);
            document.addEventListener('keyup', this.handleKeyboardNavigationBound);
            this.isEnabled = true;
        }
    }

    /**
     * Next & previous Image
     * @param string nav
     * @returns {*}
     */
    cycleImage(nav = 'prev') {
        if (!this.container || !this.imageData || this.imageDataSet.length === 0) {
            return null;
        }

        const currentIndex = this.getCurrentImageIndex();
        const nextIndex = nav === 'next'
            ? (currentIndex + 1) % this.imageDataSet.length
            : (currentIndex - 1 + this.imageDataSet.length) % this.imageDataSet.length;

        const nextImageData = this.imageDataSet[nextIndex];
        this.createImg(this.container, nextImageData);

        return nextImageData;
    }

    /**
     * Create Image in modal
     * @param containerId
     * @param imgSrc
     */
    createImg(containerId, imgSrc) {
        const container = containerId?.querySelector('.c-image');
        const containerModalContent = container;
        this.imageData = imgSrc;

        if (!container || !containerModalContent || !imgSrc) {
            return;
        }

        const imageElement = container.querySelector('.c-image__image');

        if (!imageElement) {
            container.innerHTML = '';
            container.classList.remove('c-image--is-placeholder');

            this.Image.initImage({
                'elementContainer': container,
                'attrList': {
                    'src': imgSrc.image,
                    'data-step': imgSrc.imageStep,
                    'data-caption': imgSrc.imageCaption
                },
                'classList': ['c-image__image', 'c-image__image--is-visible']
            });
        } else {
            this.transitionImage(imageElement, imgSrc, () => {
                this.imageCaption(containerModalContent, imgSrc);
                this.updateImageCounter(this.container);
            });

            return;
        }

        this.imageCaption(containerModalContent, imgSrc);
        this.updateImageCounter(this.container);
    }

    /**
     * Animate image replacement with fade-out and fade-in.
     * @param {HTMLImageElement} imageElement
     * @param {{image: string, imageStep: string, imageCaption: string}} imgSrc
     * @param {Function|null} onImageChanged
     */
    transitionImage(imageElement, imgSrc, onImageChanged = null) {
        if (!(imageElement instanceof HTMLImageElement)) {
            return;
        }

        this.imageTransitionId += 1;
        const currentTransitionId = this.imageTransitionId;

        if (this.imageTransitionTimeoutId) {
            window.clearTimeout(this.imageTransitionTimeoutId);
            this.imageTransitionTimeoutId = null;
        }

        if (this.imageTransitionAnimationFrameId) {
            window.cancelAnimationFrame(this.imageTransitionAnimationFrameId);
            this.imageTransitionAnimationFrameId = null;
        }

        const transitionDuration = this.getImageTransitionDuration();

        imageElement.classList.add('c-image__image--is-transitioning');
        imageElement.classList.remove('c-image__image--is-visible');

        this.imageTransitionTimeoutId = window.setTimeout(() => {
            if (currentTransitionId !== this.imageTransitionId) {
                return;
            }

            const preloadImage = new window.Image();

            const applyImage = () => {
                if (currentTransitionId !== this.imageTransitionId) {
                    return;
                }

                imageElement.src = imgSrc.image;
                imageElement.setAttribute('data-step', imgSrc.imageStep);
                imageElement.setAttribute('data-caption', imgSrc.imageCaption || '');

                if (typeof onImageChanged === 'function') {
                    onImageChanged();
                }

                const revealImage = () => {
                    this.imageTransitionAnimationFrameId = window.requestAnimationFrame(() => {
                        if (currentTransitionId !== this.imageTransitionId) {
                            return;
                        }

                        imageElement.classList.add('c-image__image--is-visible');
                    });

                    this.imageTransitionTimeoutId = window.setTimeout(() => {
                        if (currentTransitionId !== this.imageTransitionId) {
                            return;
                        }

                        imageElement.classList.remove('c-image__image--is-transitioning');
                        this.imageTransitionTimeoutId = null;
                    }, transitionDuration);
                };

                if (typeof imageElement.decode === 'function') {
                    imageElement.decode().catch(() => undefined).finally(() => {
                        if (currentTransitionId !== this.imageTransitionId) {
                            return;
                        }

                        revealImage();
                    });

                    return;
                }

                revealImage();
            };

            preloadImage.addEventListener('load', applyImage, {once: true});
            preloadImage.addEventListener('error', applyImage, {once: true});
            preloadImage.src = imgSrc.image;
        }, transitionDuration);
    }

    /**
     * Image transition duration in milliseconds.
     * @returns {number}
     */
    getImageTransitionDuration() {
        return 180;
    }

    /**
     * Setting image caption
     * @param containerModalContent
     * @param imgSrc
     */
    imageCaption(containerModalContent, imgSrc) {
        const existingCaption = containerModalContent.querySelector('.c-image__caption');
        if (existingCaption !== null) {
            existingCaption.remove();
        }

        if (imgSrc.imageCaption) {
            containerModalContent.insertAdjacentHTML("beforeend",
                '<figcaption class="c-image__caption">' + imgSrc.imageCaption + '</figcaption>');
        }
    }

    /**
     * Update gallery counter (current / total).
     * @param {HTMLElement} container
     */
    updateImageCounter(container) {
        if (!container) {
            return;
        }

        const counterContainer = this.getOrCreateCounterContainer(container);
        if (!counterContainer || !this.imageDataSet.length) {
            return;
        }

        const currentIndex = this.getCurrentImageIndex() + 1;
        const totalImages = this.imageDataSet.length;

        counterContainer.setAttribute('aria-live', 'polite');
        counterContainer.textContent = `${currentIndex}/${totalImages}`;
    }

    /**
     * Find existing counter container or create one in modal content.
     * @param {HTMLElement} container
     * @returns {HTMLElement|null}
     */
    getOrCreateCounterContainer(container) {
        const existingCounterContainer = container.querySelector('.c-modal__counter');
        if (existingCounterContainer) {
            return existingCounterContainer;
        }

        const modalContent = container.querySelector('.c-modal__content');
        if (!modalContent) {
            return null;
        }

        const counterContainer = document.createElement('div');
        counterContainer.className = 'c-modal__counter';
        modalContent.appendChild(counterContainer);

        return counterContainer;
    }

    /**
     * Resolve currently active image index.
     * @returns {number}
     */
    getCurrentImageIndex() {
        if (!this.imageData) {
            return 0;
        }

        const imageStep = parseInt(this.imageData.imageStep, 10);
        if (Number.isInteger(imageStep) && imageStep >= 0 && imageStep < this.imageDataSet.length) {
            return imageStep;
        }

        const imageIndex = this.imageDataSet.findIndex((imageData) => imageData.image === this.imageData.image);
        return imageIndex >= 0 ? imageIndex : 0;
    }

    /**
     * Handle local gallery controls.
     * @param {MouseEvent} event
     */
    handleContainerClick(event) {
        const trigger = event.target instanceof Element
            ? event.target.closest('[data-next], [data-prev]')
            : null;

        if (!trigger) {
            return;
        }

        if (trigger.hasAttribute('data-next')) {
            this.imageData = this.cycleImage('next');
            return;
        }

        if (trigger.hasAttribute('data-prev')) {
            this.imageData = this.cycleImage('prev');
        }
    }

    /**
     * Handle keyboard based gallery navigation.
     * @param {KeyboardEvent} event
     */
    handleKeyboardNavigation(event) {
        if (!this.container || !this.isModalOpen()) {
            return;
        }

        if (event.key === 'ArrowRight') {
            this.imageData = this.cycleImage('next');
        }

        if (event.key === 'ArrowLeft') {
            this.imageData = this.cycleImage('prev');
        }
    }

    /**
     * Check whether current modal is open.
     * @returns {boolean}
     */
    isModalOpen() {
        return Boolean(this.container && this.container.hasAttribute('open'));
    }

}

export default Gallery;
