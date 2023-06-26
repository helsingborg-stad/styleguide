import { zoomToMarker } from './helpers/osmHelpers';
import { MarkerElementObjects } from './interface/interface';

class ZoomMarkerClick {
    markerElementObjects: MarkerElementObjects[];
    
    constructor(markerElementObjects: MarkerElementObjects[]) {
        this.markerElementObjects = markerElementObjects;
        
        if (!this.markerElementObjects) return;
        
        this.zoomListener();
    }
    
    private zoomListener() {
        this.markerElementObjects.forEach(pair => {
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