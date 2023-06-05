import { setParams, getParams } from './helpers/osmHelpers';

class ShowPost {
    constructor(map, markers, container, markerElementPairs) {
        this.container = container;
        this.clusters = markers;
        this.map = map;
        this.markerElementPairs = markerElementPairs;
        this.sidebar = container.querySelector('.c-openstreetmap__sidebar');

        if (this.map && this.container && this.clusters) {
            this.setListeners();
            this.handleParams();
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

    handleParams() {
        const params = getParams();
        if (!params) return;

        
    }

    handleClick(element) {
        if (!element || element.closest('.c-collection__item__floating')) return;
        const collectionItem = element.closest('.c-openstreetmap__collection__item');
        const paginationItem = collectionItem?.parentElement;
        const backButton = element.closest('.c-openstreetmap__post-icon');
        const moduleArea = document.getElementById('sidebar-right-sidebar');

        if (paginationItem) {
            paginationItem.className = '';
            paginationItem.classList.add('is-active');
            this.sidebar.classList.add('has-active');
          
            if (moduleArea) {
                moduleArea.classList.add('u-display--none');
            }

            const lat = collectionItem.getAttribute('js-map-lat') ?? false;
            const lng = collectionItem.getAttribute('js-map-lng') ?? false;

            setParams({lat: lat, lng: lng});
            this.scrollToTop();
        }

        if (backButton) {
            this.handleBackButton();
            if (moduleArea) {
                moduleArea.classList.remove('u-display--none');
            }
        }
    }
  
    scrollToTop() {
        if (!this.sidebar) return;
        const rect = this.sidebar.getBoundingClientRect();
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
        if (this.sidebar && this.sidebar.classList.contains('has-active')) {
            this.sidebar.classList.remove('has-active');
        }
        this.sidebar.querySelectorAll('[js-pagination-item]').forEach((item) => {
            item.classList.remove('is-active');
        });

        setParams();

    }
}

export default ShowPost;
