import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import 'leaflet.markercluster';
import ShowPost from './openstreetmap/showPost';
import ZoomMarkerClick from './openstreetmap/zoomMarkerClick';
import ZoomMarkerScroll from './openstreetmap/zoomMarkerScroll';
import AddMarkers from './openstreetmap/addMarkers';
import { getCoordinatesFromURLSearchParams, zoomToMarker } from './openstreetmap/helpers/osmHelpers';
import { MarkerElementObjects } from './openstreetmap/interface/interface';

class OpenStreetMap {
    container: HTMLElement;
    map: LeafletMap;
    markers: MarkerClusterGroup;

    constructor(container: HTMLElement) {
        this.container = container;
        const id = this.container.getAttribute('data-js-map-id') ?? "";

        this.map = L.map(`openstreetmap__map-${id}`, {
            scrollWheelZoom: false,
            keyboard: false,
        });

        this.markers = L.markerClusterGroup({
            maxClusterRadius: 50,
        });

        if (this.map && this.markers) this.init();
    }

    init() {
        this.observe();
        this.map.zoomControl.setPosition('bottomright');

        this.setMapView();
    }


    setMapView() {
        const startPositionAttr = this.container.getAttribute('data-js-map-start-position');
        const startPosition = JSON.parse(startPositionAttr ?? '');
        const tiles = this.getTilesStyle();
        const expand = this.container.querySelector('.c-openstreetmap__expand-icon');
        if (!startPosition.lat || !startPosition.lng || !startPosition.zoom) return;
        this.map.setView([startPosition.lat, startPosition.lng], startPosition.zoom);
        L.tileLayer(tiles?.url ? tiles.url : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: tiles?.attribution
                ? tiles.attribution
                : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);

        this.initializeFeatures(); 
        this.addKeyboardEventListeners();

        if (expand) {
            expand.addEventListener('click', () => {
                setTimeout(() => {
                    this.map.invalidateSize();
                }, 200);
            });
        }
    }

    initializeFeatures() {
        const AddMarkersInstance = new AddMarkers(this.map, this.markers as MarkerClusterGroup, this.container);
        const markerElementObjects = AddMarkersInstance.getMarkerElementObjects();
        this.zoomToMarkerOnLoad();
        new ShowPost(this.map, this.markers as MarkerClusterGroup, this.container);
        new ZoomMarkerClick(markerElementObjects as MarkerElementObjects[]);
        new ZoomMarkerScroll(this.map, this.markers as MarkerClusterGroup, markerElementObjects as MarkerElementObjects[]);
    }

    zoomToMarkerOnLoad() {
        const params = getCoordinatesFromURLSearchParams();
        if (!params || !this.markers) return;

        this.markers.getLayers().forEach(layer => {
            if (layer instanceof Marker) {
                const marker = layer as Marker;
                const latLng = marker.getLatLng();
                if (latLng && latLng.lat.toString() == params.lat && latLng.lng.toString() == params.lng) {
                    zoomToMarker(marker);
                }
            }
        });
    }

    getMarkersFromLayers() {
        return [...this.markers.getLayers()].filter(layer => layer instanceof L.Marker) as Marker<any>[];
    }

    addKeyboardEventListeners() {
        if (!this.markers || !this.map) return;
        const markers = this.getMarkersFromLayers();
        let currentMarker = 0;
        const attributions = this.container.querySelector('.leaflet-control-attribution');

        attributions?.querySelectorAll('a')?.forEach(attribution => {
            attribution.setAttribute('tabindex', '-1');
        });

        this.map.addEventListener('keydown', (e) => {
            const event = e.originalEvent;
            switch (event.key) {
                case 'ArrowDown':
                case 'ArrowLeft':
                    event.preventDefault();
                    currentMarker = (currentMarker - 1 + markers.length) % markers.length;
                    zoomToMarker(markers[currentMarker]);
                    break;

                case 'ArrowUp':
                case 'ArrowRight':
                    event.preventDefault();
                    currentMarker = (currentMarker + 1) % markers.length;
                    zoomToMarker(markers[currentMarker]);
                    break;

                case '+':
                    this.map.zoomIn();
                    break;

                case '-':
                    this.map.zoomOut();
                    break;
            }
        });
    }

    getTilesStyle() {
        let tiles = this.container.hasAttribute('data-js-map-style')
            ? this.container.getAttribute('data-js-map-style')
            : 'default';

        switch (tiles) {
            case 'dark':
                return {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                };
            case 'pale':
                return {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                };
            case 'default':
                return {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                };
            case 'color':
                return {
                    attribution:
                        'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                };
            default:
                return {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                };
        }
    }

    observe() {
        let mapContainer = this.container.querySelector('.c-openstreetmap__map');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((addedNode) => {
                        if (
                        addedNode instanceof HTMLElement &&
                        (addedNode.classList?.contains('c-openstreetmap__icon') || 
                        addedNode.classList?.contains('marker-cluster'))
                        ) {
                            addedNode.setAttribute('tabindex', '-1');
                        }
                    });
                }
            });
        });
        if (!mapContainer) return;
        observer.observe(mapContainer, { childList: true, subtree: true });
    }
}

export function initializeOpenStreetMaps() {
    const componentElements = [...document.querySelectorAll('.c-openstreetmap')];
    componentElements.forEach((element) => {
        new OpenStreetMap(element as HTMLElement);
    });
}

export default OpenStreetMap;