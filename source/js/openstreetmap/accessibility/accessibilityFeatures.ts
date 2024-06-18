import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';

class AccessibilityFeatures {
    constructor(private container: HTMLElement, private map: LeafletMap, private markers: MarkerClusterGroup) {
        
    }
}

export default AccessibilityFeatures;