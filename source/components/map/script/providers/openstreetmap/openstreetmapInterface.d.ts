import type { MapStyle } from '@helsingborg-stad/openstreetmap';

export type OpenstreetmapArgs = {
	id: string;
	lat: number;
	lng: number;
	zoom: number;
	style: MapStyle;
	markers: MarkerConfig[];
};

export type MarkerConfig = {
	lat: number;
	lng: number;
	icon?: string;
	content?: string;
	color?: string;
};

export interface CreateMarker {
	create(markerConfig: MarkerConfig): void;
}
