import { zoomToMarker } from "../map/zoomToMarker";
import { PostMarkerPair } from "../interface/interface";

class ZoomParams {
    private osmPostParam: string;

    constructor(private container: HTMLElement) {
        const urlParams = new URLSearchParams(window.location.search);
        this.osmPostParam = urlParams.get('osmPost') ?? '';
        this.container.addEventListener('postMarkerPairAdded', (e: Event) => {
            const customEvent = e as CustomEvent;
            this.postMarkerPairAdded(customEvent.detail);            
        });
    }

    private postMarkerPairAdded(postMarkerPair: PostMarkerPair): void {
        if (postMarkerPair.id === this.osmPostParam) {
            zoomToMarker(postMarkerPair.marker);
        }
    }
}

export default ZoomParams;