import L, { Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import { Icon } from '../interface/interface';

class CreateMarker {
    constructor(private container: HTMLElement) {
    }

    public create(customIcon: Icon | undefined) {
        let template = this.container?.querySelector('.c-openstreetmap__pin-icon');
        let html = template?.innerHTML;
        let icon = customIcon?.icon ? customIcon.icon : 'location_on';
        let color = customIcon?.backgroundColor
            ? customIcon.backgroundColor
            : this.getPrimaryColor();

            if (!html) return;
        html = html
            .replace('{icon-name}', icon as string)
            .replaceAll('{ICON_NAME}', icon as string)
            .replace('{ICON_BACKGROUND_COLOR}', color as string);
        let marker = L.divIcon({
            className: 'c-openstreetmap__icon',
            html: html, 
        });
        
        return marker;
    }

    private getPrimaryColor() {
        let color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
        return color ? color : '#ae0b05';
    }
}

export default CreateMarker;