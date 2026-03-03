import sheet from '@helsingborg-stad/openstreetmap/dist/main.css?inline';
import Openstreetmap from "./openstreetmap";
import { MarkerConfig, OpenstreetmapArgs } from './openstreetmapInterface';
import { LatLngObject, MapStyle, MarkerOptions, TooltipOptions } from '@helsingborg-stad/openstreetmap';

class OpenstreetmapFactory {
    public static stylesLoaded = false;

    /**
     * Creates and returns a new Openstreetmap instance after validating the
     * provided arguments and ensuring the required styles are loaded.
     *
     * @param args - Raw map configuration from the consuming component.
     * @returns A new Openstreetmap instance, or undefined if arguments are invalid.
     */
    public create(args: MapArgs) {

        const verifiedArgs: OpenstreetmapArgs | false = this.getAndVerifyArgs(args);

        if (!verifiedArgs) {
            console.warn("Invalid map arguments provided, map creation aborted.");
            return;
        }

        this.ensureStyles();

        return new Openstreetmap(verifiedArgs);
    }

    /**
     * Validates and transforms raw map arguments into a typed OpenstreetmapArgs
     * object. Returns false if any required field fails validation.
     *
     * @param args - Raw map configuration to validate.
     * @returns A verified OpenstreetmapArgs object, or false on validation failure.
     */
    private getAndVerifyArgs(args: MapArgs): OpenstreetmapArgs | false {
        const id = this.verifyId(args.container, args.id);

        if (!id) {
            return false;
        }

        const startPosition = this.decodeAndVerifyStartPosition(args.startPosition);

        if (!startPosition) {
            return false;
        }

        const zoom = this.getZoom(args.zoom);
        const style = this.getStyle(args.style);
        const markers = this.decodeAndVerifyMarkers(args.markers);

        const verifiedArgs: OpenstreetmapArgs = {
            id,
            startPosition,
            zoom,
            style,
            markers: markers
        };

        return verifiedArgs;
    }

    /**
     * Parses a JSON-encoded markers string and filters out any entries with
     * missing or non-numeric lat/lng values.
     *
     * @param encodedMarkers - JSON string representing an array of marker objects.
     * @returns An array of valid MarkerConfig objects, or an empty array if none are valid.
     */
    private decodeAndVerifyMarkers(encodedMarkers: string | null): MarkerConfig[] {
        const markers = JSON.parse(encodedMarkers || "[]");
        if (!Array.isArray(markers)) {
            return [];
        }

        const markerConfigs: MarkerConfig[] = [];
        for (const marker of markers) {
            if (!marker.lat || isNaN(Number(marker.lat)) || !marker.lng || isNaN(Number(marker.lng))) {
                continue;
            }

            markerConfigs.push({
                lat: Number(marker.lat),
                lng: Number(marker.lng),
                icon: marker.icon || null,
                content: marker.content || null
            });
        }

        return markerConfigs;
    }

    /**
     * Validates the provided style string against the allowed MapStyle values
     * and falls back to "default" when the value is absent or unrecognised.
     *
     * @param style - Raw style string from map arguments.
     * @returns A valid MapStyle value.
     */
    private getStyle(style: string | null): MapStyle {
        const validStyles: MapStyle[] = ["default", "pale", "dark", "color"];

        if (!style || !validStyles.includes(style as MapStyle)) {
            return "default";
        }

        return style as MapStyle;
    }

    /**
     * Parses the zoom string into a number. Returns 16 as the default zoom
     * level when the value is absent or not a valid number.
     *
     * @param zoom - Raw zoom string from map arguments.
     * @returns A numeric zoom level.
     */
    private getZoom(zoom: string | null): number {
        return isNaN(Number(zoom)) ? 16 : Number(zoom);
    }

    /**
     * Parses a JSON-encoded start position string and validates that both lat
     * and lng are present numeric values.
     *
     * @param startPosition - JSON string expected to contain lat and lng properties.
     * @returns A LatLngObject when valid, or false if either coordinate is missing or NaN.
     */
    private decodeAndVerifyStartPosition(startPosition: string): LatLngObject | false {
        const decoded = JSON.parse(startPosition);
        const lat = isNaN(decoded.lat) ? null : decoded.lat;
        const lng = isNaN(decoded.lng) ? null : decoded.lng;

        if (lat === null || lng === null) {
            return false;
        }

        return { lat, lng };
    }

    /**
     * Verifies that an element with the given id exists within the provided
     * container element.
     *
     * @param container - The parent element to search within.
     * @param id - The id attribute value to look for.
     * @returns The id string when the element is found, or false otherwise.
     */
    private verifyId(container: HTMLElement, id: string): string | false {
        const mapContainer = container.querySelector(
            `[id="${id}"]`
        );

        if (!mapContainer) {
            return false;
        }

        return id;
    }

    /**
     * Injects the OpenStreetMap CSS into the document's adopted stylesheets
     * exactly once per page, guarded by the static `stylesLoaded` flag.
     */
    private ensureStyles() {
        if (OpenstreetmapFactory.stylesLoaded) return;

        OpenstreetmapFactory.stylesLoaded = true;

        const newSheet = new CSSStyleSheet();
        newSheet.replaceSync(sheet);
        document.adoptedStyleSheets = [
            ...document.adoptedStyleSheets,
            newSheet
        ];
    }
}

export default OpenstreetmapFactory;