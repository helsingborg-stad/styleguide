import { invalidateSize } from "../map/mapHelpers";
import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';

class SidebarFeatures {
    baseClass: string = 'c-openstreetmap';

    constructor(private container: HTMLElement, private map: LeafletMap) {
        if (this.container.querySelector(`.${this.baseClass}__sidebar`)) {
            this.expandBasedOnClasses();
            this.observeSizeClasses();
            this.setupExpandClick();
        }
    }

    setupExpandClick() {
        const expand = this.container.querySelector(`.${this.baseClass}__expand-icon`);

        expand?.addEventListener('click', () => {
            invalidateSize(this.map);
        });
    }

    observeSizeClasses() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (
                    mutation.type === 'attributes' &&
                    mutation.attributeName === 'class' &&
                    mutation.oldValue !== this.container.className &&
                    !this.container.classList.contains('is-expanded') &&
                    !this.container.classList.contains(`${this.baseClass}--size-sm`)
                ) {
                    const previousClasses = mutation.oldValue?.split(' ');
                    const currentClasses = this.container.className.split(' ');
                    const removedClasses = previousClasses?.filter(className => !currentClasses.includes(className));

                    if (removedClasses && removedClasses.includes(`${this.baseClass}--size-sm`)) {
                        this.expandBasedOnClasses();
                    }
                }
            });
        });

        const config = {
            attributes: true,
            attributeFilter: ['class'],
            attributeOldValue: true,
            subtree: false,
        };

        observer.observe(this.container, config);
    }

    expandBasedOnClasses() {
        if (!this.container.classList.contains(`${this.baseClass}--size-sm`)) {
            this.container.classList.add('is-expanded');
        }
    }
}
export default SidebarFeatures;