import InitializeOsm from './openstreetmap/map/initializeMap';
import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import ZoomParams from './openstreetmap/zoomEvents/zoomParams';
import AddMarkersFromLocation from './openstreetmap/map/addMarkersFromLocation';
import Sidebar from './openstreetmap/sidebar/sidebarFeatures'; 
import FetchEndpointPosts from './openstreetmap/api/fetchEndpointPosts';
import AddEndpointPosts from './openstreetmap/post/addEndpointPosts';
import SetMapTiles from './openstreetmap/map/setMapTiles';
import { setView, invalidateSize } from './openstreetmap/map/mapHelpers';
import AccessibilityFeatures from './openstreetmap/accessibility/accessibilityFeatures';
import PostAdded from './openstreetmap/post/postAdded';
import ZoomClick from './openstreetmap/zoomEvents/zoomClick';
import PostMarkerPairs from './openstreetmap/post/postMarkerPairs';
import CreateMarker from './openstreetmap/createMarker/createMarker';
import CreateTooltip from './openstreetmap/createMarker/createTooltip';

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
        const createMarkerInstance = new CreateMarker(this.container);
        const createTooltipInstance = new CreateTooltip(this.container);
        const postMarkerPairsInstance = new PostMarkerPairs(this.container);
        const accessibilityFeaturesInstance = new AccessibilityFeatures(this.container, map, markers);
        const sidebarInstance = new Sidebar(this.container, map);
        const zoomParamsInstance = new ZoomParams(this.container);
        const zoomClickInstance = new ZoomClick(this.container);
        const addMarkersFromLocationInstance = new AddMarkersFromLocation(
            this.container, 
            map, 
            markers, 
            postMarkerPairsInstance,
            createMarkerInstance,
            createTooltipInstance
        );
        const postAddedInstance = new PostAdded(this.container, addMarkersFromLocationInstance);
        const addEndpointPostsInstance = new AddEndpointPosts(this.container, map, markers);
        const fetchEndpointPostsInstance = new FetchEndpointPosts(this.container, this.settings.endpoint);
    }

    private getSettings() {
        return {
            endpoint: this.container.getAttribute('data-js-map-posts-endpoint') ?? '',
            startposition: this.container.getAttribute('data-js-map-start-position') ?? ''
        };
    }
}

export function initializeOpenStreetMaps() {
    const componentElements = [...document.querySelectorAll('.c-openstreetmap')];
    componentElements.forEach((element) => {
        new OpenStreetMap(element as HTMLElement);
    });
}

export default OpenStreetMap;