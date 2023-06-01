import { Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
class ScrollToMarker {
    map: LeafletMap;
    markers: MarkerClusterGroup;
    container: Element;
    scrollToMarkerItems: Array<Element>;

    constructor(map: LeafletMap, markers: MarkerClusterGroup, container: Element) {
        this.scrollToMarkerItems = [...container.querySelectorAll('[js-scroll-to-marker]')];
        this.map = map;
        this.markers = markers;
        this.container = container;

        this.init();
    }

    init() {
        if (this.scrollToMarkerItems.length <= 0) return;
        
        this.setListeners();
        // console.log(this.scrollToMarkerItems);
    }
    
    setListeners() {
        let currentScroll = 0;
        window.addEventListener('scroll', () => {
            let scrollTop = window.scrollY;
            if (Math.abs(currentScroll - scrollTop) > 10 || Math.abs(currentScroll - scrollTop) < -10) {
                this.handleScroll();
                currentScroll = scrollTop;
            }
        });
    }


    handleScroll() {
        // console.log('scroll');
    }

}

export default ScrollToMarker;