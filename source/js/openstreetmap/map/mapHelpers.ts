import L, { Layer, Map as LeafletMap, Marker } from 'leaflet';

export function invalidateSize(map: LeafletMap) {
    setTimeout(() => {
        map.invalidateSize();
    }, 200);
}

export function setView(map: LeafletMap, location: { lat: number, lng: number, zoom: number }) {
    if (location.lat && location.lng && location.zoom) {
        map.setView([location.lat, location.lng], location.zoom);
    }
}