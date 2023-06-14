import { getMarkerDataFromElement, pushCoordinatesToBrowserHistory } from './helpers/osmHelpers';

class AddMarkers {
    constructor(map, markers, container) {
        if (!map || !markers || !container) return;
        this.markers = markers;
        this.container = container;
        this.map = map;
        this.locations = JSON.parse(this.container.getAttribute('data-js-map-pin-data')) ?? [];
        this.markerElementPairs = [];

        this.addMarkersToMap();
    }

    getAllLocations() {
        let locations = this.locations;
        const sidebar = this.container.querySelector('.c-openstreetmap__sidebar');
        const placeElements = sidebar.querySelectorAll('[data-js-map-location]');
        
        placeElements.forEach(element => {
            locations.push(getMarkerDataFromElement(element));
        });
        
        return locations;
    }

    addMarkersToMap() {
        const locations = this.getAllLocations();

        locations.forEach((location, index) => {
            if (location?.lat && location?.lng) {
                let customIcon = false;
                if (location?.icon) {
                    customIcon = location.icon;
                }
                let marker = L.marker([location.lat, location.lng], {
                    icon: this.createMarker(customIcon),
                    url: { lat: location.lat, lng: location.lng },
                    id: `${'marker' + index}`,
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
                    let zoomLevel = this.map.getZoom();
                    if (latlng) {
                        if (zoomLevel >= 16) {
                            this.map.setView(latlng);
                        } else {
                            this.map.setView(latlng, 16);
                        }
                    }
                    pushCoordinatesToBrowserHistory({ lat: location.lat, lng: location.lng });
                });
                this.markers.addLayer(marker);
                if (location.element) {
                    this.markerElementPairs.push({marker: marker, element: location.element});
                }
            }
        });
        this.markers.addTo(this.map);
    }

    createMarker(customIcon) {
        let template = this.container.querySelector('.c-openstreetmap__pin-icon');
        let html = template.innerHTML;
        let icon = customIcon?.icon ? customIcon.icon : 'location_on';
        let color = customIcon.backgroundColor
            ? customIcon.backgroundColor
            : this.getPrimaryColor();
        html = html
            .replace('{icon-name}', icon)
            .replaceAll('{ICON_NAME}', icon)
            .replace('{ICON_BACKGROUND_COLOR}', color);
        let marker = L.divIcon({
            className: 'c-openstreetmap__icon',
            html: html,
        });

        return marker;
    }

    createTooltip(tooltip) {
        let template = this.container.querySelector('.c-openstreetmap__pin-tooltip');
        let clone = template.cloneNode(true);

        if (!tooltip.image?.src && clone.content.querySelector('figure')) {
            clone.content.querySelector('figure').remove();
        }

        if (!tooltip.url) {
            let link = clone.content.querySelector('.c-openstreetmap__tooltip-link');
            let title = clone.content.querySelector('.c-openstreetmap__tooltip-title');

            link.parentNode.insertBefore(title, link);
            link.remove();
        }
        let html = clone.innerHTML;
        html = html
            .replace('{TOOLTIP_HEADING}', tooltip.title ? tooltip.title : '')
            .replace('{TOOLTIP_DIRECTIONS_URL}', tooltip.directions?.url ? tooltip.directions.url : '')
            .replace('{TOOLTIP_DIRECTIONS_LABEL}', tooltip.directions?.label ? tooltip.directions.label : '')
            .replace('{TOOLTIP_EXCERPT}', tooltip.excerpt ? tooltip.excerpt : '')
            .replace('{TOOLTIP_IMAGE_SRC}', tooltip.image?.src ? tooltip.image.src : '')
            .replace('{TOOLTIP_IMAGE_ALT}', tooltip.image?.alt ? tooltip.image.alt : '')
            .replace('{TOOLTIP_LINK}', tooltip.url ? tooltip.url : '');
        return html;
    }

    markerElementObjects() {
        return this.markerElementPairs;
    }

    getPrimaryColor() {
        let color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
        return color ? color : '#ae0b05';
    }
}

export default AddMarkers;