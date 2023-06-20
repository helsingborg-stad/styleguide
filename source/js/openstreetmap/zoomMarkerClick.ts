import { zoomToMarker } from './helpers/osmHelpers';
import { MarkerElementPairs } from './interface/interface';

class ZoomMarkerClick {
    markerElementPairs: MarkerElementPairs[];
    
    constructor(markerElementPairs: MarkerElementPairs[]) {
        this.markerElementPairs = markerElementPairs;
        
        if (!this.markerElementPairs) return;
        
        this.zoomListener();
    }
    
    private zoomListener() {
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