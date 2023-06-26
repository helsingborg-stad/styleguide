import { Marker } from 'leaflet';

interface MapPosition {
    lat: number;
    lng: number;
    zoom: number;
}

interface Tiles {
    attribution: string;
    url: string;
}

interface MarkerElementObjects {
    element: HTMLElement;
    marker: Marker;
}

interface Icon {
    icon: String;
    backgroundColor: String;
}

interface Tooltip {
    directions: {
        label: String;
        url: String;
    }
    image: {
        src: String;
        alt: String;
    }
    excerpt: String;
    title: String;
    url: String;
}

interface Location {
    element?: HTMLElement;
    lat?: number;
    lng?: number;
    tooltip?: Tooltip;
    url?: String;
    icon?: Icon;
}


