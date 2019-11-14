/**
 * Component Gallery
 */
import Steppers from "./steppers";
import Image from "./image";

class Gallery {

    constructor() {

        this.imageDataSet = [];
        this.imageData = {};
        this.modalImg = '';
        this.modalId = null;
        this.container = null;
        this.isVisible = "c-modal__bg--is-visible";
        this.StepperInstance = {};

        this.Image = new Image;
        this.StepperInstance = new Steppers;
    }

    /**
     * Init Modal Image in Gallery
     * @param modalId
     * @param modalImage
     */
    initImage(modalId, modalImage) {

        const self = this;
        this.modalId = modalId;
        this.modalImg = modalImage;

        for (let img of document.querySelectorAll("[data-large-img]")) {
            this.imageDataSet.push({
                image: img.getAttribute('data-large-img'),
                imageStep: img.getAttribute('data-stepping'),
                imageCaption: img.getAttribute('data-caption')
            });

            if (img.getAttribute('data-large-img') === this.modalImg) {
                this.imageData.image = img.getAttribute('data-large-img');
                this.imageData.imageStep = img.getAttribute('data-stepping');
                this.imageData.imageCaption = img.getAttribute('data-caption');
            }
        }

        this.container = document.getElementById(this.modalId);
        this.container.querySelector('.c-image').innerHTML = '';
        self.createImg(this.container, this.imageData);

    }

    /**
     * Enable Gallery
     * Next, Previous image by click or keys
     */
    enableGallery() {

        const self = this;

        const nextTrigger = document.querySelectorAll("[data-next]");
        const prevTrigger = document.querySelectorAll("[data-prev]");

        // Next Image
        for (const nxt of nextTrigger) {
            nxt.addEventListener("click", function () {
                self.imageData = self.cycleImage('next');
            });
        }

        // Previous image
        for (const prev of prevTrigger) {
            prev.addEventListener("click", function () {
                self.imageData = self.cycleImage('prev');
            });
        }

        // Pressing Right key to skip to next
        for (const nxt of nextTrigger) {
            document.addEventListener("keyup", e => {
                if (e.key === "ArrowRight" && document.querySelector(`.${self.isVisible}`)) {
                    self.imageData = self.cycleImage('next');
                }
            });
        }

        // Pressing Left key to skip to previous
        for (const nxt of nextTrigger) {
            document.addEventListener("keyup", e => {
                if (e.key === "ArrowLeft" && document.querySelector(`.${self.isVisible}`)) {
                    self.imageData = self.cycleImage('prev');
                }
            });
        }
    }

    /**
     * Next & previous Image
     * @param nav
     * @returns {*}
     */
    cycleImage(nav) {
        const self = this;

        let currentIndex = parseInt(this.imageData.imageStep);
        let nextIndex = (nav === 'next') ?
            (currentIndex + 1) % this.imageDataSet.length :
            (currentIndex - 1) % this.imageDataSet.length;

        nextIndex = (nextIndex < 0) ? this.imageDataSet.length - 1 : nextIndex;
        (currentIndex > this.imageDataSet.length) ?
            this.createImg(this.container, this.imageDataSet[0]) :
            this.createImg(this.container, this.imageDataSet[nextIndex]);

        return this.imageDataSet[nextIndex];
    }

    /**
     * Create Image in modal
     * @param containerId
     * @param imgSrc
     */
    createImg(containerId, imgSrc) {

        const container = containerId.querySelector('.c-image');
        const containerModalContent = containerId.querySelector('.c-modal__content');
        this.imageData = imgSrc;

        if (container.querySelectorAll('img').length === 0) {

            container.innerHTML = '';
            container.classList.remove('c-image--is-placeholder');

            this.Image.initImage({
                'elementContainer': container,
                'attrList': {
                    'src': imgSrc.image,
                    'data-step': imgSrc.imageStep,
                    'data-caption': imgSrc.imageCaption
                },
                'classList': ['c-image__image']
            });

            this.imageCaption(containerModalContent, imgSrc);
            this.StepperInstance.enableStepper('dots', this.container, this.imageDataSet.length, true);

        } else {
            container.querySelector('.c-image__image').src = imgSrc.image;
            container.querySelector('.c-image__image').setAttribute('data-step', imgSrc.imageStep);

            this.imageCaption(containerModalContent, imgSrc);
            this.StepperInstance.enableStepper('dots', this.container, this.imageDataSet.length, false);
        }
    }

    /**
     * Setting image caption
     * @param containerModalContent
     * @param imgSrc
     */
    imageCaption(containerModalContent, imgSrc) {
        if (imgSrc.imageCaption) {
            if (containerModalContent.querySelector('.c-image__caption') !== null) {
                containerModalContent.querySelector('.c-image__caption').remove();
            }
            containerModalContent.insertAdjacentHTML("beforeend",
                '<figcaption class="c-image__caption">' + imgSrc.imageCaption + '</figcaption>');
        }
    }

}

export default Gallery;
