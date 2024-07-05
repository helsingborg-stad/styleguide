import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import { invalidateSize } from "../map/mapHelpers";

class ExpandOnClick {
    constructor(private container: HTMLElement, private map: LeafletMap, private baseClass: string) {
        const expandButtonDesktop = this.container.querySelector(`.${this.baseClass}__expand-icon-desktop`);
        const expandButtonMobile = this.container.querySelector(`.${this.baseClass}__expand-icon-mobile`);

        console.log(expandButtonDesktop, expandButtonMobile)

        if (expandButtonDesktop && expandButtonMobile) {
            this.setupExpandClick(expandButtonDesktop, expandButtonMobile);
        }
    }

    private setupExpandClick(expandButtonDesktop: Element, expandButtonMobile: Element) {
        [expandButtonDesktop, expandButtonMobile].forEach(element => {
            element.addEventListener('click', () => {    
                this.container.classList.toggle('is-expanded');
                invalidateSize(this.map);
            });
        });
    }
}
                
export default ExpandOnClick;