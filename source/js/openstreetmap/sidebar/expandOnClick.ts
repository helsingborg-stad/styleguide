import { invalidateSize } from "../map/mapHelpers";
import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';

class ExpandOnClick {
    constructor(private container: HTMLElement, private map: LeafletMap, private baseClass: string) {

    }

    setupExpandClick() {
        const expand = this.container.querySelector(`.${this.baseClass}__expand-icon`);

        expand?.addEventListener('click', () => {
            invalidateSize(this.map);
        });
    }
}

export default ExpandOnClick;