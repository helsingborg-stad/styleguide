class Like {
    constructor() {
        this.hasLikeIcons() && this.setListeners();
    }

    hasLikeIcons() {
        return document.querySelectorAll('[data-like-icon]');
    }

    setListeners() {
        const likeButtons = document.querySelectorAll('[data-like-icon]');

        likeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const postId = button.getAttribute('data-post-id');
                this.handleLocalStorageArray(postId);  
            });
        });
    }

    handleLocalStorageArray(postId) {
        let localStorageItems = JSON.parse(localStorage.getItem('liked-posts')) || [];
        console.log(localStorageItems);

        if(!localStorageItems.includes(postId)) {
            localStorageItems.push(postId);
        } else {
            localStorageItems.splice(localStorageItems.indexOf(postId), 1);
        }

        localStorage.setItem('liked-posts', JSON.stringify(localStorageItems));
    }
}

export default Like;