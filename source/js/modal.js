class Modal {

    constructor() {
        this.enableModals();
    }

    /**
     * Enable Modal
     */
    enableModals() {
        const self = this;
        const openTrigger = document.querySelectorAll("[data-open]");
        const isVisible = "c-modal__bg--is-visible";
        let modalId;

        for(const trigger of openTrigger) {
            trigger.addEventListener("click", function() {
                modalId = this.dataset.open;
                document.getElementById(modalId).classList.add(isVisible);
            });
        }

        let imgSrc = document.querySelectorAll("[data-imgSrc]");
        let imageDataSet = [];
        let displayImage, modalImg;

        for(let img of imgSrc) {
            imageDataSet.push(img.getAttribute('data-imgSrc'));
            img.addEventListener("click", function() {
                displayImage = this.getAttribute('data-imgSrc');
                if(displayImage) {
                    modalImg = document.getElementById(modalId);
                    const container = modalImg.querySelector('.c-image');
                    container.innerHTML = '';
                    container.classList.remove('c-image--is-placeholder');
                    self.createImg(modalImg, displayImage);
                    self.lockScroll();
                }
            });
        }

        const closeTrigger = document.querySelectorAll("[data-close]");
        const nextTrigger = document.querySelectorAll("[data-next]");
        const prevTrigger = document.querySelectorAll("[data-prev]");

        // Next Image
        for (const nxt of nextTrigger) {
            nxt.addEventListener("click", function() {
                displayImage = self.cycleImage('next', displayImage, imageDataSet, modalImg);
            });
        }

        // Previous image
        for (const prev of prevTrigger) {
            prev.addEventListener("click", function() {
                displayImage = self.cycleImage('prev', displayImage, imageDataSet, modalImg);
            });
        }

        // Close
        for (const trigger of closeTrigger) {
            trigger.addEventListener("click", function() {
                this.parentElement.parentElement.parentElement.classList.remove(isVisible);
                self.unlockScroll();
            });
        }

        // Click outside modal
        document.addEventListener("click", e => {
            if (e.target == document.querySelector(`.${isVisible}`)) {
                document.querySelector(`.${isVisible}`).classList.remove(isVisible);
                self.unlockScroll();
            }
        });

        // Pressing Esc key to close modal
        document.addEventListener("keyup", e => {
            if (e.key == "Escape" && document.querySelector(`.${isVisible}`)) {
                document.querySelector(`.${isVisible}`).classList.remove(isVisible);
                self.unlockScroll();
            }
        });

        // Pressing Right key to skip to next
        for (const nxt of nextTrigger) {
            document.addEventListener("keyup", e => {
                if (e.key == "ArrowRight" && document.querySelector(`.${isVisible}`)) {
                    displayImage = self.cycleImage('next', displayImage, imageDataSet, modalImg);
                }
            });
        }

        // Pressing Left key to skip to previous
        for (const nxt of nextTrigger) {
            document.addEventListener("keyup", e => {
                if (e.key == "ArrowLeft" && document.querySelector(`.${isVisible}`)) {
                    displayImage = self.cycleImage('prev', displayImage, imageDataSet, modalImg);
                }
            });
        }
    }

    /**
     * Lock scroll
     * @returns {*}
     */
    lockScroll() {
        const overflowHidden = "u-overflow--hidden";
        document.querySelector(`body`).classList.add(overflowHidden);
    }

    /**
     * Unlock scroll
     * @returns {*}
     */
    unlockScroll() {
        const overflowHidden = "u-overflow--hidden";
        document.querySelector(`body`).classList.remove(overflowHidden);
    }

    /**
     * Next & previous Image
     * @param nav
     * @param displayImage
     * @param imageDataSet
     * @param modalImg
     * @returns {*}
     */
    cycleImage(nav, displayImage, imageDataSet, modalImg) {
        const self = this;
        const currentIndex = imageDataSet.indexOf(displayImage);
        let nextIndex = (nav === 'next') ? (currentIndex +1) % imageDataSet.length : (currentIndex -1) % imageDataSet.length;
        nextIndex = (nextIndex < 0) ? imageDataSet.length-1 : nextIndex;

        (currentIndex > imageDataSet.length) ? self.createImg(modalImg, imageDataSet[0]) :
            self.createImg(modalImg, imageDataSet[nextIndex]);

        return imageDataSet[nextIndex];
    }

    /**
     * Create Image in modal
     * @param containerId
     * @param imgSrc
     */
    createImg(containerId, imgSrc) {
        const container = containerId.querySelector('.c-image');
        if (container.querySelectorAll('img').length === 0){
            container.innerHTML = '';
            container.classList.remove('c-image--is-placeholder');
            const img = document.createElement("img");
            img.setAttribute("src", imgSrc);
            img.classList.add('c-image__image');
            container.appendChild(img);
        }
        else {
            container.querySelector('.c-image__image').src = imgSrc;
        }

    }
}

export default Modal;