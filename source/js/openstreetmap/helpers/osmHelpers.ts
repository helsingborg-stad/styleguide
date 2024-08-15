import { Location } from "../interface/interface";

export function getElementJSONLocation(el: HTMLElement) {
    const locationAttr = el.getAttribute('data-js-map-location') || el.getAttribute('data-js-map-pin-data');
    if (!locationAttr) return false;
    
    let locations = JSON.parse(locationAttr);
    if (!Array.isArray(locations)) {
        locations = [locations];
    }

    return locations;
}

export function getStaticDataFromContainer(el: HTMLElement) {

}

export function getMarkerDataFromElement(el: HTMLElement): Location[] {
    const json = getElementJSONLocation(el);
    const defaultValue: Location[] = [{lat: undefined, lng: undefined}]

    if (!json) { return defaultValue}
    
    let locationsArray: Location[] = [];
    json.forEach((location: any)  => {
        if (location !== null && typeof location === 'object' && 'lat' in location && 'lng' in location) {
            const lat = location.lat;
            const lng = location.lng;
            const tooltip = location.tooltip ?? false;
            const url = location.url ?? false;
            const icon = location.icon ?? false;
            const id = location.id ?? "";
    
            locationsArray.push({lat: lat, lng: lng, tooltip: tooltip, url: url, element: el, icon: icon, id: id});
        }
    });

    return locationsArray.length > 0 ? locationsArray : defaultValue;
}

