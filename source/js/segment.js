class Segment {
    constructor(segment) {
        this.SEGMENT = segment;

        this.videoInteractions();
    }

    videoInteractions() {
        const btn = this.SEGMENT.querySelector('[js-segment__video--plaus]');
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
        return this.SEGMENT.getAttribute('js-segment__video--plaus');
    }

    pauseVideo() {
        this.SEGMENT.setAttribute('js-segment__video--plaus', 'paused');
        this.SEGMENT.querySelector('video').pause();
    }

    playVideo() {
        this.SEGMENT.setAttribute('js-segment__video--plaus', 'playing');
        this.SEGMENT.querySelector('video').play();
    }
}

export function initializeSegments() {
    const segments = document.querySelectorAll('.c-segment');

    [...segments].forEach((segment) => {
        new Segment(segment);
    });
}

export default Segment;