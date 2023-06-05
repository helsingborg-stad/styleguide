export function zoomToMarker(marker) {
    if (marker && marker.__parent) {
        const cluster = marker.__parent;
        cluster.zoomToBounds();
        setTimeout(function () {
            marker.openPopup();
        }, 300);
    }
}

export function createMarkerElementPairs(map, markers, container) {
    if (!map || !markers || !container) return;
    const sidebar = container.querySelector('.c-openstreetmap__sidebar');
    const sidebarItems = sidebar.querySelectorAll('[js-map-lng][js-map-lat]');

    let markerElementPair = [];

    sidebarItems.forEach(item => {
        if (!item.getAttribute('js-map-lat') || !item.getAttribute('js-map-lng')) return;
        const lat = parseFloat(item.getAttribute('js-map-lat'));
        const lng = parseFloat(item.getAttribute('js-map-lng'));

        markers.getLayers().find(marker => {
            const markerLatLng = marker.getLatLng();
            if (marker instanceof L.Marker && markerLatLng.equals([lat, lng])) {
                markerElementPair.push({ marker: marker, element: item, url: {lat: lat, lng: lng} });
            } else if (marker instanceof L.MarkerCluster) {
                const childMarkers = marker.getAllChildMarkers();
                return markerElementPair.push({ marker: childMarkers.some(child => child.getLatLng().equals([lat, lng])), element: item, url: { lat: lat, lng: lng }});
            }
        });
    });

    return markerElementPair;
}

export function setParams({lat, lng} = false) {
    const searchParams = new URLSearchParams(window.location.search);

    if (lat && lng) {
        searchParams.set('osmLat', lat);
        searchParams.set('osmLng', lng);
        const setParams = window.location.origin + window.location.pathname + '?' + searchParams.toString();
        history.pushState({}, '', setParams);
    } else {
        searchParams.delete('osmLat');
        searchParams.delete('osmLng');
        const setParams = window.location.origin + window.location.pathname + '?' + searchParams.toString();
        history.pushState({}, '', setParams);
    }
}

export function getParams() {
    const queryParams = new URLSearchParams(window.location.search);
    
    if(queryParams.has('osmLat') && queryParams.has('osmLng')) {
        return {lat: queryParams.get('osmLat'), lng: queryParams.get('osmLng')}
    }
    
    return false;
}


