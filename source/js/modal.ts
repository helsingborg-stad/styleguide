import Gallery from './gallery';

class Modal {
    modalId: string | null;
    openTrigger: NodeListOf<Element>;
    closeTrigger: NodeListOf<Element>;
    dialogs: NodeListOf<HTMLDialogElement>;
    galleryInstances: Map<string, Gallery>;

    private readonly handleDocumentClickBound: (event: Event) => void;
    private readonly handleReindexBound: () => void;

    constructor() {
        this.modalId = null;
        this.openTrigger = document.querySelectorAll('[data-open]');
        this.closeTrigger = document.querySelectorAll('[data-close]');
        this.dialogs = document.querySelectorAll<HTMLDialogElement>('.c-modal');
        this.galleryInstances = new Map<string, Gallery>();

        this.handleDocumentClickBound = (event: Event) => this.handleDocumentClick(event);
        this.handleReindexBound = () => this.reindexTriggers();

        this.enableModals();
    }

    /**
     * Enable Modal
     */
    enableModals() {
        document.removeEventListener('click', this.handleDocumentClickBound);
        document.addEventListener('click', this.handleDocumentClickBound);

        document.removeEventListener('reindexModals', this.handleReindexBound);
        document.addEventListener('reindexModals', this.handleReindexBound);

        this.attachDialogEvents();

        document.dispatchEvent(new CustomEvent('enableStyleguideModals'));
    }

    /**
     * Programmatically open a modal
     */
    openModal(modalId: string, largeImgUrl: string | null = null) {
        const modal = document.getElementById(modalId) as HTMLDialogElement | null;

        if (!modal) {
            console.warn(`Modal with ID "${modalId}" not found.`);
            return;
        }

        this.modalId = modalId;

        if (!modal.hasAttribute('open')) {
            modal.classList.add('c-modal--visible');

            if (typeof modal.showModal === 'function') {
                modal.showModal();
            }
        }

        if (largeImgUrl) {
            const galleryInstance = this.getGalleryInstance(modalId);
            galleryInstance.enableGallery(modalId);
            galleryInstance.initImage(modalId, largeImgUrl);
        }

        this.lockScroll();
    }

    /**
     * Handle clicks outside the modal
     */
    handleClickOutside(e: Event) {
        const dialogElement = e.currentTarget as HTMLDialogElement | null;
        const mouseEvent = e as MouseEvent;

        if (!dialogElement) {
            return;
        }

        if (this.clickIsOutsideElement(dialogElement, mouseEvent.clientX, mouseEvent.clientY)) {
            dialogElement.close();
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
        const hasOpenDialogs = Array.from(this.dialogs).some((dialog) => dialog.hasAttribute('open'));

        if (!hasOpenDialogs) {
            document.body.classList.remove(overflowHidden);
        }
    }

    /**
     * Reindex triggers and dialogs
     */
    reindexTriggers() {
        this.openTrigger = document.querySelectorAll('[data-open]');
        this.closeTrigger = document.querySelectorAll('[data-close]');
        this.dialogs = document.querySelectorAll<HTMLDialogElement>('.c-modal');

        this.attachDialogEvents();

        for (const id of this.galleryInstances.keys()) {
            if (!document.getElementById(id)) {
                this.galleryInstances.delete(id);
            }
        }
    }

    private attachDialogEvents() {
        for (const dialog of this.dialogs) {
            if (dialog.dataset.modalBound === 'true') {
                continue;
            }

            dialog.addEventListener('close', () => {
                dialog.classList.remove('c-modal--visible');
                this.unlockScroll();
            });

            dialog.addEventListener('click', (event: Event) => this.handleClickOutside(event));
            dialog.dataset.modalBound = 'true';
        }
    }

    private handleDocumentClick(event: Event) {
        const trigger = (event.target as Element | null)?.closest('[data-open], [data-close]') as HTMLElement | null;

        if (!trigger) {
            return;
        }

        const openModalId = trigger.getAttribute('data-open');
        if (openModalId) {
            this.openModal(openModalId, trigger.getAttribute('data-large-img'));
            return;
        }

        const closeTrigger = trigger.getAttribute('data-close');
        if (closeTrigger !== null) {
            const closestDialog = trigger.closest('dialog') as HTMLDialogElement | null;
            if (closestDialog?.hasAttribute('open')) {
                event.stopPropagation();
                closestDialog.close();
            }
        }
    }

    private getGalleryInstance(modalId: string): Gallery {
        const existingGalleryInstance = this.galleryInstances.get(modalId);
        if (existingGalleryInstance) {
            return existingGalleryInstance;
        }

        const galleryInstance = new Gallery(modalId);
        this.galleryInstances.set(modalId, galleryInstance);
        return galleryInstance;
    }
}

export function initializeModal() {
    new Modal();
}

export default Modal;