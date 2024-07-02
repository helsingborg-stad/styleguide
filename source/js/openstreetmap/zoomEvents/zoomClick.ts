import { zoomToMarker } from "../map/zoomToMarker";
import { PostMarkerPair } from "../interface/interface";

class ZoomClick {
    constructor(private container: HTMLElement) {
        this.listenZoomClickEvents();
    }

    private listenZoomClickEvents(): void {
        this.container.addEventListener('postMarkerPairAdded', (e: Event) => {
            const customEvent = e as CustomEvent;
            this.postMarkerPairAdded(customEvent.detail);            
        });
    }

    private postMarkerPairAdded(postMarkerPair: PostMarkerPair): void {
        postMarkerPair.post.addEventListener('click', () => {
            if (postMarkerPair.id) {
                const url = new URL(window.location.href);
                const params = new URLSearchParams(url.search);
                params.set('osmPost', postMarkerPair.id);

                url.search = params.toString();
                window.history.replaceState({}, '', url.toString());
            }

            zoomToMarker(postMarkerPair.marker);
        });
    }
}

export default ZoomClick;