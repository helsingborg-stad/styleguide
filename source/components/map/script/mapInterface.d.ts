export type MapArgs = {
	container: HTMLElement;
	id: string;
	lat: string;
	lng: string;
	zoom: string | null;
	style: string | null;
	markers: string | null;
};

export interface MapProviderFactory {
	create(args: MapArgs): unknown;
}
