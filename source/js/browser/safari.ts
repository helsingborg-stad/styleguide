class Safari {
    constructor() {
    }

    private isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }

    private isLowDPI() {
        return window.devicePixelRatio < 2;
    }
}

export default Safari;