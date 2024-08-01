class FetchEndpointPosts {
    constructor(private container: HTMLElement, private endpoint: string, private postsPerPage: number = 20) {
        this.fetchPosts();
    }

    // Fetch loop
    private fetchPosts() {
        let page = 1;
        
        const fetchNextPage = () => {
            let url = this.endpoint + `&page=${page}&postsPerPage=${this.postsPerPage}&html`;
            this.fetchingPostsEvent();
            this.fetchEndpointPosts((url))
            .then((data) => {
                if (data && data.length > 0) {
                    this.postsFetchedEvent(data);
                    page++;
                    fetchNextPage();
                } else {
                    this.doneFetchingPostsEvent(page);
                }
            })
        };

        fetchNextPage();
    }

    // Fetch
    private fetchEndpointPosts(url: string) {
        return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
                }

            return response.json();
        }).catch((error) => {

        });
    }

    // Dispatched when posts have been fetched.
    private postsFetchedEvent(posts: Array<any>): void {
        this.container.dispatchEvent(new CustomEvent('postsFetched', { detail: posts }));
    }

    // Dispatched when fetching posts.
    private fetchingPostsEvent(): void {
        this.container.dispatchEvent(new CustomEvent('fetchingPosts'));
    }    
    
    // Dispatched when there are no more posts to get. Providing the page number.
    private doneFetchingPostsEvent(page: number): void {
        this.container.dispatchEvent(new CustomEvent('doneFetchingPostsEvent', { detail: page }));
    }
}

export default FetchEndpointPosts;
