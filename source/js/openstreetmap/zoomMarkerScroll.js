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
        
        console.log(this.markerElementPairs);
        
        const filteredArray = this.markerElementPairs.filter(pair => pair.element.hasAttribute('data-js-scroll-to-marker'));

        this.observerIntersection(filteredArray);
    }

    observerIntersection(filteredArray) {
        const options = {
            threshold: [1], // Adjust the threshold value as needed
        };

        const offset = 50; // Set the desired offset in pixels

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const rect = entry.boundingClientRect;
                const isTouchingTop = rect.top <= offset && rect.bottom >= -offset;
                const isTouchingBottom = rect.top <= window.innerHeight + offset && rect.bottom >= window.innerHeight - offset;
                if ((isTouchingTop || isTouchingBottom) && entry.intersectionRatio > 0) {
                    const pair = filteredArray.find(pair => pair.element === entry.target);
                    console.log(entry, pair);
                } else {
                    console.log("remove");
                }
            });
        }, options);

        filteredArray.forEach(pair => {
            if (pair.element) {
                observer.observe(pair.element);
            }
        });
    }










    
    setListeners() {
        // let currentScroll = 0;
        // window.addEventListener('scroll', () => {
        //     let scrollTop = window.scrollY;
        //     if (Math.abs(currentScroll - scrollTop) > 10 || Math.abs(currentScroll - scrollTop) < -10) {
        //         this.handleScroll();
        //         currentScroll = scrollTop;
        //     }
        // });
    }
}

export default ZoomMarkerSroll;