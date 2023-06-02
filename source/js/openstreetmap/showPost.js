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
      
        let previousUrl = window.location.href;

        const moduleArea = document.getElementById('sidebar-right-sidebar');

        if (paginationItem) {
            paginationItem.className = '';
            paginationItem.classList.add('is-active');
            sidebar.classList.add('has-active');
          
            if (moduleArea) {
                moduleArea.classList.add('u-display--none');
            }

            const url = collectionItem.getAttribute('js-data-url');
            if (url) {
                if (url.indexOf(window.location.hostname) > -1 || url.startsWith("#")) {
                    this.updateBrowserHistory(url);
                }
            }
            this.scrollToTop(sidebar);
        }

        if (backButton) {
            this.handleBackButton(previousUrl);
            if (moduleArea) {
                moduleArea.classList.remove('u-display--none');
            }
        }
    }
  
    updateBrowserHistory(url) {
        window.history.pushState({}, '', url);
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

    handleBackButton(previousUrl = false) {
        const sidebar = this.container.querySelector('.c-openstreetmap__sidebar');

        if (sidebar && sidebar.classList.contains('has-active')) {
            sidebar.classList.remove('has-active');
        }
        sidebar.querySelectorAll('[js-pagination-item]').forEach((item) => {
            item.classList.remove('is-active');
        });

        if (previousUrl) {
            window.history.replaceState(null, null, previousUrl);
        }
    }
}

export default ShowPost;
