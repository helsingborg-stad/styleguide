export function zoomToMarker(marker) {
    if (marker && marker.__parent) {
        const cluster = marker.__parent;
        cluster.zoomToBounds();
        setTimeout(function () {
            marker.openPopup();
        }, 300);
    }
}

export function getELementJSONLocation(el) {
    if (!el || !el.hasAttribute('data-js-map-location')) return false;

    const location = JSON.parse(el.getAttribute('data-js-map-location')) ?? false;

    return location;
}

export function getLatLng(el) {
    const json = getELementJSONLocation(el);
    if (typeof json === 'object' && typeof json !== null && 'lat' in json && 'lng' in json) {
        const lat = json.lat;
        const lng = json.lng;
        const tooltip = json.tooltip ?? false;
        const url = json.url ?? false;

        return {lat: lat, lng: lng, tooltip: tooltip, url: url, element: el};
    }
    
    return { lat: false, lng: false };
}

export function pushCoordinatesToBrowserHistory({lat, lng} = false) {
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

export function getCoordinatesFromURLSearchParams() {
    const queryParams = new URLSearchParams(window.location.search);
    
    if(queryParams.has('osmLat') && queryParams.has('osmLng')) {
        return {lat: queryParams.get('osmLat'), lng: queryParams.get('osmLng')}
    }
    
    return false;
}


