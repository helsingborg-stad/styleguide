class FetchEndpointPosts {
    constructor(private container: HTMLElement, private endpoint: string, private postsPerPage: number = 10) {
        this.fetchPosts();
    }

    private fetchPosts() {
        console.log('fetching posts');
        let page = 1;
        
        const fetchNextPage = () => {
            // let url = this.endpoint + `&page=${page}&postsPerPage=${this.postsPerPage}`;
            let url = this.endpoint + `&page=1&postsPerPage=${this.postsPerPage}`;
            this.fetchEndpointPosts((url))
            .then((data) => {
                if (data && data.posts && data.posts.length > 0) {
                    console.log(data.posts);
                    this.postsAddedEvent(data.posts);
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
        })
        .then(data => {
            return { posts: data.posts, foundPosts: data.foundPosts };
        }).catch((error) => {

        });
    }

    private postsAddedEvent(posts: Array<any>) {
        this.container.dispatchEvent(new CustomEvent('postsAdded', { detail: posts }));
    }
}

export default FetchEndpointPosts;
