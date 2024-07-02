import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';

export function zoomToMarker(marker: Marker | undefined, map: LeafletMap | undefined = undefined, markers: MarkerClusterGroup | undefined = undefined) {
    if (marker && (marker as any).__parent) {

        if (map && markers) {
            markers.zoomToShowLayer(marker, function () {
                console.log("runs");
                map.flyTo(marker.getLatLng(), 16, {
                    animate: true,
                    duration: 1
                });
            });
        }
        
        setTimeout(function () {
            marker.openPopup();
        }, 300);
    }
}