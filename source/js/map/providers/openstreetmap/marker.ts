import { CreateMarkerInterface, MarkerInterface, CreatePopupInterface, IconOptions } from "@helsingborg-stad/openstreetmap";
import { MarkerConfig } from "./openstreetmapInterface";
import { CreateMarker } from "./openstreetmapInterface";

class Marker implements CreateMarker {
    /**
     * @param markerCreator - Factory used to create map marker instances.
     * @param popupCreator  - Factory used to create popup instances bound to markers.
     */
    constructor(
        private markerCreator: CreateMarkerInterface,
        private popupCreator: CreatePopupInterface
    ) { }

    /**
     * Creates a map marker at the position defined in options. When a content
     * string is provided, a popup is bound to the marker and click listeners
     * are attached to toggle the highlighted icon state.
     *
     * @param options - Configuration for the marker's position, icon, color, and popup content.
     * @returns The created MarkerInterface instance.
     */
    public create(options: MarkerConfig): MarkerInterface {

        const marker = this.markerCreator.create({
            position: { lat: options.lat, lng: options.lng },
            ...this.getIconOptions(this.getMarkerContent(options))
        });

        if (options.content) {
            const popup = this.popupCreator.create();
            popup.bindTo(marker);
            popup.setContent(options.content);

            this.addClickListener(marker, options);
        }

        return marker;
    }

    /**
     * Attaches popupopen and popupclose event listeners to the marker so that
     * its icon switches to the highlighted state while the popup is open and
     * reverts to the default state when the popup closes.
     *
     * @param marker  - The marker to attach listeners to.
     * @param options - Marker configuration used to regenerate the icon HTML.
     */
    private addClickListener(marker: MarkerInterface, options: MarkerConfig) {
        marker.addListener('popupopen', () => {
            marker.setIcon(this.getIconOptions(this.getHighlightedMarkerContent(options)));
        });

        marker.addListener('popupclose', () => {
            marker.setIcon(this.getIconOptions(this.getMarkerContent(options)));
        });
    }

    /**
     * Builds an IconOptions object with a fixed 32×32 size and a centred
     * horizontal anchor at [16, 2].
     *
     * @param html - The HTML string to use as the icon's visual content.
     * @returns An IconOptions object ready to pass to the marker creator.
     */
    private getIconOptions(html: string): IconOptions {
        return {
            html: html,
            iconSize: [32, 32],
            iconAnchor: [16, 2]
        }
    }

    /**
     * Generates the HTML string for the highlighted (active/open-popup) marker
     * icon, rendered as a white circle with a coloured border and icon.
     *
     * @param options - Marker configuration supplying colour and icon values.
     * @returns An HTML string representing the highlighted marker icon.
     */
    private getHighlightedMarkerContent(options: MarkerConfig): string {
        const [color, icon] = this.getColorAndIcon(options);

        return `<span style="background-color: white; border: solid 2px ${color}; color: ${color}; font-size: 20px; padding: 4px; border-radius: 50%;" data-material-symbol="${icon}" class="interactive-map__highlighted-marker material-symbols material-symbols-rounded material-symbols-sharp material-symbols-outlined material-symbols--filled"></span>`;
    }

    /**
     * Generates the HTML string for the default marker icon, rendered as a
     * solid coloured circle with a white icon.
     *
     * @param options - Marker configuration supplying colour and icon values.
     * @returns An HTML string representing the default marker icon.
     */
    private getMarkerContent(options: MarkerConfig): string {
        const [color, icon] = this.getColorAndIcon(options);

        return `<span style="background-color: ${color}; border: solid 2px ${color}; color: white; font-size: 20px; padding: 4px; border-radius: 50%;" data-material-symbol="${icon}" class="material-symbols material-symbols-rounded material-symbols-sharp material-symbols-outlined material-symbols--filled"></span>`;
    }

    /**
     * Extracts the colour and icon name from the marker options, falling back
     * to the default colour (#E04A39) and icon (location_on) when not provided.
     *
     * @param options - Marker configuration that may contain colour and icon overrides.
     * @returns A tuple of [color, icon] strings.
     */
    private getColorAndIcon(options: MarkerConfig): [string, string] {
        const color = options.color ?? "#E04A39";
        const icon = options.icon ?? "location_on";

        return [color, icon];
    }
}

export default Marker;