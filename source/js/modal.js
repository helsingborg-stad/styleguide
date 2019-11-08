import Gallery from "./gallery";

class Modal {

    constructor() {

        this.modalId = null;
        this.openTrigger = document.querySelectorAll("[data-open]");
        this.closeTrigger = document.querySelectorAll("[data-close]");
        this.isVisible = "c-modal__bg--is-visible";
    }

    /**
     * Enable Modal
     */
    enableModals() {

        const self = this;

        // Gallery
        let GalleryInstance = new Gallery;
        GalleryInstance.enableGallery(this.modalId);

        for(const trigger of this.openTrigger) {
            trigger.addEventListener("click", function() {
                this.modalId = this.getAttribute('data-open'); //this.dataset.open;
                document.getElementById(this.modalId).classList.add(self.isVisible);

                if(this.getAttribute('data-large-img')) {
                    GalleryInstance.initImage(this.modalId, this.getAttribute('data-large-img'));
                }

                self.lockScroll();
            });
        }

        // Close
        for (const trigger of this.closeTrigger) {
            trigger.addEventListener("click", function() {
                this.parentElement.parentElement.parentElement.classList.remove(self.isVisible);
                self.unlockScroll();
            });
        }

        // Click outside modal
        document.addEventListener("click", e => {
            if (e.target === document.querySelector(`.${self.isVisible}`)) {
                document.querySelector(`.${self.isVisible}`).classList.remove(self.isVisible);
                self.unlockScroll();
            }
        });

        // Pressing Esc key to close modal
        document.addEventListener("keyup", e => {
            if (e.key === "Escape" && document.querySelector(`.${self.isVisible}`)) {
                document.querySelector(`.${self.isVisible}`).classList.remove(self.isVisible);
                self.unlockScroll();
            }
        });
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


}

export default Modal;