let acceptedSuppliers = JSON.parse(localStorage.getItem('acceptedSuppliers')) ?? [];

const revealIframes = () => {
    [...document.querySelectorAll('.js-suppressed-iframe-wrapper')]
        .forEach(iframeWrapper => {
            const iframe = iframeWrapper  .querySelector('iframe');
            const iframeUrl = new URL(iframe.getAttribute('data-src'));
            if(acceptedSuppliers.includes(iframeUrl.host)) {
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
            const iframe = iframeWrapper.querySelector('iframe');
            let lang = JSON.parse(iframe.getAttribute('options') ?? '{}');
            //console.log(iframe);

        if (iframe.getAttribute('data-supplier-name') && iframe.getAttribute('data-supplier-policy')) {
            console.log(iframe);
            console.log(lang);
            console.log(iframeWrapper.querySelector('h3'));
        }

            const option = () => {
                if (iframeWrapper.getAttribute('data-supplier-name') && iframe.getAttribute('data-supplier-policy')) {
                    lang.knownLabels.info = lang.knownLabels.info.replace('{SUPPLIER_WEBSITE}', iframe.getAttribute('data-supplier-name')).replace('{SUPPLIER_POLICY}', iframeWrapper.getAttribute('data-supplier-policy'));

                    return lang.knownLabels;

                } else { 
                    return lang.unknownLabels;
                }
            }

            const buttonEl = iframeWrapper.querySelector('[js-suppressed-iframe-button]');
            buttonEl.params = {iframe: iframeWrapper};
            buttonEl.addEventListener('click', () => {
                onClicklHandler(iframeWrapper);
            });
           
        });
}

export default () => addEventListener('DOMContentLoaded', () => {
    if(acceptedSuppliers.length > 0) {
        [...document.querySelectorAll('.js-suppressed-iframe-wrapper')].forEach(iframeWrapper => {
            const iframeUrl = new URL(iframeWrapper.querySelector('iframe').getAttribute('data-src'));
            if (acceptedSuppliers.includes(iframeUrl.host)) {
                iframeWrapper.querySelector('iframe').setAttribute('src', iframeWrapper.querySelector('iframe').getAttribute('data-src'));
                iframeWrapper.querySelector('.js-suppressed-iframe-prompt').style.display = 'none';
                iframeWrapper.classList.remove('js-suppressed-iframe-wrapper'); 
            }
        })
    }
    suppressIframes();
});

