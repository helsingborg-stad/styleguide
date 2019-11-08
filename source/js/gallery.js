/**
 * Component Gallery
 */
import Steppers from "./steppers";

class Gallery {

    constructor() {

        this.imageDataSet = [];
        this.imageData = {};
        this.modalImg = '';
        this.modalId = null;
        this.container = null;
        this.isVisible = "c-modal__bg--is-visible";
        this.StepperInstance = {};

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
                imageStep: img.getAttribute('data-stepping')
            });

            if (img.getAttribute('data-large-img') === this.modalImg) {
                this.imageData.image = img.getAttribute('data-large-img');
                this.imageData.imageStep = img.getAttribute('data-stepping');
            }
        }

        this.container = document.getElementById(this.modalId);
        this.container.querySelector('.c-image').innerHTML = '';
        self.createImg(this.container, this.imageData);

        this.StepperInstance = new Steppers;
        this.StepperInstance.enableStepper('dots', this.container, this.imageDataSet.length);
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
                self.imageData = self.cycleImage('next', self.imageData, self.imageDataSet);
            });
        }

        // Previous image
        for (const prev of prevTrigger) {
            prev.addEventListener("click", function () {
                self.imageData = self.cycleImage('prev', self.imageData, self.imageDataSet);
            });
        }

        // Pressing Right key to skip to next
        for (const nxt of nextTrigger) {
            document.addEventListener("keyup", e => {
                if (e.key == "ArrowRight" && document.querySelector(`.${self.isVisible}`)) {
                    self.imageData = self.cycleImage('next', self.imageData, self.imageDataSet);
                }
            });
        }

        // Pressing Left key to skip to previous
        for (const nxt of nextTrigger) {
            document.addEventListener("keyup", e => {
                if (e.key == "ArrowLeft" && document.querySelector(`.${self.isVisible}`)) {
                    self.imageData = self.cycleImage('prev', self.imageData, self.imageDataSet);
                }
            });
        }
    }

    /**
     * Next & previous Image
     * @param nav
     * @param imageData
     * @param imageDataSet
     * @param modalImg
     * @returns {*}
     */
    cycleImage(nav, imageData, imageDataSet) {
        const self = this;
        const currentIndex = imageDataSet.indexOf(imageData);
        let nextIndex = (nav === 'next') ? (currentIndex + 1) % imageDataSet.length : (currentIndex - 1) % imageDataSet.length;
        nextIndex = (nextIndex < 0) ? imageDataSet.length - 1 : nextIndex;

        (currentIndex > imageDataSet.length) ? self.createImg(this.container, imageDataSet[0]) :
            self.createImg(this.container, imageDataSet[nextIndex]);

        this.StepperInstance.dots(false);

        return imageDataSet[nextIndex];
    }

    /**
     * Create Image in modal
     * @param containerId
     * @param imgSrc
     */
    createImg(containerId, imgSrc) {

        const container = containerId.querySelector('.c-image');
        if (container.querySelectorAll('img').length === 0) {
            container.innerHTML = '';
            container.classList.remove('c-image--is-placeholder');
            const img = document.createElement("img");
            img.setAttribute("src", imgSrc.image);
            img.setAttribute("data-step", imgSrc.imageStep);
            img.classList.add('c-image__image');
            container.appendChild(img);
        } else {
            container.querySelector('.c-image__image').src = imgSrc.image;
            container.querySelector('.c-image__image').setAttribute('data-step', imgSrc.imageStep);
        }
    }
}

export default Gallery;
