import { zoomToMarker } from './helpers/osmHelpers';
import { Map as LeafletMap, MarkerClusterGroup } from 'leaflet';
import { MarkerElementObjects } from './interface/interface';

class ZoomMarkerSroll {
    map: LeafletMap;
    markers: MarkerClusterGroup;
    markerElementObjects: MarkerElementObjects[];

    constructor(map: LeafletMap, markers: MarkerClusterGroup, markerElementObjects: MarkerElementObjects[]) {
        this.map = map;
        this.markers = markers;
        this.markerElementObjects = markerElementObjects;

        this.init();
    }

    private init() {
        if (!Array.isArray(this.markerElementObjects) || this.markerElementObjects.length <= 0) return;

        const filteredArray = this.markerElementObjects.filter(pair => pair.element.hasAttribute('data-js-scroll-to-marker'));

        this.observerIntersection(filteredArray);
    }

    private observerIntersection(filteredArray: MarkerElementObjects[]) {
        let timeStamp: Date | null = null; // Adjusted the type to Date | null

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0) {
                    const rect = entry.boundingClientRect;
                    const isFullyInsideViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;

                    if (isFullyInsideViewport) {
                        const pair = filteredArray.find(pair => pair.element === entry.target);
                        const currentDate = new Date();
                        if (!timeStamp || currentDate.getTime() - timeStamp.getTime() >= 200) {
                            zoomToMarker(pair?.marker);
                            timeStamp = currentDate;
                        }
                    }
                }
            });
        }, {
            root: null,
            threshold: [1]
        });

        filteredArray.forEach(pair => {
            if (pair.element) {
                observer.observe(pair.element);
            }
        });
    }
}

export default ZoomMarkerSroll;