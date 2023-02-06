class Like {
    constructor() {
        this.handleLike();
    }

    handleLike() {
        const likeButtons = document.querySelectorAll('[data-like-icon]');
        this.amountOfLikedPosts(this.getLocalStorage());
        this.setLiked(this.getLocalStorage());
        likeButtons && this.setListeners(likeButtons);
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
        let likedPosts = this.getLocalStorage();

        if (!likedPosts.includes(postId)) {
            likedPosts.push(postId);
        } else {
            likedPosts.splice(likedPosts.indexOf(postId), 1);
        }

        localStorage.setItem('liked-posts', JSON.stringify(likedPosts));
        this.toggleLiked(postId);
        this.amountOfLikedPosts(likedPosts);
    }

    toggleLiked(postId) {
        const icons = document.querySelectorAll(`[data-post-id="${postId}"]`);
        icons && icons.forEach(icon => {
            icon.classList.toggle('is-liked');
        })
     }

    setLiked(likedPosts) {
        likedPosts.forEach(post => {
            const icons = document.querySelectorAll(`[data-post-id="${post}"]`);
            icons && icons.forEach(icon => { 
                icon.classList.add('is-liked');
            });
        });
    }

    amountOfLikedPosts(likedPosts) {
        const likedPostsAmount = document.querySelector('#liked-posts-amount');

        if (!likedPostsAmount || !likedPosts) {
            return;
        }

        likedPostsAmount.innerHTML = likedPosts.length;
    }
}

export default Like;