import Gallery from "./gallery";

class Modal {

    constructor() {

        this.modalId = null;
        this.openTrigger = document.querySelectorAll("[data-open]");
        this.closeTrigger = document.querySelectorAll("[data-close]");
        this.dialogs = document.querySelectorAll('.c-modal__dialog');
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
                document.getElementById(this.modalId).showModal();

                if(this.getAttribute('data-large-img')) {
                    GalleryInstance.initImage(this.modalId, this.getAttribute('data-large-img'));
                }

                self.lockScroll();
            });
        }

        // Close
        for (const trigger of this.closeTrigger) {
            trigger.addEventListener("click", function() {
                trigger.closest('dialog').close();
            });
        }

        for(const dialog of this.dialogs) {
            dialog.addEventListener('close', function() {
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