import Gallery from './gallery';

class Modal {
    modalId: string | null;
    openTrigger: NodeListOf<Element>;
    closeTrigger: NodeListOf<Element>;
    dialogs: NodeListOf<Element>;
    galleryInstance: Gallery | null;

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
            trigger.addEventListener('click', function (e) {

                self.modalId = trigger.getAttribute('data-open'); //this.dataset.open;
                const modal = document.getElementById(self.modalId ?? '');

                if (modal && !modal.hasAttribute('open')) { // check if the dialog is already open
                    modal.classList.add('c-modal--visible');

                    if (modal.nodeName === 'DIALOG') {
                        (modal as HTMLDialogElement).showModal();
                    }

                }

                if (trigger.getAttribute('data-large-img')) {
                    // Gallery
                    self.galleryInstance = new Gallery();
                    self.galleryInstance.enableGallery();
                    self.galleryInstance.initImage(
                        self.modalId,
                        trigger.getAttribute('data-large-img')
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
                trigger.closest('dialog')?.close()
                self.galleryInstance = null;
            });
        }

        for (const dialog of this.dialogs) {
            dialog.addEventListener('close', function () {
                dialog.classList.remove('c-modal--visible');
                self.unlockScroll();
            });

            dialog.addEventListener('click', (e) => this.handleClickOutside(e))
        }
    }

    handleClickOutside(e: Event) {
        const dialogElement = <Element|null>e.target
        const clientX = (e as MouseEvent).clientX ?? null
        const clientY = (e as MouseEvent).clientY ?? null

        if( !dialogElement || !clientX || !clientY ) return

        if (dialogElement && this.clickIsOutsideElement(dialogElement, clientX, clientY)) {
            if (dialogElement.nodeName === 'DIALOG') {
                (dialogElement as HTMLDialogElement).close()
            }
        }
    }

    clickIsOutsideElement(element: Element, clientX: number, clientY: number) {
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
        document.querySelector(`body`)?.classList.add(overflowHidden);
    }

    /**
     * Unlock scroll
     * @returns {*}
     */
    unlockScroll() {
        const overflowHidden = 'u-overflow--hidden';
        document.querySelector(`body`)?.classList.remove(overflowHidden);
    }
}

export function initializeModal() {
    const observer = new MutationObserver((mutationsList, observer) => {
        const modalInstance = new Modal();
        modalInstance.enableModals();
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    const modalInstance = new Modal();
    modalInstance.enableModals();
}

export default Modal;
