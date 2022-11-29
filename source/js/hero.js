import VideoControls from './helpers/video';
class Hero {
    constructor() {
        this.heroVideos = document.querySelectorAll('.c-hero--video');

        this.heroVideos.length && this.handleVideoPause();
    }

    handleVideoPause() {
        this.heroVideos.forEach(heroVideo => {
            const video = new VideoControls(heroVideo);
        });
    }
}

export default Hero;