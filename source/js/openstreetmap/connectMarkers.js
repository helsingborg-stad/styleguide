class ConnectMarkers {
    constructor(map, markers, container) {
        this.sidebar = container.querySelector('.c-openstreetmap__sidebar');
        this.markers = markers;
        this.map = map;
        
        if (!this.map || !this.markers || !this.sidebar) return;
        
        this.init();
    }

    init() {
        const sidebarItems = this.sidebar.querySelectorAll('[js-map-lng][js-map-lat]');

        sidebarItems.forEach(item => {
            if (!item.getAttribute('js-map-lat') || !item.getAttribute('js-map-lng')) return;
            const lat = parseFloat(item.getAttribute('js-map-lat'));
            const lng = parseFloat(item.getAttribute('js-map-lng'));

            const matchingMarker = this.markers.getLayers().find(marker => {
                const markerLatLng = marker.getLatLng();
                if (marker instanceof L.Marker && markerLatLng.equals([lat, lng])) {
                    return true;
                } else if (marker instanceof L.MarkerCluster) {
                    const childMarkers = marker.getAllChildMarkers();
                    return childMarkers.some(child => child.getLatLng().equals([lat, lng]));
                }
                return false;
            });

            if (matchingMarker) {
                console.log(matchingMarker);
            }
        });
    }

}

export default ConnectMarkers;