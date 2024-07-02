import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import { getTiles } from '../helpers/tiles';

class SetMapTiles {
    constructor(private container: HTMLElement, private map: LeafletMap) {
        this.set();
    }

    private set(): void {
        const tiles = getTiles(this.container);
        L.tileLayer(tiles?.url ? tiles.url : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: tiles?.attribution
                ? tiles.attribution
                : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);
    }
}

export default SetMapTiles;