import VideoControls from '../../js/helpers/video';

class Hero {
	heroVideos: NodeListOf<Element>;
	isReduced: MediaQueryList;
	constructor() {
		this.heroVideos = document.querySelectorAll('.c-hero--video');
		this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
		this.heroVideos.length && this.handleVideoPause();
	}

	handleVideoPause() {
		this.heroVideos.forEach((heroVideo) => {
			const video = new VideoControls(heroVideo);

			if (this.isReduced && this.isReduced.matches) {
				video.pauseVideo();
			}
		});
	}
}

export function init() {
	document.addEventListener('DOMContentLoaded', () => {
		console.log('Hero component loaded');
		new Hero();
	});
}
