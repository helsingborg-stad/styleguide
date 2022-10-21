let acceptedSuppliers = JSON.parse(localStorage.getItem('acceptedSuppliers')) ?? [];

const revealIframe = (iframeWrapper) => {
    const template = iframeWrapper.querySelector('template');
    const iframeContent = iframeWrapper.querySelector('.c-acceptance__content');
    iframeWrapper.querySelector('.js-suppressed-iframe-prompt').classList.add('u-display--none');
    iframeWrapper.classList.remove('js-suppressed-iframe');
    //iframeWrapper.style.position = 'static';
    let clone = template.content.cloneNode(true);
    iframeContent.appendChild(clone);
    const iframe = iframeContent.querySelector('iframe');
    if (iframeWrapper.classList.contains('c-acceptance--video')) {
        embedVideo(iframe, iframeWrapper);
    } else {
        iframe.setAttribute('src', iframe.getAttribute('data-src'));
    }
}

const embedVideo = (iframe, iframeWrapper) => {
    console.log("hej");
    const embed = iframeWrapper.parentNode;
    console.log(embed);
}


const revealIframes = () => {
    [...document.querySelectorAll('.js-suppressed-iframe')]
        .forEach(iframeWrapper => {
            const iframeUrl = new URL(iframeWrapper.getAttribute('data-src'));

           if(acceptedSuppliers.includes(iframeUrl.host)) {
                revealIframe(iframeWrapper);
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
            iframeWrapper.querySelector('.js-suppressed-iframe-prompt').style.display = 'flex';
            const buttonEl = iframeWrapper.querySelector('[js-suppressed-iframe-button]');
            buttonEl.params = {iframe: iframeWrapper};
            buttonEl.addEventListener('click', () => {
                onClicklHandler(iframeWrapper);
            });
           
        });
}

export default () => addEventListener('DOMContentLoaded', () => {
    if (acceptedSuppliers.length > 0 && document.querySelectorAll('.js-suppressed-iframe').length > 0 ) {
        [...document.querySelectorAll('.js-suppressed-iframe')].forEach(iframeWrapper => {
            const iframeUrl = new URL(iframeWrapper.getAttribute('data-src'));
            console.log(iframeUrl);
            if (acceptedSuppliers.includes(iframeUrl.host)) {
               revealIframe(iframeWrapper);
            }
        })
    }
    document.querySelectorAll('.js-suppressed-iframe').length > 0 ? suppressIframes() : '';
});

