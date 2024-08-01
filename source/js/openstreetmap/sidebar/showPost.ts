import { Map as LeafletMap } from 'leaflet';
import { PostMarkerPair } from '../interface/interface';
import ZoomMarker from '../map/zoomMarker';
import { invalidateSize } from '../map/mapHelpers';

class ShowPost {
    constructor(
        private container: HTMLElement, 
        private map: LeafletMap, 
        private baseClass: string, 
        private zoomMarker: ZoomMarker
    ) {
        this.addMarkerPostPairAddedListener();
    }

    private addMarkerPostPairAddedListener(): void {
        this.container.addEventListener('postMarkerPairAdded', (e: Event) => {
            const customEvent = e as CustomEvent;
            const postMarkerPair: PostMarkerPair = customEvent.detail;
            this.setupPostClickListener(postMarkerPair);
        });
    }

    private setupPostClickListener(postMarkerPair: PostMarkerPair): void {
        const fullPostElement = postMarkerPair.post.parentElement?.querySelector(`.${this.baseClass}__post-full`);
        const backButton = fullPostElement?.querySelector(`.${this.baseClass}__button-back`);

        if (!fullPostElement || !backButton) return;

        this.showPost(postMarkerPair, fullPostElement as HTMLElement, backButton as HTMLElement);
        this.hidePostListener(postMarkerPair, fullPostElement as HTMLElement, backButton as HTMLElement);
    }

    private showPost(postMarkerPair: PostMarkerPair, fullPostElement: HTMLElement, backButton: HTMLElement): void {
        postMarkerPair.post.addEventListener('click', () => {
            this.closeAlreadyOpenPosts();
            this.scrollToMap();
            fullPostElement.classList.remove('u-display--none');
            fullPostElement.classList.add('is-open');
            fullPostElement.classList.remove('is-closed');
            this.container.classList.add('has-open-post');
            fullPostElement.setAttribute('aria-hidden', 'false');
            document.body.classList.add('u-overflow--hidden');
            this.zoomMarker.zoom(postMarkerPair.marker);
            backButton.focus();
        });
    }

    private hidePostListener(postMarkerPair: PostMarkerPair|null, fullPostElement: HTMLElement, backButton: HTMLElement): void {
        backButton.addEventListener('click', () => {
            this.hidePost(postMarkerPair, fullPostElement, backButton);
        });
    }

    private hidePost(postMarkerPair: PostMarkerPair|null, fullPostElement: HTMLElement, backButton: HTMLElement): void {
        invalidateSize(this.map);
        fullPostElement.classList.remove('is-open');
        fullPostElement.classList.add('is-closed');
        setTimeout(() => {
            fullPostElement.classList.add('u-display--none');
        }, 200);
        this.container.classList.remove('has-open-post');
        fullPostElement.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('u-overflow--hidden');
        postMarkerPair?.post.focus();
    }

    private closeAlreadyOpenPosts(): void {
        this.container.querySelectorAll(`.${this.baseClass}__post-full.is-open`).forEach((fullPostElement) => {
            const backButton = fullPostElement.querySelector(`.${this.baseClass}__button-back`) as HTMLElement;
            if (backButton) {
                this.hidePost(null, fullPostElement as HTMLElement, backButton)
            }
        });
    }

    private scrollToMap(): void {
        const rect = this.container.getBoundingClientRect();
        if (rect.top > 0) {
            window.scrollBy(0, rect.top);
        }
    }
}

export default ShowPost;