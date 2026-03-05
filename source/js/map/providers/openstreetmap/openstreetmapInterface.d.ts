import { LatLngObject, MapStyle, MarkerOptions, TooltipOptions } from "@helsingborg-stad/openstreetmap"

type OpenstreetmapArgs = {
    id: string,
    lat: number,
    lng: number,
    zoom: number
    style: MapStyle,
    markers: array<MarkerOptions>
}

type MarkerConfig = {
    lat: number,
    lng: number,
    icon?: string,
    content?: string,
    color?: string
}

interface CreateMarker {
    create(markerConfig: MarkerConfig): void;
}
