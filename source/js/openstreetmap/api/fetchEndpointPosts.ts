class FetchEndpointPosts {
    constructor(private container: HTMLElement, private endpoint: string, private postsPerPage: number = 10) {
        this.fetchPosts();
    }

    private fetchPosts() {
        console.log('fetching posts');
        let page = 1;
        
        const fetchNextPage = () => {
            let url = this.endpoint + `&page=${page}&postsPerPage=${this.postsPerPage}&html`;
            console.log(url);
            this.fetchEndpointPosts((url))
            .then((data) => {
                if (data && data.length > 0) {
                    this.postsFetchedEvent(data);
                    page++;
                    fetchNextPage();
                }
            })
        };

        fetchNextPage();
    }

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

    private postsFetchedEvent(posts: Array<any>) {
        this.container.dispatchEvent(new CustomEvent('postsFetched', { detail: posts }));
    }
}

export default FetchEndpointPosts;
