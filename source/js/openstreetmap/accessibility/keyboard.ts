import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import { getMarkersFromLayers } from '../map/mapHelpers';
import { zoomToMarker } from '../map/zoomToMarker';

export function keyboard(container: HTMLElement, map: LeafletMap, markersInLayers: MarkerClusterGroup): void {
    let markers = getMarkersFromLayers(markersInLayers);

    let currentMarker = 0;
    const attributions = container.querySelector('.leaflet-control-attribution');

    attributions?.querySelectorAll('a')?.forEach(attribution => {
        attribution.setAttribute('tabindex', '-1');
    });

    map.addEventListener('keydown', (e) => {
        const event = e.originalEvent;
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowLeft':
                markers = getMarkersFromLayers(markersInLayers);
                event.preventDefault();
                currentMarker = (currentMarker - 1 + markers.length) % markers.length;
                zoomToMarker(markers[currentMarker]);
                break;

            case 'ArrowUp':
            case 'ArrowRight':
                markers = getMarkersFromLayers(markersInLayers);
                event.preventDefault();
                currentMarker = (currentMarker + 1) % markers.length;
                zoomToMarker(markers[currentMarker]);
                break;

            case '+':
                map.zoomIn();
                break;

            case '-':
                map.zoomOut();
                break;
        }
    });
}