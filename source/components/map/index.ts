import MapFactory from './mapFactory';

export function initializeMaps() {
	document.querySelectorAll('[data-js-map]').forEach((mapContainer) => {
		const id = mapContainer.getAttribute('data-js-map');
		const provider = mapContainer.getAttribute('data-js-map-provider');
		const mapStyle = mapContainer.getAttribute('data-js-map-style');
		const lat = mapContainer.getAttribute('data-js-map-lat');
		const lng = mapContainer.getAttribute('data-js-map-lng');
		const zoom = mapContainer.getAttribute('data-js-map-zoom');
		const markers = mapContainer.getAttribute('data-js-map-markers');

		if (!id || !provider || !lat || !lng) {
			console.warn('Map element is missing required attributes: data-js-map and data-js-map-provider');
			return;
		}

		const args: MapArgs = {
			container: mapContainer as HTMLElement,
			id: id,
			lat: lat,
			lng: lng,
			style: mapStyle,
			zoom: zoom,
			markers: markers,
		};

		// Only provider supported for now is OpenStreetMap.
		MapFactory.create(provider, args);
	});
}
