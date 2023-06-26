import { Marker } from 'leaflet';

export interface MapPosition {
    lat: number;
    lng: number;
    zoom: number;
}

export interface Tiles {
    attribution: string;
    url: string;
}

export interface MarkerElementObjects {
    element: HTMLElement;
    marker: Marker;
}

export interface Icon {
    icon: String;
    backgroundColor: String;
}

export interface Tooltip {
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

export interface Location {
    element?: HTMLElement;
    lat?: number;
    lng?: number;
    tooltip?: Tooltip;
    url?: String;
    icon?: Icon;
}


