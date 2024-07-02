import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import { invalidateSize } from "../map/mapHelpers";

class ExpandOnClick {
    expandButton: HTMLElement | null;
    constructor(private container: HTMLElement, private map: LeafletMap, private baseClass: string) {
        this.expandButton = this.container.querySelector(`.${this.baseClass}__expand-icon`);

        if (this.expandButton) {
            this.setupExpandClick();
        }
    }

    private setupExpandClick() {
        (this.expandButton as HTMLElement).addEventListener('click', () => {            
            this.container.classList.toggle('is-expanded');
            invalidateSize(this.map);
        });
    }
}
                
export default ExpandOnClick;