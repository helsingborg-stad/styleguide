import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';

export function zoomToMarker(marker: Marker | undefined) {
    if (marker && (marker as any).__parent) {
        const cluster = (marker as any).__parent;
        let hasMoreThanOnePin = true;

        if (hasMoreThanOnePin) {
            cluster.zoomToBounds();
        } 
        
        setTimeout(function () {
            marker.openPopup();
        }, 300);
    }
}