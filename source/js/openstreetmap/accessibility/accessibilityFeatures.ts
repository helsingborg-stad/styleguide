import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import { keyboard } from './keyboard';

class AccessibilityFeatures {
    constructor(private container: HTMLElement, private map: LeafletMap, private markers: MarkerClusterGroup) {
        keyboard(this.container, this.map, this.markers);
    }
}

export default AccessibilityFeatures;