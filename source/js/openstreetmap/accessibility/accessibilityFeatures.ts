import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import { keyboard } from './keyboard';
import { removeClusterGroupTabIndex } from './removeClusterGroupTabIndex';

class AccessibilityFeatures {
    constructor(private container: HTMLElement, private map: LeafletMap, private markers: MarkerClusterGroup) {
        keyboard(this.container, this.map, this.markers);
        removeClusterGroupTabIndex(this.container);

    }
}

export default AccessibilityFeatures;