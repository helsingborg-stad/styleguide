let acceptedSuppliers = JSON.parse(localStorage.getItem('acceptedSuppliers')) ?? [];

const revealIframes = () => {
    [...document.querySelectorAll('.js-suppressed-iframe')]
        .forEach(iframeWrapper => {
            const iframe = iframeWrapper.querySelector('iframe');
            const iframeUrl = new URL(iframeWrapper.getAttribute('data-src'));
            if(acceptedSuppliers.includes(iframeUrl.host)) {
                iframe.setAttribute('src', iframeWrapper.getAttribute('data-src'));
                iframeWrapper.classList.remove('js-suppressed-iframe');
                iframeWrapper.style.position = 'static';
                iframeWrapper.querySelector('.js-suppressed-iframe-prompt').classList.add('u-display--none');
            } 
        }); 
}

const onClicklHandler = (iframeWrapper) => {
    const iframeUrl = new URL(iframeWrapper.getAttribute('data-src'));
    if (!acceptedSuppliers.includes(iframeUrl.host) && iframeUrl.host !== "https" && iframeUrl.host !== "http") {
        acceptedSuppliers.push(iframeUrl.host);
    } 
    
    localStorage.setItem('acceptedSuppliers', JSON.stringify(acceptedSuppliers));
   
    revealIframes();
}

const suppressIframes = () => {
    [...document.querySelectorAll('.js-suppressed-iframe')]
    .forEach(iframeWrapper => {
            const buttonEl = iframeWrapper.querySelector('[js-suppressed-iframe-button]');
            buttonEl.params = {iframe: iframeWrapper};
            buttonEl.addEventListener('click', () => {
                onClicklHandler(iframeWrapper);
            });
           
        });
}

export default () => addEventListener('DOMContentLoaded', () => {
    /* if (acceptedSuppliers.length > 0 && document.querySelectorAll('.js-suppressed-iframe').length > 0 ) {
        [...document.querySelectorAll('.js-suppressed-iframe')].forEach(iframeWrapper => {
            const iframe = iframeWrapper.querySelector('iframe');
            const iframeUrl = new URL(iframeWrapper.getAttribute('data-src'));
            if (acceptedSuppliers.includes(iframeUrl.host)) {
                iframe.setAttribute('src', iframeWrapper.getAttribute('data-src'));
                iframeWrapper.querySelector('.js-suppressed-iframe-prompt').style.display = 'none';
                iframeWrapper.classList.remove('js-suppressed-iframe'); 
            }
        })
    } */
    document.querySelectorAll('.js-suppressed-iframe').length > 0 ? suppressIframes() : '';
});

