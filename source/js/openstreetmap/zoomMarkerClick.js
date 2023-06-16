import { zoomToMarker } from './helpers/osmHelpers';

class ZoomMarkerClick {
    constructor(markerElementPairs) {
        this.markerElementPairs = markerElementPairs;
        
        if (!this.markerElementPairs) return;
        
        this.zoomListener();
    }
    
    zoomListener() {
        this.markerElementPairs.forEach(pair => {
            if (!pair.hasOwnProperty('marker') && !pair.hasOwnProperty('element')) return;
            const marker = pair.marker;
            const element = pair.element;
            element.addEventListener('click', (e) => {
                zoomToMarker(marker);
            });
        });
    }
}

export default ZoomMarkerClick;