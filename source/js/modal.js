
class Modal {

<<<<<<< HEAD

=======
>>>>>>> c4e8f756ca2032fa7fd8a1de15e234c376aeb5ed
    constructor() {
        this.enableModals();
    }

<<<<<<< HEAD
    /**
     * Enable Modal
     */
=======
    /* ----------------------------------------------------
     *  Enable Modal
     * ---------------------------------------------------- */
>>>>>>> c4e8f756ca2032fa7fd8a1de15e234c376aeb5ed
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
<<<<<<< HEAD
                    const container = modalImg.querySelector('.c-image');
                    container.innerHTML = '';
                    container.classList.remove('c-image--is-placeholder');
=======
>>>>>>> c4e8f756ca2032fa7fd8a1de15e234c376aeb5ed
                    self.createImg(modalImg, displayImage);
                }
            });
        }

        const closeTrigger = document.querySelectorAll("[data-close]");
        const nextTrigger = document.querySelectorAll("[data-next]");
        const prevTrigger = document.querySelectorAll("[data-prev]");

<<<<<<< HEAD
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

=======
>>>>>>> c4e8f756ca2032fa7fd8a1de15e234c376aeb5ed
        // Close
        for (const trigger of closeTrigger) {
            trigger.addEventListener("click", function() {
                this.parentElement.parentElement.parentElement.classList.remove(isVisible);
            });
        }

<<<<<<< HEAD
=======
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

>>>>>>> c4e8f756ca2032fa7fd8a1de15e234c376aeb5ed
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

<<<<<<< HEAD
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
        const nextIndex = (nav === 'next') ? (currentIndex +1) % imageDataSet.length :
            (currentIndex -1) % imageDataSet.length;

        (currentIndex > imageDataSet.length) ? self.createImg(modalImg, imageDataSet[0]) :
            self.createImg(modalImg, imageDataSet[nextIndex]);
=======
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
>>>>>>> c4e8f756ca2032fa7fd8a1de15e234c376aeb5ed

        return imageDataSet[nextIndex];
    }

<<<<<<< HEAD
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

=======
    /* ----------------------------------------------------
     *  Create Image in modal
     * ---------------------------------------------------- */
    createImg(containerId, imgSrc) {
        const container = containerId.querySelector('.c-image');
        const img = document.createElement("img");

        container.innerHTML = '';
        container.classList.remove('c-image--is-placeholder');

        img.setAttribute("src", imgSrc);
        img.classList.add('c-image__image');
        container.appendChild(img);
    }


}
>>>>>>> c4e8f756ca2032fa7fd8a1de15e234c376aeb5ed

export default Modal;