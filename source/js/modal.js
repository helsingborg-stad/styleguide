class Modal {

    constructor() {
        this.enableModals();
    }

    /* ----------------------------------------------------
     *  Enable Modal
     * ---------------------------------------------------- */
    enableModals() {
        const self = this;
        const openTrigger = document.querySelectorAll("[data-open]");
        const isVisible = "c-modal__is-visible";
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
                displayImage = self.cycleImage('next', displayImage, imageDataSet, modalImg);
            });
        }

        // Close
        for (const trigger of closeTrigger) {
            trigger.addEventListener("click", function() {
                this.parentElement.parentElement.parentElement.classList.remove(isVisible);
            });
        }

        // Click outside modal
        document.addEventListener("click", e => {
            if (e.target == document.querySelector(`.${isVisible}`)) {
                document.querySelector(`.${isVisible}`).classList.remove(isVisible);
            }
        });

        // Pressing Esc key to close modal
        document.addEventListener("keyup", e => {
            if (e.key == "Escape" && document.querySelector(`.${isVisible}`)) {
                document.querySelector(`.${isVisible}`).classList.remove(isVisible);
            }
        });
    }

    /* ----------------------------------------------------
     *  Next & previous Image
     * ---------------------------------------------------- */
    cycleImage(nav, displayImage, imageDataSet, modalImg) {
        const self = this;
        const currentIndex = imageDataSet.indexOf(displayImage);
        const nextIndex = (nav === 'next') ? (currentIndex +1) % imageDataSet.length : (currentIndex -1) % imageDataSet.length;

        if (currentIndex > imageDataSet.length) {
            self.createImg(modalImg, imageDataSet[0]);
        } else {
            self.createImg(modalImg, imageDataSet[nextIndex]);
        }

        return imageDataSet[nextIndex];
    }

    /* ----------------------------------------------------
     *  Create Image in modal
     * ---------------------------------------------------- */
    createImg(containerId, imgSrc) {
        const container = containerId.querySelector('.c-image');
            container.innerHTML = '';
            container.classList.remove('c-image--is-placeholder');
            const img = document.createElement("img");
            img.setAttribute("src", imgSrc);
            img.classList.add('c-image__image');
            container.appendChild(img);
    }

}

export default Modal;