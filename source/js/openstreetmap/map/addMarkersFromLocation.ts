import L, { Map as LeafletMap, Marker } from 'leaflet';
import { Location, Icon } from '../interface/interface';
import CreateMarker from '../createMarker/createMarker';
import CreateTooltip from '../createMarker/createTooltip';
import PostMarkerPairs from '../post/postMarkerPairs';
import { getMarkerDataFromElement } from '../helpers/osmHelpers';

class AddMarkersFromLocations
{
    constructor(
        private container: HTMLElement, 
        private map: LeafletMap,
        private markers: Marker[] = [],
        private postMarkerPairs: PostMarkerPairs,
        private createMarker: CreateMarker,
        private createTooltip: CreateTooltip
    ) {
    this.add(getMarkerDataFromElement(this.container));
    }
    
    public add(locations: Location[]) {
        locations.forEach((location: Location) => {
            if (location?.lat && location?.lng) {
                let customIcon: Icon | undefined = location?.icon ? location.icon : undefined;
                let marker = L.marker([location.lat, location.lng], {
                    icon: this.createMarker.create(customIcon),
                });
                if (location.tooltip) {
                    marker.bindPopup(this.createTooltip.create(location.tooltip, location.id ?? null), { maxWidth: 200 });
                }
                marker.on('click', (e) => {
                    let latlng = e.latlng || e.sourceTarget?._latlng || false;
                    let zoomLevel = this.map?.getZoom() ?? 16;
                    if (latlng) {
                        this.map?.setView(latlng, zoomLevel >= 16 ? zoomLevel : 16);
                    }
                });
                marker.addTo(this.map);
                this.markers.push(marker);
                this.addMarkerPostPair(marker, location?.element, location?.id);
            }
        });
    }

    private addMarkerPostPair(marker: Marker|null, post: HTMLElement|undefined, id: string|undefined) {
        if (marker && post) {
            this.postMarkerPairs.set({post: post, marker: marker, id: id});
        }
    }
}

export default AddMarkersFromLocations;