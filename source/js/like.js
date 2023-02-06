class Like {
    constructor() {
        this.handleLike();
    }

    handleLike() {
        const likeButtons = document.querySelectorAll('[data-like-icon]');
        this.amountOfLikedPosts(this.getLocalStorage());
        this.setLiked(this.getLocalStorage());
        likeButtons && this.setListeners(likeButtons);

        this.getPosts();
    }

    getPosts() {
        const endpoint = "https://localhost/wptest/wp-json/wp/v2/posts";
        fetch(endpoint)
            .then(response => response.json())
            .then(posts => this.handlePosts(posts))
            .catch(error => {
                console.log(error);
            });
    }

    handlePosts(posts) {
        const filteredPosts = posts.filter(post => this.getLocalStorage().includes(post.id.toString()));
    }

    setListeners(likeButtons) {
        likeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const postId = button.getAttribute('data-post-id');
                this.setLocalStorage(postId);
            });
        });
    }

    getLocalStorage() {
        return JSON.parse(localStorage.getItem('liked-posts')) || [];
    }

    setLocalStorage(postId) {
        let likedPostIds = this.getLocalStorage();

        if (!likedPostIds.includes(postId)) {
            likedPostIds.push(postId);
        } else {
            likedPostIds.splice(likedPostIds.indexOf(postId), 1);
        }

        localStorage.setItem('liked-posts', JSON.stringify(likedPostIds));
        this.toggleLiked(postId);
        this.amountOfLikedPosts(likedPostIds);
    }

    toggleLiked(postId) {
        const icons = document.querySelectorAll(`[data-post-id="${postId}"]`);
        icons && icons.forEach(icon => {
            icon.classList.toggle('is-liked');
        })
     }

    setLiked(likedPostIds) {
        likedPostIds.forEach(postId => {
            const icons = document.querySelectorAll(`[data-post-id="${postId}"]`);
            icons && icons.forEach(icon => { 
                icon.classList.add('is-liked');
            });
        });
    }

    amountOfLikedPosts(likedPostIds) {
        const likedPostIdsAmount = document.querySelector('#liked-posts-amount');

        if (!likedPostIdsAmount || !likedPostIds) {
            return;
        }

        likedPostIdsAmount.innerHTML = likedPostIds.length;
    }
}

export default Like;