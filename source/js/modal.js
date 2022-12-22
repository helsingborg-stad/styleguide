import Gallery from "./gallery";

class Modal {

    constructor() {

        this.modalId = null;
        this.openTrigger = document.querySelectorAll("[data-open]");
        this.closeTrigger = document.querySelectorAll("[data-close]");
        this.dialogs = document.querySelectorAll('.c-modal');
        this.galleryInstance = null;
    }

    /**
     * Enable Modal
     */
    enableModals() {

        const self = this;

        for(const trigger of this.openTrigger) {
            trigger.addEventListener("click", function() {
                this.modalId = this.getAttribute('data-open'); //this.dataset.open;
                const modal = document.getElementById(this.modalId);
                modal.classList.add('c-modal--visible');
                modal.showModal();

                if(this.getAttribute('data-large-img')) {
                    // Gallery
                    self.galleryInstance = new Gallery;
                    self.galleryInstance.enableGallery(this.modalId);
                    self.galleryInstance.initImage(this.modalId, this.getAttribute('data-large-img'));
                }

                self.lockScroll();
            });
        }

        // Close
        for (const trigger of this.closeTrigger) {
            trigger.addEventListener("click", function() {
                trigger.closest('dialog').close();
                self.galleryInstance = null;
            });
        }

        for(const dialog of this.dialogs) {
            dialog.addEventListener('close', function() {
                this.classList.remove('c-modal--visible');
                self.unlockScroll();
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


}

export default Modal;