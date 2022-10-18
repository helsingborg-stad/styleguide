let acceptedSuppliers = JSON.parse(localStorage.getItem('acceptedSuppliers')) ?? [];

const revealIframes = () => {
    [...document.querySelectorAll('.js-suppressed-iframe-wrapper')]
        .forEach(iframeWrapper => {
            const iframe = iframeWrapper.querySelector('iframe');
            const iframeUrl = new URL(iframe.getAttribute('data-src'));
            const iframeWrapperParent = iframeWrapper.parentNode;
            if(acceptedSuppliers.includes(iframeUrl.host)) {
                if(iframeWrapperParent.classList.contains('embed__ratio--1-1')) {
                    iframeWrapperParent.classList.replace('embed__ratio--1-1', 'embed__ratio--16-9');
                 }
                iframe.setAttribute('src', iframe.getAttribute('data-src'));
                iframeWrapper.classList.remove('js-suppressed-iframe-wrapper');
                iframeWrapper.style.position = 'static';
                iframeWrapper.querySelector('.js-suppressed-iframe-prompt').classList.add('u-display--none');
            } 
        }); 
}

const onClicklHandler = (iframeWrapper) => {
    const iframeUrl = new URL(iframeWrapper.querySelector('iframe').getAttribute('data-src'));
    if (!acceptedSuppliers.includes(iframeUrl.host) && iframeUrl.host !== "https" && iframeUrl.host !== "http") {
        acceptedSuppliers.push(iframeUrl.host);
    } 
    
    localStorage.setItem('acceptedSuppliers', JSON.stringify(acceptedSuppliers));
    
    revealIframes();
}

const suppressIframes = () => {
    [...document.querySelectorAll('.js-suppressed-iframe-wrapper')]
    .forEach(iframeWrapper => {
            const buttonEl = iframeWrapper.querySelector('[js-suppressed-iframe-button]');
            buttonEl.params = {iframe: iframeWrapper};
            buttonEl.addEventListener('click', () => {
                onClicklHandler(iframeWrapper);
            });
           
        });
}

export default () => addEventListener('DOMContentLoaded', () => {
    console.log(window.innerHeight, window.innerWidth);
    if (window.innerHeight > window.innerWidth) {
        [...document.querySelectorAll('.embed__ratio--16-9')].forEach(embed => {
            embed.classList.replace('embed__ratio--16-9', 'embed__ratio--1-1');
        });
    }
    if (acceptedSuppliers.length > 0 && 
        document.querySelectorAll('.js-suppressed-iframe-wrapper').length > 0 ) {
        [...document.querySelectorAll('.js-suppressed-iframe-wrapper')].forEach(iframeWrapper => {
            const iframe = iframeWrapper.querySelector('iframe');
            const iframeUrl = new URL(iframe.getAttribute('data-src'));
            const iframeWrapperParent = iframeWrapper.parentNode;
            if (acceptedSuppliers.includes(iframeUrl.host)) {
                 if (iframeWrapperParent.classList.contains('embed__ratio--1-1')) {
                    iframeWrapperParent.classList.replace('embed__ratio--1-1', 'embed__ratio--16-9');
                } 
                iframe.setAttribute('src', iframeWrapper.querySelector('iframe').getAttribute('data-src'));
                iframeWrapper.querySelector('.js-suppressed-iframe-prompt').style.display = 'none';
                iframeWrapper.classList.remove('js-suppressed-iframe-wrapper'); 
            }
        })
    }
    document.querySelectorAll('.js-suppressed-iframe-wrapper').length > 0 ? suppressIframes() : '';
});

