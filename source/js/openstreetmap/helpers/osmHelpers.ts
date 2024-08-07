export function getElementJSONLocation(el: HTMLElement) {
    const locationAttr = el.getAttribute('data-js-map-location');
    if (!locationAttr) return false;

    const location = JSON.parse(locationAttr);

    return location;
}

export function getMarkerDataFromElement(el: HTMLElement) {
    const json = getElementJSONLocation(el);
    if (json !== null && typeof json === 'object' && 'lat' in json && 'lng' in json) {
        const lat = json.lat;
        const lng = json.lng;
        const tooltip = json.tooltip ?? false;
        const url = json.url ?? false;
        const icon = json.icon ?? false;
        const id = json.id ?? "";

        return {lat: lat, lng: lng, tooltip: tooltip, url: url, element: el, icon: icon, id: id};
    }
    
    return {lat: undefined, lng: undefined};
}

