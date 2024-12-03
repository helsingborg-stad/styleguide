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

        // Enable modals on initialization
        this.enableModals();

        // Listen for reindexing events
        document.addEventListener('reindexModals', () => this.reindexTriggers());
    }

    /**
     * Enable Modal
     */
    enableModals() {
        const self = this;

        // Attach click handlers to open triggers
        for (const trigger of this.openTrigger) {
            trigger.addEventListener('click', function () {
                self.modalId = trigger.getAttribute('data-open');
                self.openModal(self.modalId ?? '', trigger.getAttribute('data-large-img') || null);
            });
        }

        // Attach click handlers to close triggers
        for (const trigger of this.closeTrigger) {
            trigger.addEventListener('click', function (e) {
                e.stopPropagation();
                const modal = trigger.closest('dialog');
                if (modal) {
                    (modal as HTMLDialogElement).close();
                }
                self.galleryInstance = null;
            });
        }

        // Attach event listeners to dialog elements
        for (const dialog of this.dialogs) {
            dialog.addEventListener('close', function () {
                dialog.classList.remove('c-modal--visible');
                self.unlockScroll();
            });

            dialog.addEventListener('click', (e) => this.handleClickOutside(e));
        }

        document.dispatchEvent(new CustomEvent('enableStyleguideModals'));
    }

    /**
     * Programmatically open a modal
     */
    openModal(modalId: string, largeImgUrl: string | null = null) {
        const modal = document.getElementById(modalId);

        if (!modal) {
            console.warn(`Modal with ID "${modalId}" not found.`);
            return;
        }

        if (!modal.hasAttribute('open')) {
            modal.classList.add('c-modal--visible');

            if (modal.nodeName === 'DIALOG') {
                (modal as HTMLDialogElement).showModal();
            }
        }

        if (largeImgUrl) {
            this.galleryInstance = new Gallery();
            this.galleryInstance.enableGallery();
            this.galleryInstance.initImage(modalId, largeImgUrl);
        }

        this.lockScroll();
    }

    /**
     * Handle clicks outside the modal
     */
    handleClickOutside(e: Event) {
        const dialogElement = e.target as Element | null;
        const clientX = (e as MouseEvent).clientX ?? null;
        const clientY = (e as MouseEvent).clientY ?? null;

        if (!dialogElement || !clientX || !clientY) return;

        if (this.clickIsOutsideElement(dialogElement, clientX, clientY)) {
            if (dialogElement.nodeName === 'DIALOG') {
                (dialogElement as HTMLDialogElement).close();
            }
        }
    }

    /**
     * Check if a click is outside the modal
     */
    clickIsOutsideElement(element: Element, clientX: number, clientY: number) {
        const boundingRect = element.getBoundingClientRect();

        return (
            clientX < boundingRect.left ||
            clientX > boundingRect.right ||
            clientY < boundingRect.top ||
            clientY > boundingRect.bottom
        );
    }

    /**
     * Lock scroll
     */
    lockScroll() {
        const overflowHidden = 'u-overflow--hidden';
        document.body.classList.add(overflowHidden);
    }

    /**
     * Unlock scroll
     */
    unlockScroll() {
        const overflowHidden = 'u-overflow--hidden';
        document.body.classList.remove(overflowHidden);
    }

    /**
     * Reindex triggers and dialogs
     */
    reindexTriggers() {
        this.openTrigger = document.querySelectorAll('[data-open]');
        this.closeTrigger = document.querySelectorAll('[data-close]');
        this.dialogs = document.querySelectorAll('.c-modal');

        // Re-enable modals with updated triggers
        this.enableModals();
    }
}

export function initializeModal() {
    new Modal();
}

export default Modal;