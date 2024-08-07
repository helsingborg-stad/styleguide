import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import { mapKeyboard } from './mapKeyboard';
import { removeClusterGroupTabIndex } from './removeClusterGroupTabIndex';
import ZoomMarker from '../map/zoomMarker';
import { postKeyboard } from './postKeyboard';

class AccessibilityFeatures {
    constructor(container: HTMLElement, map: LeafletMap, markers: MarkerClusterGroup, zoomMarker: ZoomMarker, baseClass: string) {
        mapKeyboard(container, map, markers, zoomMarker);
        postKeyboard(container, baseClass);
        removeClusterGroupTabIndex(container);

    }
}

export default AccessibilityFeatures;