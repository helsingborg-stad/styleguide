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
        console.log(this.map);
        return;
        if (!this.scrollToItemMarkers.length > 0) return;

        this.setListeners();
        console.log(this.container);
    }
    
    setListeners() {
        
    }

}

export default ScrollToMarker;