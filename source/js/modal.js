import Gallery from './gallery';

class Modal {
    constructor() {
        this.modalId = null;
        this.openTrigger = document.querySelectorAll('[data-open]');
        this.closeTrigger = document.querySelectorAll('[data-close]');

        this.dialogs = document.querySelectorAll('.c-modal');
        this.galleryInstance = null;
    }

    /**
     * Enable Modal
     */
    enableModals() {
        const self = this;

        for (const trigger of this.openTrigger) {
            trigger.addEventListener('click', function () {
                this.modalId = this.getAttribute('data-open'); //this.dataset.open;
                const modal = document.getElementById(this.modalId);

                if (!modal.hasAttribute('open')) { // check if the dialog is already open
                    modal.classList.add('c-modal--visible');
                    modal.showModal();
                }

                if (this.getAttribute('data-large-img')) {
                    // Gallery
                    self.galleryInstance = new Gallery();
                    self.galleryInstance.enableGallery(this.modalId);
                    self.galleryInstance.initImage(
                        this.modalId,
                        this.getAttribute('data-large-img')
                    );
                }

                self.lockScroll();
            });

            document.dispatchEvent(new CustomEvent('enableStyleguideModals'));
        }

        // Close
        for (const trigger of this.closeTrigger) {
            trigger.addEventListener('click', function (e) {
                e.stopPropagation()
                this.closest('dialog').close()
                self.galleryInstance = null;
            });
        }

        for (const dialog of this.dialogs) {
            dialog.addEventListener('close', function () {
                this.classList.remove('c-modal--visible');
                self.unlockScroll();
            });

            dialog.addEventListener('click', (e) => this.handleClickOutside(e))
        }
    }

    handleClickOutside(e) {
        const dialogElement = e.target

        // If click is outside the dialog
        if (this.clickIsOutsideElement(dialogElement, e.clientX, e.clientY)) {
            dialogElement.close()
        }
    }

    clickIsOutsideElement(element, clientX, clientY) {
        const boundingRect = element.getBoundingClientRect()

        if (clientX < boundingRect.left) return true
        if (clientX > boundingRect.right) return true
        if (clientY < boundingRect.top) return true
        if (clientY > boundingRect.bottom) return true

        return false
    }

    /**
     * Lock scroll
     * @returns {*}
     */
    lockScroll() {
        const overflowHidden = 'u-overflow--hidden';
        document.querySelector(`body`).classList.add(overflowHidden);
    }

    /**
     * Unlock scroll
     * @returns {*}
     */
    unlockScroll() {
        const overflowHidden = 'u-overflow--hidden';
        document.querySelector(`body`).classList.remove(overflowHidden);
    }
}

export default Modal;
