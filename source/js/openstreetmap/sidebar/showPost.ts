import { PostMarkerPair } from '../interface/interface';


class ShowPost {
    constructor(private container: HTMLElement, private baseClass: string) {
        this.addMarkerPostPairAddedListener();
    }

    private addMarkerPostPairAddedListener() {
        this.container.addEventListener('postMarkerPairAdded', (e: Event) => {
            const customEvent = e as CustomEvent;
            const postMarkerPair: PostMarkerPair = customEvent.detail;
            console.log(postMarkerPair);
            const parentElement = postMarkerPair.post;

        });
    }
}

export default ShowPost;