class ScrollToMarker {
    map: Object;
    markers: Array<Element>;
    container: Element;
    scrollToMarkerItems: Array<Element>;

    constructor(map: Object, markers: Array<Element>, container: Element) {
        this.scrollToMarkerItems = [...container.querySelectorAll('[js-scroll-to-marker]')];
        this.map = map;
        this.markers = markers;
        this.container = container;

        this.init();
    }

    init() {
        if (!this.scrollToItemMarkers.length > 0) return;

        this.setListeners();
        console.log(this.container);
    }
    
    setListeners() {
        
    }

}

export default ScrollToMarker;