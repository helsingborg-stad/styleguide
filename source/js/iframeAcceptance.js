let acceptedSuppliers = JSON.parse(localStorage.getItem('acceptedSuppliers')) ?? [];

const template = ({ title, info, button }) => (`
   
`)

const revealIframes = () => {
    [...document.querySelectorAll('.js-suppressed-iframe-wrapper')]
        .forEach(item => {
            const iframe = item.querySelector('iframe');
            const iframeUrl = new URL(iframe.getAttribute('data-src'));
            if(acceptedSuppliers.includes(iframeUrl.host)) {
                iframe.setAttribute('src', iframe.getAttribute('data-src'));
                item.classList.remove('js-suppressed-iframe-wrapper');
                item.style.position = 'static';
                item.querySelector('.js-suppressed-iframe-prompt').classList.add('u-display--none');
            }
        }); 
}

const onClicklHandler = (iframe) => {
    const iframeUrl = new URL(iframe.querySelector('iframe').getAttribute('data-src'));
    if (!acceptedSuppliers.includes(iframeUrl.host) && iframeUrl.host !== "https" && iframeUrl.host !== "http") {
        acceptedSuppliers.push(iframeUrl.host);
    } 
    
    localStorage.setItem('acceptedSuppliers', JSON.stringify(acceptedSuppliers));
    
    revealIframes();
}

const suppressIframes = () => {
  
    [...document.querySelectorAll('.js-suppressed-iframe-wrapper')]
    .forEach(iframe => {
            let lang = JSON.parse(iframe.getAttribute('options') ?? '{}');
            console.log(iframe);

            const option = () => {
                if (iframe.getAttribute('data-supplier-name') && iframe.getAttribute('data-supplier-policy')) {
                    lang.knownLabels.info = lang.knownLabels.info.replace('{SUPPLIER_WEBSITE}', iframe.getAttribute('data-supplier-name')).replace('{SUPPLIER_POLICY}', iframe.getAttribute('data-supplier-policy'));

                    return lang.knownLabels;

                } else { 
                    return lang.unknownLabels;
                }
            }
 
            console.log(iframe.querySelector('[js-suppressed-iframe-button]'));
            const buttonEl = iframe.querySelector('[js-suppressed-iframe-button]');
            buttonEl.params = {iframe: iframe};
            buttonEl.addEventListener('click', () => {
                onClicklHandler(iframe);
            });
           
        });
}

export default () => addEventListener('DOMContentLoaded', () => {
    if(acceptedSuppliers.length > 0) {
        [...document.querySelectorAll('.js-suppressed-iframe-wrapper')].forEach(iframe => {
            const iframeUrl = new URL(iframe.querySelector('iframe').getAttribute('data-src'));
            if (acceptedSuppliers.includes(iframeUrl.host)) {
                iframe.querySelector('iframe').setAttribute('src', iframe.querySelector('iframe').getAttribute('data-src'));
                iframe.querySelector('.js-suppressed-iframe-prompt').style.display = 'none';
                iframe.classList.remove('js-suppressed-iframe-wrapper'); 
            }
        })
    }
    suppressIframes();
});

