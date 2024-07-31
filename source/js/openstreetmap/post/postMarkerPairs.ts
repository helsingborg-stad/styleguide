import { PostMarkerPair } from '../interface/interface';

class PostMarkerPairs {
    postMarkerPairs: PostMarkerPair[];
    constructor(private container: HTMLElement) {
        this.postMarkerPairs = [];
    }

    public set(postMarkerPair: PostMarkerPair): void {
        this.postMarkerPairs.push(postMarkerPair);
        this.dispatchPostMarkerPairAdded(postMarkerPair);
    }

    public get(): PostMarkerPair[] {
        return this.postMarkerPairs;
    }

    private dispatchPostMarkerPairAdded(postMarkerPair: PostMarkerPair ): void {
        this.container.dispatchEvent(new CustomEvent('postMarkerPairAdded', { detail: postMarkerPair }));
    }
}

export default PostMarkerPairs;