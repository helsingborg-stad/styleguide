import VideoControls from './helpers/video';
class Hero {
    constructor() {
        this.heroVideos = document.querySelectorAll('.c-hero--video');

        this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

        this.heroVideos.length && this.handleVideoPause();

    }

    handleVideoPause() {
        this.heroVideos.forEach(heroVideo => {
            const video = new VideoControls(heroVideo);

            if (this.isReduced) {
                video.pauseVideo();
            }
        });
    }
}

export default Hero;