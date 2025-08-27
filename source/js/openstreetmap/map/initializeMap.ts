import L, { Map as LeafletMap } from 'leaflet';
import 'leaflet.markercluster';

// Only patch if it doesn’t exist
if (!(L as any).markerClusterGroup) {
  (L as any).MarkerClusterGroup = class {
    private _markers: Marker[] = [];
    private _map?: LeafletMap;
    private _options: any;

    constructor(options?: any) {
      this._options = options || {};
    }

    addLayer(marker: Marker) {
      this._markers.push(marker);
      if (this._map) marker.addTo(this._map);
      return this;
    }

    addLayers(markers: Marker[]) {
      markers.forEach(m => this.addLayer(m));
      return this;
    }

    removeLayer(marker: Marker) {
      const index = this._markers.indexOf(marker);
      if (index !== -1) this._markers.splice(index, 1);
      if (this._map) this._map.removeLayer(marker);
      return this;
    }

    clearLayers() {
      this._markers.forEach(m => this._map?.removeLayer(m));
      this._markers = [];
      return this;
    }

    addTo(map: LeafletMap) {
      this._map = map;
      this._markers.forEach(m => m.addTo(map));
      return this;
    }

    getClusters() {
      return [this._markers];
    }
  };

  (L as any).markerClusterGroup = function (options?: any) {
    return new (L as any).MarkerClusterGroup(options);
  };
}

class InitializeOsm {
    constructor(private container: HTMLElement) {}

    public create(): [LeafletMap, L.MarkerClusterGroup] {
        const id = this.container.getAttribute('data-js-map-id') ?? "";

        const map = L.map(`openstreetmap__map-${id}`, {
            scrollWheelZoom: false,
            keyboard: false,
            attributionControl: false,
        });

        const markers = L.markerClusterGroup({
            showCoverageOnHover: false,
            removeOutsideVisibleBounds: true,
            maxClusterRadius: 50,
        });

        return [map, markers];
    }
}

export default InitializeOsm;