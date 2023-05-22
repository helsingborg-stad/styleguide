class ShowPost {
    constructor(map, markers, container) {
        this.container = container;
        this.clusters = markers;
        this.map = map;

        if (map && this.container && this.clusters) {
            this.handleClick();
            window.addEventListener('popstate', () => this.handleBackButton());
        }
    }
    handleClick() {
        let paginationContainer = this.container.querySelector('[js-pagination-container]');
        let sidebar = this.container.querySelector('.c-openstreetmap__sidebar');
        let gridClass = false;

        paginationContainer &&
            paginationContainer.addEventListener('click', (e) => {
                if (e.target.closest('.c-collection__item__floating')) return;
                let collectionItem = e.target.closest('.c-openstreetmap__collection__item');
                let paginationItem = collectionItem?.parentElement;
                let backButton = e.target.closest('.c-openstreetmap__post-icon');
                if (paginationItem) {
                    if (!gridClass) {
                        gridClass = paginationItem.className ? paginationItem.className : '';
                    }
                    paginationItem.className = '';
                    paginationItem.classList.add('is-active');
                    sidebar.classList.add('has-active');
                    this.setMapZoom(collectionItem);
                    this.scrollToTop(sidebar);
                }

                if (backButton) {
                    this.handleBackButton();
                }
            });
    }

    scrollToTop(sidebar) {
        if (!sidebar) return;
        let rect = sidebar.getBoundingClientRect();
        let offset = 0;
        let topPos = window.pageYOffset || document.documentElement.scrollTop;

        if (document.querySelector('.c-header--sticky')) {
            let headerRect = document.querySelector('.c-header--sticky').getBoundingClientRect();
            offset = headerRect.height ?? 100;
        }

        let target = rect.top + topPos - offset;

        window.scrollTo({
            top: target,
        })
    }

    handleBackButton() {
        const sidebar = this.container.querySelector('.c-openstreetmap__sidebar');
        const gridClass = this.gridClass;
        
        if(sidebar && sidebar.classList.contains('has-active')) {
            sidebar.classList.remove('has-active');
        }
        sidebar.querySelectorAll('[js-pagination-item]').forEach((item) => {
            if (gridClass) {
                !item.classList.contains(gridClass) ? item.classList.add(gridClass) : '';
            }
            item.classList.remove('is-active');
        });
    }

    setMapZoom(collectionItem) {
        if (
            collectionItem &&
            collectionItem.hasAttribute('js-map-lat') &&
            collectionItem.hasAttribute('js-map-lng')
        ) {
            let lat = collectionItem.getAttribute('js-map-lat');
            let lng = collectionItem.getAttribute('js-map-lng');
            if (lat && lng) {
                let markerLatLng = L.latLng(lat, lng);
                let markers = this.clusters;
                let marker;
                markers.getLayers().forEach(function (layer) {
                    if (layer instanceof L.Marker && layer.getLatLng().equals(markerLatLng)) {
                        marker = layer;
                    } else if (layer instanceof L.MarkerCluster) {
                        layer.getAllChildMarkers().forEach(function (child) {
                            if (child.getLatLng().equals(markerLatLng)) {
                                marker = child;
                            }
                        });
                    }
                });
                if (marker) {
                    if (marker.__parent) {
                        let cluster = marker.__parent;
                        cluster.zoomToBounds();
                        setTimeout(function () {
                            marker.openPopup();
                        }, 300);
                    }
                }
            }
        }
    }
}

export default ShowPost;
