import L from 'leaflet';
import 'leaflet.markercluster';

class OpenStreetMap {
    constructor(container) {
        this.container = container;
        let map = false;
        let id = this.container.getAttribute('data-js-map-id') ?? false;
        this.markers = false;
        
        if (this.container && id) {
            map = L.map(`openstreetmap__map-${id}`);
            this.markers = L.markerClusterGroup({
                maxClusterRadius: 50
            });
            
            window.leafletClusters = window.leafletClusters || {};
            window.leafletClusters[`${id}`] = this.markers;
            window.leafletMap = map;
        }

        (this.container && map && this.markers) ? this.init(map) : '';
    }

    init(map) {
        if (!this.container.hasAttribute('js-map-pin-data') || !this.container.hasAttribute('js-map-start-position')) {
            return;
        }

        let startPosition = JSON.parse(this.container.getAttribute('js-map-start-position'));
        let locations = JSON.parse(this.container.getAttribute('js-map-pin-data'));
        let tiles = this.getTilesStyle(this.container);
        this.setMapView(locations, startPosition, tiles, map);
    }

    setMapView(locations, startPosition, tiles, map) {
        let expand = this.container.querySelector('.c-openstreetmap__expand-icon');
        map.setView([startPosition.lat, startPosition.lng], startPosition.zoom);
        L.tileLayer(tiles?.url ? tiles.url : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: tiles?.attribution ? tiles.attribution : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        locations.forEach(location => {
            if (location?.lat && location?.lng) {
                let customIcon = false;
                if (location?.icon) {
                    customIcon = location.icon;
                }
                let marker = L.marker([location.lat, location.lng], { icon: this.createMarker(customIcon) });
                if (location.tooltip) {
                    marker.bindPopup(this.createTooltip(location.tooltip));
                }
                marker.on('click', (e) => {
                    let latlng = e.latlng ? e.latlng : (e.sourceTarget?._latlng ? e.sourceTarget?._latlng : false);
                    let zoomLevel = map.getZoom();
                    if (latlng) {
                        if (zoomLevel >= 16) {
                            map.setView(latlng);
                        } else {
                            map.setView(latlng, 16);
                        }
                    }
                });
                this.markers.addLayer(marker);
            }
        });
        this.markers.addTo(map);

        /* TODO: makes it a little jumpy but centers the map correctly based on the users */
        if (expand) {
            expand.addEventListener('click', () => {
                setTimeout(function () {
                    map.invalidateSize();
                }, 200);

            });
        }
    }

    getPrimaryColor() {
        let color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
        return color ? color : '#ae0b05';
    }

    createMarker(customIcon) {
        let template = this.container.querySelector('.c-openstreetmap__pin-icon');
        let html = template.innerHTML;
        let icon = customIcon?.icon ? customIcon.icon : 'location_on';
        let color = customIcon.backgroundColor ? customIcon.backgroundColor : this.getPrimaryColor();
        html = html.replace('{icon-name}', icon).replaceAll('{ICON_NAME}', icon).replace('{ICON_BACKGROUND_COLOR}', color);
        let marker = L.divIcon({
            className: 'openstreetmap__icon',
            html: html
        });


        return marker;
    }

    createTooltip(tooltip) {
        let template = this.container.querySelector('.c-openstreetmap__pin-tooltip');
        let html = template.innerHTML;

        html = html.replace('{TOOLTIP_HEADING}', tooltip.title).replace('{TOOLTIP_DIRECTIONS_URL}', tooltip.direction.url).replace('{TOOLTIP_DIRECTIONS_LABEL}', tooltip.direction.label);
        return html;
    }

    getTilesStyle(container) {
        let tiles = container.hasAttribute('js-map-style') ? container.getAttribute('js-map-style') : 'default';

        switch (tiles) {
            case 'dark':
                return { 'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', 'url': 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' };
            case 'pale':
                return { 'attribution': '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributor', 'url': 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png' };
            case 'default':
                return {
                    'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', 'url': 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                };
            case 'color':
                return {
                    'attribution': 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community', 'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
                };
            default:
                return {
                    'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', 'url': 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                };
        }
    }
}

export function initializeOpenStreetMaps() {
    const componentElements = [...document.querySelectorAll('.c-openstreetmap')];

    componentElements.forEach((element) => {
        new OpenStreetMap(element);
    })
}

export default OpenStreetMap;