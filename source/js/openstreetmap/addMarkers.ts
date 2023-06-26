import { getMarkerDataFromElement, pushCoordinatesToBrowserHistory } from './helpers/osmHelpers';
import L, { Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import { MarkerElementObjects, Location, Tooltip, Icon } from './interface/interface';

class AddMarkers {
    map: LeafletMap;
    markers: MarkerClusterGroup;
    container: HTMLElement;
    locations?: Location[];
    markerElementObjects?: MarkerElementObjects[];

    constructor(map: LeafletMap, markers: MarkerClusterGroup, container: HTMLElement) {
        this.markers = markers;
        this.container = container;
        this.map = map;
        this.locations = JSON.parse(this.container.getAttribute('data-js-map-pin-data') || '[]');
        this.markerElementObjects = [];

        this.addMarkersToMap();
    }
    
    private getAllLocations() {
        let locations = this.locations ?? [];
        const sidebar = this.container?.querySelector('.c-openstreetmap__sidebar');

        if (!sidebar) return;
        const placeElements = sidebar.querySelectorAll('[data-js-map-location]');
        
        placeElements.forEach(element => {
            locations.push(getMarkerDataFromElement(element as HTMLElement));
        });
        
        return locations;
    }

    private addMarkersToMap() {
        const locations = this.getAllLocations() ?? [];
        locations.forEach((location, index) => {
            if (location?.lat && location?.lng) {
                let customIcon: Icon | undefined = undefined;
                if (location?.icon) {
                    customIcon = location.icon;
                } 

                let marker = L.marker([location.lat, location.lng], {
                    icon: this.createMarker(customIcon),
                    // url: { lat: location.lat, lng: location.lng },
                    // id: `${'marker' + index}`,
                });
                if (location.tooltip) {
                    marker.bindPopup(this.createTooltip(location.tooltip), { maxWidth: 300 });
                }
                marker.on('click', (e) => {
                    let latlng = e.latlng
                        ? e.latlng
                        : e.sourceTarget?._latlng
                            ? e.sourceTarget?._latlng
                            : false;
                    let zoomLevel = this.map?.getZoom() ?? 16;
                    if (latlng) {
                        if (zoomLevel >= 16) {
                            this.map?.setView(latlng);
                        } else {
                            this.map?.setView(latlng, 16);
                        }
                    }
                    pushCoordinatesToBrowserHistory({ lat: location.lat, lng: location.lng });
                });
                this.markers?.addLayer(marker);
                if (location.element) {
                    this.markerElementObjects?.push({marker: marker, element: location.element});
                }
            }
        });
        this.markers?.addTo(this.map as LeafletMap);
    }

    private createMarker(customIcon: Icon | undefined) {
        let template = this.container?.querySelector('.c-openstreetmap__pin-icon');
        let html = template?.innerHTML;
        let icon = customIcon?.icon ? customIcon.icon : 'location_on';
        let color = customIcon?.backgroundColor
            ? customIcon.backgroundColor
            : this.getPrimaryColor();
        
            if (!html) return;
        html = html
            .replace('{icon-name}', icon as string)
            .replaceAll('{ICON_NAME}', icon as string)
            .replace('{ICON_BACKGROUND_COLOR}', color as string);
        let marker = L.divIcon({
            className: 'c-openstreetmap__icon',
            html: html,
        });

        return marker;
    }

    private createTooltip(tooltip: Tooltip) {
        let template = this.container?.querySelector('.c-openstreetmap__pin-tooltip');
        let clone = template?.cloneNode(true) as HTMLTemplateElement;

        if (!tooltip.image?.src) {
            const figure = clone.content.querySelector('figure');
            if (figure) {
                figure.remove();
            }
        }

        if (!tooltip.url) {
            let link = clone.content.querySelector('.c-openstreetmap__tooltip-link');
            let title = clone.content.querySelector('.c-openstreetmap__tooltip-title');
            const parent = link?.parentNode;

            if (parent && title && link) {
                parent.insertBefore(title, link);
                link.remove();
            }
        }
        let html = clone.innerHTML;
        html = html
            .replace('{TOOLTIP_HEADING}', tooltip.title ? tooltip.title as string : '')
            .replace('{TOOLTIP_DIRECTIONS_URL}', tooltip.directions?.url ? tooltip.directions.url as string : '')
            .replace('{TOOLTIP_DIRECTIONS_LABEL}', tooltip.directions?.label ? tooltip.directions.label as string : '')
            .replace('{TOOLTIP_EXCERPT}', tooltip.excerpt ? tooltip.excerpt as string : '')
            .replace('{TOOLTIP_IMAGE_SRC}', tooltip.image?.src ? tooltip.image.src as string : '')
            .replace('{TOOLTIP_IMAGE_ALT}', tooltip.image?.alt ? tooltip.image.alt as string : '')
            .replace('{TOOLTIP_LINK}', tooltip.url ? tooltip.url as string : '');
        return html;
    }

    public getMarkerElementObjects() {
        return this.markerElementObjects;
    }

    private getPrimaryColor() {
        let color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
        return color ? color : '#ae0b05';
    }
}

export default AddMarkers;