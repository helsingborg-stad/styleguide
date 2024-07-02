import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';

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

export function getMarkersFromLayers(markers: MarkerClusterGroup): Marker<any>[]{
    return [...markers.getLayers()].filter(layer => layer instanceof L.Marker) as Marker<any>[];
}