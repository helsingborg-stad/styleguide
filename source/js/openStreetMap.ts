import InitializeOsm from './openstreetmap/map/initializeMap';
import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import ShowPost from './openstreetmap/sidebar/showPost';
import ZoomMarkerClick from './openstreetmap/zoomEvents/zoomMarkerClick';
import ZoomMarkerScroll from './openstreetmap/zoomEvents/zoomMarkerScroll';
import ZoomMarkerParams from './openstreetmap/zoomEvents/zoomMarkerParams';
import AddMarkerToMap from './openstreetmap/createMarker/addMarkerToMap';
import Sidebar from './openstreetmap/sidebar/sidebarFeatures'; 
import { MarkerElementObjects } from './openstreetmap/interface/interface';
import FetchEndpointPosts from './openstreetmap/api/fetchEndpointPosts';
import AddEndpointPosts from './openstreetmap/addEndpointPosts';
import SetMapTiles from './openstreetmap/map/setMapTiles';
import { setView, invalidateSize } from './openstreetmap/map/mapHelpers';
import AccessibilityFeatures from './openstreetmap/accessibility/accessibilityFeatures';

class OpenStreetMap {
    settings: {
        endpoint: string;
        startposition: string;
    }

    constructor(private container: HTMLElement) {
        this.settings = this.getSettings();
        const initializeMapInstance = new InitializeOsm(this.container);
        const [map, markers] = initializeMapInstance.create();

        if (map && markers) {
            this.setupMap(map, markers);
            this.setupFeatures(map, markers);
        }
    }

    private setupMap(map: LeafletMap, markers: MarkerClusterGroup) {
        new SetMapTiles(this.container, map);
        setView(map, JSON.parse(this.settings.startposition));
        map.zoomControl.setPosition('bottomright');
        invalidateSize(map);
    }

    private setupFeatures(map: LeafletMap, markers: MarkerClusterGroup) {
        // this.observe();
        new Sidebar(this.container, map);
        new AddEndpointPosts(this.container, map, markers);
        new FetchEndpointPosts(this.container, this.settings.endpoint);
        const AddMarkersInstance = new AddMarkerToMap(map, markers, this.container);
        const markerElementObjects = AddMarkersInstance.getMarkerElementObjects();
        new ShowPost(map, markers, this.container);
        new ZoomMarkerParams(this.container, markers);
        new ZoomMarkerClick(markerElementObjects as MarkerElementObjects[]);
        new ZoomMarkerScroll(map, markers, markerElementObjects as MarkerElementObjects[]);
        new AccessibilityFeatures(this.container, map, markers);
    }

    private getSettings() {
        return {
            endpoint: this.container.getAttribute('data-js-map-posts-endpoint') ?? '',
            startposition: this.container.getAttribute('data-js-map-start-position') ?? ''
        };
    }

//     observe() {
//         const mapContainer = this.container.querySelector('.c-openstreetmap__map');
//         const observer = new MutationObserver((mutations) => {
//             mutations.forEach((mutation) => {
//                 if (mutation.type === 'childList') {
//                     mutation.addedNodes.forEach((addedNode) => {
//                         if (
//                         addedNode instanceof HTMLElement &&
//                         (addedNode.classList?.contains('c-openstreetmap__icon') || 
//                         addedNode.classList?.contains('marker-cluster'))
//                         ) {
//                             addedNode.setAttribute('tabindex', '-1');
//                         }
//                     });
//                 }
//             });
//         });
//         if (!mapContainer) return;
//         observer.observe(mapContainer, { childList: true, subtree: true });
//     }
}

export function initializeOpenStreetMaps() {
    const componentElements = [...document.querySelectorAll('.c-openstreetmap')];
    componentElements.forEach((element) => {
        new OpenStreetMap(element as HTMLElement);
    });
}

export default OpenStreetMap;