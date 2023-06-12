import { zoomToMarker } from './helpers/osmHelpers';

class ZoomMarkerSroll {

    constructor(map, markers, markerElementPairs) {
        this.map = map;
        this.markers = markers;
        this.markerElementPairs = markerElementPairs;

        this.init();
    }

    init() {
        if (!Array.isArray(this.markerElementPairs) && this.markerElementPairs.length <= 0) return;
        
        const filteredArray = this.markerElementPairs.filter(pair => pair.element.hasAttribute('data-js-scroll-to-marker'));

        this.observerIntersection(filteredArray);
    }

    observerIntersection(filteredArray) {
        let timeStamp = 0;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                    if (entry.intersectionRatio > 0) {
                    const rect = entry.boundingClientRect;
                    const isFullyInsideViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;

                    if (isFullyInsideViewport) {
                        const pair = filteredArray.find(pair => pair.element === entry.target);
                        let currentDate = new Date();
                        if (!timeStamp || currentDate - timeStamp >= 300) {
                            zoomToMarker(pair.marker);
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