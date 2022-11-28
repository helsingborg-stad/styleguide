import VideoControls from './helpers/video';
class Hero {
    constructor() {
        this.videoItemClasses = ['c-hero--video'];
        this.pause = 'js-pause-video';
        this.play = 'js-play-video';

        this.handleVideoPause();
    }

    handleVideoPause() {
       /* this.videoItemClasses.forEach(videoItemClass => {
        
       }) */
        const video = new VideoControls(document.querySelector('.c-hero'));
       console.log(video);
    }
}

export default Hero;