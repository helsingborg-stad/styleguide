import L, { Map as LeafletMap } from 'leaflet';

class AddEndpointPosts {
    postsContainer: HTMLElement|null = null;
    constructor(private container: HTMLElement, map: LeafletMap) {
        this.postsContainer = this.container.querySelector('[data-js-osm-endpoint-posts]');

        if (this.postsContainer) {
            this.listenForPostsFetched();
        }
    }

    private listenForPostsFetched() {
        this.container.addEventListener('postsFetched', (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail && customEvent.detail.length > 0) {
                customEvent.detail.forEach((elementString: string) => {
                    if (elementString.includes('data-js-map-location=""')) return;
                    this.addPostsToDOM(elementString);
                });
            }
        });
    }

    private addPostsToDOM(elementString: string) {
        let post = document.createElement('div');
        post.classList.add('c-openstreetmap__posts');
        post.innerHTML = elementString;
        post = post.firstChild as HTMLDivElement;
        (this.postsContainer as HTMLElement).appendChild(post);

        this.dispatchPostAddedEvent(post);
    }

    private dispatchPostAddedEvent(post: HTMLElement) {
        this.container.dispatchEvent(new CustomEvent('postAdded', { detail: post }));
    }
}

export default AddEndpointPosts;