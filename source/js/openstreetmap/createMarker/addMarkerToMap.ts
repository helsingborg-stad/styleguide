import { getMarkerDataFromElement, pushCoordinatesToBrowserHistory, allLocations } from '../helpers/osmHelpers';
import L, { Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import { MarkerElementObjects, Location, Tooltip, Icon } from '../interface/interface';
import CreateMarker from './createMarker';
import CreateTooltip from './createTooltip';

class AddMarkerToMap {
    map: LeafletMap;
    markers: MarkerClusterGroup;
    container: HTMLElement;
    locations?: Location[];
    markerElementObjects: MarkerElementObjects[] = [];
    createMarker: CreateMarker;
    createTooltip: CreateTooltip;

    constructor(map: LeafletMap, markers: MarkerClusterGroup, container: HTMLElement) {
        this.markers = markers;
        this.container = container;
        this.map = map;
        this.locations = JSON.parse(this.container.getAttribute('data-js-map-pin-data') || '[]');
        this.createMarker = new CreateMarker(this.container);
        this.createTooltip = new CreateTooltip(this.container);

        this.addMarkersToMap();
    }

    private addMarkersToMap() {
        const locations = allLocations(this.container) ?? [];
        locations.forEach((location: Location) => {
            if (location.lat && location.lng) {
                let customIcon: Icon | undefined = undefined;
                if (location.icon) {
                    customIcon = location.icon;
                } 

                let marker = L.marker([location.lat, location.lng], {
                    icon: this.createMarker.create(customIcon),
                });
                if (location.tooltip) {
                    marker.bindPopup(this.createTooltip.create(location.tooltip), { maxWidth: 300 });
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
                this.markers.addLayer(marker);
                if (location.element) {
                    this.markerElementObjects.push({marker: marker, element: location.element});
                }
            }
        });
        this.markers.addTo(this.map);
    }

    public getMarkerElementObjects() {
        return this.markerElementObjects;
    }
}

export default AddMarkerToMap;