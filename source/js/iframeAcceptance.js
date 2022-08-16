class IframeAcceptance {
    initIframes() {
        console.log("körs");
        const accepted = localStorage.getItem('iframeAccepted') === 'accepted';
        const iframeContainers = document.querySelectorAll('[data-iframe-container]');
        const buttons = document.querySelectorAll('[data-js-toggle-trigger="show-iframe"]');

        if (!accepted && buttons > 0) {
            for (const button of buttons) {
                button.addEventListener('click', showIframe);
            }
        }

        if (accepted && iframeContainers > 0) {
            showIframe();
        }

        function showIframe() {

            localStorage.setItem('iframeAccepted', "accepted");

            for (let iframeContainer of iframeContainers) {
                let iframeAcceptanceWrapper = iframeContainer.querySelector('[data-iframe-acceptance-wrapper]');
                let iframe = iframeContainer.querySelector('iframe');
                iframeAcceptanceWrapper.style.display = 'none';
                iframe.style.filter = "none";
                iframe.style.pointerEvents = "auto";
            }
        }
    }
}

export default IframeAcceptance;