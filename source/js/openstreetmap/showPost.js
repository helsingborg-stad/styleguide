class ShowPost {
    constructor(map, markers, container) {
        this.container = container;
        this.clusters = markers;
        this.map = map;

        if (map && this.container && this.clusters) {
            this.setListeners();
            window.addEventListener('popstate', () => this.handleBackButton());
        }
    }
    setListeners() {
        const paginationContainer = this.container.querySelector('[js-pagination-container]');
        if (!paginationContainer) return;

        paginationContainer.addEventListener('keydown', (e) => {
            if (e.target.hasAttribute('js-pagination-item') && e.key === 'Enter') {
                const el = e.target.querySelector('.c-openstreetmap__collection__item');
                this.handleClick(el)
            }

            if (e.key === 'Escape') {
                this.handleBackButton();
            }
        });

        paginationContainer.addEventListener('click', (e) => {
            this.handleClick(e.target);
        });
    }

    handleClick(element) {
        if (!element || element.closest('.c-collection__item__floating')) return;
        const sidebar = this.container.querySelector('.c-openstreetmap__sidebar');
        const collectionItem = element.closest('.c-openstreetmap__collection__item');
        const paginationItem = collectionItem?.parentElement;
        const backButton = element.closest('.c-openstreetmap__post-icon');

        if (paginationItem) {
            paginationItem.className = '';
            paginationItem.classList.add('is-active');
            sidebar.classList.add('has-active');
            this.setMapZoom(collectionItem);
            this.scrollToTop(sidebar);
        }

        if (backButton) {
            this.handleBackButton();
        }
    }

    scrollToTop(sidebar) {
        if (!sidebar) return;
        const rect = sidebar.getBoundingClientRect();
        let offset = 0;
        const topPos = window.pageYOffset || document.documentElement.scrollTop;

        if (document.querySelector('.c-header--sticky')) {
            const headerRect = document.querySelector('.c-header--sticky').getBoundingClientRect();
            offset = headerRect.height ?? 100;
        }

        const target = rect.top + topPos - offset;

        window.scrollTo({
            top: target,
        })
    }

    handleBackButton() {
        const sidebar = this.container.querySelector('.c-openstreetmap__sidebar');

        sidebar.classList.remove('has-active');
        sidebar.querySelectorAll('[js-pagination-item]').forEach((item) => {
            item.classList.remove('is-active');
        });
    }

    setMapZoom(collectionItem) {
        const lat = collectionItem?.getAttribute('js-map-lat');
        const lng = collectionItem?.getAttribute('js-map-lng');

        if (lat && lng) {
            const markerLatLng = L.latLng(lat, lng);
            const marker = this.findMarkerByLatLng(markerLatLng);

            if (marker && marker.__parent) {
                const cluster = marker.__parent;
                cluster.zoomToBounds();
                setTimeout(() => {
                    marker.openPopup();
                }, 300);
            }
        }
    }

    findMarkerByLatLng(markerLatLng) {
        const markers = this.clusters.getLayers();

        for (const layer of markers) {
            if (layer instanceof L.Marker && layer.getLatLng().equals(markerLatLng)) {
                return layer;
            } else if (layer instanceof L.MarkerCluster) {
                const childMarkers = layer.getAllChildMarkers();

                for (const child of childMarkers) {
                    if (child.getLatLng().equals(markerLatLng)) {
                        return child;
                    }
                }
            }
        }

        return null;
    }
}

export default ShowPost;
