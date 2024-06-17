import { getMarkerDataFromElement, pushCoordinatesToBrowserHistory, getCoordinatesFromURLSearchParams } from './helpers/osmHelpers';
import Pagination from '../pagination';
import L, { Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';


class ShowPost {
    container: HTMLElement;
    clusters: MarkerClusterGroup;
    map: LeafletMap;
    sidebar: HTMLElement | null;
    paginationInstance: Pagination | false;

    constructor(map: LeafletMap, markers: MarkerClusterGroup, container: HTMLElement) {
        this.container = container;
        this.clusters = markers;
        this.map = map;
        this.sidebar = container.querySelector('.c-openstreetmap__sidebar');
        this.paginationInstance = false;

        const paginationTarget = this.container.querySelector('[data-js-pagination-target]') as HTMLElement;

        if (paginationTarget) {
            const instanceId = paginationTarget?.dataset.paginationInstance;

            if (instanceId) {
                const paginationInstance = Pagination.getInstance(instanceId);
                if (paginationInstance) {
                    this.paginationInstance = paginationInstance;
                }
            }
        }

        if (this.map && this.container && this.clusters && this.sidebar) {
            this.setListeners();
            this.handleCoordinatesFromURLSearchParams();
        }
    }

    private setListeners() {
        window.addEventListener('popstate', () => this.handleBackButton());
        const paginationContainer = this.container.querySelector('[data-js-pagination-container]');
        if (!paginationContainer) return;

        paginationContainer.addEventListener('keydown', (e) => {
            const keyboardEvent = e as KeyboardEvent;
            const target = keyboardEvent.target as HTMLElement;
            if (target && target.hasAttribute('data-js-pagination-item') && keyboardEvent.key === 'Enter') {
                const el = target.querySelector('.c-openstreetmap__collection__item');
                if (el) {
                    this.handleClick(el as HTMLElement)
                }
            }

            if (keyboardEvent.key === 'Escape') {
                this.handleBackButton();
            }
        });

        paginationContainer.addEventListener('click', (e) => {
            let clickEl = e.target as HTMLElement;
            this.handleClick(clickEl);
        });
    }

    private handleCoordinatesFromURLSearchParams() {
        const params = getCoordinatesFromURLSearchParams();
        if (!params || !this.sidebar) return;
        const posts = this.sidebar.querySelectorAll('.c-openstreetmap__collection__item');

        [...posts].forEach((collectionItem) => {
            const latLng = getMarkerDataFromElement(collectionItem as HTMLElement);
            const lat = latLng.lat;
            const lng = latLng.lng;

            if (lat && lng) {
                if (lat == params.lat && lng == params.lng) {
                    const parent = collectionItem.closest('[data-js-pagination-item]');
                    if (this.paginationInstance && parent && parent.getAttribute('data-js-pagination-page')) {
                        const page = parent.getAttribute('data-js-pagination-page');
                        if (!page) return;
                        
                        this.paginationInstance.paginateSetCurrent(parseInt(page));
                        this.paginationInstance.tableRefresh();
                    }
                    this.handleClick(collectionItem as HTMLElement);
                }
            }
        });
    }

    private handleClick(element: HTMLElement) {
        if (!element || element.closest('.c-collection__item__floating')) return;
        const collectionItem = element.closest('.c-openstreetmap__collection__item');
        const paginationItem = collectionItem?.parentElement;
        const backButton = element.closest('.c-openstreetmap__post-icon');
        const moduleArea = document.getElementById('sidebar-right-sidebar');
        
        if (paginationItem && this.sidebar) {
            paginationItem.className = '';
            paginationItem.classList.add('is-active');
            this.sidebar.classList.add('has-active');
            paginationItem.classList.remove('u-display--none');
          
            if (moduleArea) {
                moduleArea.classList.add('u-display--none');
            }
            const latLng = getMarkerDataFromElement(collectionItem as HTMLElement);
            const lat = latLng.lat;
            const lng = latLng.lng;

            pushCoordinatesToBrowserHistory({lat: lat, lng: lng});
        }

        if (backButton) {
            this.handleBackButton();
            if (moduleArea) {
                moduleArea.classList.remove('u-display--none');
            }
        }
    }

    private handleBackButton() {
        if (!this.sidebar) return;

        if (this.sidebar.classList.contains('has-active')) {
            this.sidebar.classList.remove('has-active');
        }

        this.sidebar.querySelectorAll('[data-js-pagination-item]').forEach((item) => {
            item.classList.add('c-openstreetmap__posts');
            if (item.classList.contains('is-active')) {
                item.classList.remove('is-active');
                item.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        });
        
        pushCoordinatesToBrowserHistory({lat: undefined, lng: undefined});
    }
}

export default ShowPost;
