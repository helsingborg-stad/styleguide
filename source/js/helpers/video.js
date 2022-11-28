export default class VideoControls {
    constructor(videoElement) {
        this.PLAYER = videoElement;

        this.videoInteractions();
    }

    videoInteractions() {
        const btn = this.PLAYER.querySelector('[js-video-control]');
        console.log(this.PLAYER.querySelector('[js-video-control]'));
        if(btn) {
            btn.addEventListener('click', () => {
                if (this.getVideoState() === 'playing' || !this.getVideoState()) {
                    this.pauseVideo();
                } else {
                    this.playVideo();
                }
            })
        }
    }

    getVideoState() {
        return this.PLAYER.getAttribute('js-video-control');
    }

    pauseVideo() {
        this.PLAYER.setAttribute('js-video-control', 'paused');
        this.PLAYER.querySelector('video').pause();
    }

    playVideo() {
        this.PLAYER.setAttribute('js-video-control', 'playing');
        this.PLAYER.querySelector('video').play();
    }
}