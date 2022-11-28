import VideoControls from './helpers/video';
class Hero {
    constructor() {
        this.heroVideos = document.querySelectorAll('.c-hero--video');
        
        this.heroVideos.length && this.handleVideoPause();
    }

    handleVideoPause() {
        console.log(this.heroVideos);
        this.heroVideos.forEach(heroVideo => {
            console.log(heroVideo);
            const video = new VideoControls(heroVideo);
        });
    }
}

export default Hero;