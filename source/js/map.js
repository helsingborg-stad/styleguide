import L from 'leaflet';

class Map {
    constructor() {
        this.init();
    }

    init() {
        let map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let marker = L.marker([51.5, -0.08], {icon: this.icon()}).addTo(map);
        marker.bindPopup("This is my popup");


    }

    icon() {
        const icon = L.icon({
            iconUrl: './map-pin-icon.png',
            iconSize: [38, 51]
        });
        return icon;
    }
}

export default Map;