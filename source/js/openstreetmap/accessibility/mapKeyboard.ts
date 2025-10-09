import L, { Layer, Map as LeafletMap, Marker } from 'leaflet';
// import { getMarkersFromLayers } from '../map/mapHelpers';
import ZoomMarker from '../map/zoomMarker';

export function mapKeyboard(
    container: HTMLElement, 
    map: LeafletMap, 
    markers: Marker[], 
    zoomMarker: ZoomMarker
): void {
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
                event.preventDefault();
                currentMarker = (currentMarker - 1 + markers.length) % markers.length;
                zoomMarker.zoom(markers[currentMarker]);
                break;
            case 'ArrowUp':
            case 'ArrowRight':
                event.preventDefault();
                currentMarker = (currentMarker + 1) % markers.length;
                zoomMarker.zoom(markers[currentMarker]);
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