import { zoomToMarker } from './helpers/osmHelpers';

class ZoomMarkerClick {
    constructor(map, markers, container, markerElementPairs) {
        this.sidebar = container.querySelector('.c-openstreetmap__sidebar');
        this.markers = markers;
        this.map = map;
        this.markerElementPairs = markerElementPairs;
        
        if (!this.map || !this.markers || !this.sidebar || !this.markerElementPairs) return;
        
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