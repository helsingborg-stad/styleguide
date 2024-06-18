import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import 'leaflet.markercluster';
import ShowPost from './openstreetmap/sidebar/showPost';
import ZoomMarkerClick from './openstreetmap/zoomEvents/zoomMarkerClick';
import ZoomMarkerScroll from './openstreetmap/zoomEvents/zoomMarkerScroll';
import ZoomMarkerParams from './openstreetmap/zoomEvents/zoomMarkerParams';
import AddMarkerToMap from './openstreetmap/createMarker/addMarkerToMap';
import Sidebar from './openstreetmap/sidebar/sidebarFeatures'; 
import { MarkerElementObjects } from './openstreetmap/interface/interface';
import FetchEndpointPosts from './openstreetmap/api/fetchEndpointPosts';
import AddEndpointPosts from './openstreetmap/addEndpointPosts';
import InitializeOsm from './openstreetmap/map/initializeMap';
import SetMapTiles from './openstreetmap/map/setMapTiles';
import { setView, invalidateSize } from './openstreetmap/map/mapHelpers';
import AccessibilityFeatures from './openstreetmap/accessibility/accessibilityFeatures';

class OpenStreetMap {
    map: LeafletMap;
    markers: MarkerClusterGroup;
    // settings: {
    //     endpoint: string;
    //     startposition: string;
    // }

    constructor(private container: HTMLElement) {
        // this.settings = this.getSettings();
        const initializeMap = new InitializeOsm(this.container);
        const [map, markers] = initializeMap.start();

        this.map = map;
        this.markers = markers;

        if (this.map && this.markers) this.init();
    }

    private init() {
        // if (this.container.hasAttribute('data-js-map-posts-endpoint')) {
            new AddEndpointPosts(this.container, this.map, this.markers);
            new FetchEndpointPosts(this.container, this.container.getAttribute('data-js-map-posts-endpoint') as string);
        // }

        // this.observe();
        this.map.zoomControl.setPosition('bottomright');

        this.setMapView();
    }

    private getSettings() {
    
    }


    setMapView() {
        setView(this.map, JSON.parse(this.container.getAttribute('data-js-map-start-position') ?? ''));
        new SetMapTiles(this.container, this.map);
        this.initializeFeatures(); 
        new AccessibilityFeatures(this.container, this.map, this.markers);
        invalidateSize(this.map);
    }

    initializeFeatures() {
        new Sidebar(this.container, this.map);
        const AddMarkersInstance = new AddMarkerToMap(this.map, this.markers, this.container);
        const markerElementObjects = AddMarkersInstance.getMarkerElementObjects();
        new ShowPost(this.map, this.markers, this.container);
        new ZoomMarkerParams(this.container, this.markers);
        new ZoomMarkerClick(markerElementObjects as MarkerElementObjects[]);
        new ZoomMarkerScroll(this.map, this.markers, markerElementObjects as MarkerElementObjects[]);
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