import L, { Map as LeafletMap, MarkerClusterGroup } from 'leaflet';
import { MarkerElementObjects, Location, Icon } from '../interface/interface';
import CreateMarker from '../createMarker/createMarker';
import CreateTooltip from '../createMarker/createTooltip';
import { zoomToMarker } from './zoomToMarker';

class AddMarkersFromLocations
{
    createMarker: CreateMarker;
    createTooltip: CreateTooltip;

    constructor(private map: LeafletMap, private markers: MarkerClusterGroup, private container: HTMLElement) {
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
                    marker.bindPopup(this.createTooltip.create(location.tooltip, location.id ?? null), { maxWidth: 300 });
                }

                marker.on('click', (e) => {
                    let latlng = e.latlng || e.sourceTarget?._latlng || false;
                    let zoomLevel = this.map?.getZoom() ?? 16;
                    if (latlng) {
                        if (zoomLevel >= 16) {
                            this.map?.setView(latlng);
                        } else {
                            this.map?.setView(latlng, 16);
                        }
                    }
                });
                this.markers?.addLayer(marker);

                location.element?.addEventListener('click', () => {
                    zoomToMarker(marker);
                });
            }
        });
        this.markers?.addTo(this.map as LeafletMap);
    }
}

export default AddMarkersFromLocations;