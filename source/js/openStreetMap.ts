import InitializeOsm from './openstreetmap/map/initializeMap';
import L, { Layer, Map as LeafletMap, Marker } from 'leaflet';
import AddMarkersFromLocation from './openstreetmap/map/addMarkersFromLocation';
import ObserveSize from './openstreetmap/sidebar/observeSize';
import ExpandOnClick from './openstreetmap/sidebar/expandOnClick';
import FetchEndpointPosts from './openstreetmap/api/fetchEndpointPosts';
import AddEndpointPosts from './openstreetmap/post/addEndpointPosts';
import SetMapTiles from './openstreetmap/map/setMapTiles';
import { setView, invalidateSize } from './openstreetmap/map/mapHelpers';
import AccessibilityFeatures from './openstreetmap/accessibility/accessibilityFeatures';
import ZoomMarker from './openstreetmap/map/zoomMarker';
import PostAdded from './openstreetmap/post/postAdded';
import PostMarkerPairs from './openstreetmap/post/postMarkerPairs';
import CreateMarker from './openstreetmap/createMarker/createMarker';
import CreateTooltip from './openstreetmap/createMarker/createTooltip';
import ShowIfNotEmpty from './openstreetmap/sidebar/showIfNotEmpty';
import ShowPost from './openstreetmap/sidebar/showPost';
import TooltipListener from './openstreetmap/sidebar/tooltipListener';
import HandlePostsLoadingSpinner from './openstreetmap/sidebar/handlePostsLoadingSpinner';

class OpenStreetMap {
    settings: {
        endpoint: string;
        startposition: string;
    }

    private baseClass: string = 'c-openstreetmap';

    constructor(private container: HTMLElement) {
        this.settings = this.getSettings();
        const initializeMapInstance = new InitializeOsm(this.container);
        const [map, markers] = initializeMapInstance.create();
        if (map && markers) {
            this.setupMap(map);
            this.setupFeatures(map, markers);
        }
    }

    private setupMap(map: LeafletMap) {
        new SetMapTiles(this.container, map);
        setView(map, JSON.parse(this.settings.startposition));
        map.zoomControl.setPosition('bottomright');
        invalidateSize(map);
    }

    private setupFeatures(map: LeafletMap, markers: Marker[]) {
        const zoomMarkerInstance = new ZoomMarker(map, markers);
        const handlePostsLoadingSpinnerInstance = new HandlePostsLoadingSpinner(this.container);
        const createMarkerInstance = new CreateMarker(this.container);
        const createTooltipInstance = new CreateTooltip(this.container);
        const expandOnClickInstance = new ExpandOnClick(this.container, map, this.baseClass);
        const showPostInstance = new ShowPost(this.container, map, this.baseClass, zoomMarkerInstance);
        const showIfNotEmptyInstance = new ShowIfNotEmpty(this.container, this.baseClass);
        const observeSizeInstance = new ObserveSize(this.container, this.baseClass);
        const tooltipListenerInstance = new TooltipListener(this.container, map, markers);
        const postMarkerPairsInstance = new PostMarkerPairs(this.container);
        const accessibilityFeaturesInstance = new AccessibilityFeatures(this.container, map, markers, zoomMarkerInstance, this.baseClass);

        const addMarkersFromLocationInstance = new AddMarkersFromLocation(
            this.container,
            map,
            markers,
            postMarkerPairsInstance,
            createMarkerInstance,
            createTooltipInstance
        );
        const postAddedInstance = new PostAdded(this.container, addMarkersFromLocationInstance);
        const addEndpointPostsInstance = new AddEndpointPosts(this.container, map);
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