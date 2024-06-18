import L, { Map as LeafletMap, MarkerClusterGroup } from 'leaflet';
import { pushCoordinatesToBrowserHistory } from '../helpers/osmHelpers';
import { MarkerElementObjects, Location, Icon } from '../interface/interface';
import CreateMarker from '../createMarker/createMarker';
import CreateTooltip from '../createMarker/createTooltip';

class AddMarkersFromLocations
{
    map: LeafletMap;
    markers: MarkerClusterGroup;
    container: HTMLElement;
    markerElementObjects?: MarkerElementObjects[];
    createMarker: CreateMarker;
    createTooltip: CreateTooltip;

    constructor(map: LeafletMap, markers: MarkerClusterGroup, container: HTMLElement) {
        this.markers = markers;
        this.container = container;
        this.map = map;
        this.markerElementObjects = [];
        this.createMarker = new CreateMarker(this.container);
        this.createTooltip = new CreateTooltip(this.container);
    }
    
    public add(locations: Location[]) {
        locations.forEach((location: Location) => {
            if (location?.lat && location?.lng) {
                let customIcon: Icon | undefined = undefined;
                if (location?.icon) {
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
                this.markers?.addLayer(marker);
                if (location.element) {
                    this.markerElementObjects?.push({marker: marker, element: location.element});
                }
            }
        });
        this.markers?.addTo(this.map as LeafletMap);
    }
}

export default AddMarkersFromLocations;