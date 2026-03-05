import { CreateAttribution, CreateMap, CreateMarker, CreatePopup, CreateTileLayer, MapInterface, TilesHelper } from '@helsingborg-stad/openstreetmap';
import { OpenstreetmapArgs } from './openstreetmapInterface';
import Marker from './marker';

class Openstreetmap {
    private map!: MapInterface;

    /**
     * Creates an Openstreetmap instance and initializes the map.
     *
     * @param openstreetmapArgs - Verified configuration for the map.
     */
    constructor(private openstreetmapArgs: OpenstreetmapArgs) {
        this.createMap();
    }

    /**
     * Creates the map instance, attaches the tile layer, attribution, and
     * renders all configured markers onto the map.
     */
    private createMap() {
        this.map = new CreateMap({
            id: this.openstreetmapArgs.id,
            center: { lat: this.openstreetmapArgs.lat, lng: this.openstreetmapArgs.lng },
            zoom: this.openstreetmapArgs.zoom,
        }).create();

        const { url, attribution } = new TilesHelper().getDefaultTiles(this.openstreetmapArgs.style);
        const markerCreator = new Marker(new CreateMarker(), new CreatePopup());
        new CreateTileLayer().create().setUrl(url).addTo(this.map);
        new CreateAttribution().create().setPrefix(attribution).addTo(this.map);

        for (const markerConfig of this.openstreetmapArgs.markers) {
            const marker = markerCreator.create(markerConfig);
            marker.addTo(this.map);
        }
    }
}

export default Openstreetmap;