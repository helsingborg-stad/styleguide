let acceptedSuppliers = JSON.parse(localStorage.getItem('acceptedSuppliers')) ?? [];

const template = ({ title, info, button }) => (`
    <div class="js-suppressed-iframe-wrapper" style="position:relative;">
        <div class="js-suppressed-iframe-prompt" style="position:absolute; left:0; top:0; width:100%; height:100%; z-index:1; background-color: white; display: flex; align-items: center;">
            <div style="max-width: 600px; width: 100%; margin: auto; padding: 0 24px;">
            <h4 class="c-typography c-typography__variant--h2">${title}</h4>
            <p class="c-typography u-padding__bottom--4 c-typography__variant--p">${info}</p> 
                <button class="js-suppressed-iframe-button c-button c-button__filled c-button__filled--primary c-button--md" target="_top" type="button" aria-pressed="false" style="">   
                    <span class="c-button__label">
                        <span class="c-button__label-text">${button}</span>
                    </span>
                </button>  
            </div>
        </div>
    </div>
`)

const revealIframes = () => {
    [...document.querySelectorAll('.js-suppressed-iframe-prompt')]
        .forEach(item => {
            const iframe = item.nextElementSibling;
            const iframeUrl = new URL(iframe.getAttribute('data-src'));
            if(acceptedSuppliers.includes(iframeUrl.host)) {
                iframe.setAttribute('src', iframe.getAttribute('data-src'));
                item.classList.add('u-display--none');
            }
        }); 
}

const onClicklHandler = (iframe) => {
    const iframeUrl = new URL(iframe.getAttribute('data-src'));

    if (!acceptedSuppliers.includes(iframeUrl.host) && iframeUrl.host !== "https" && iframeUrl.host !== "http") {
        acceptedSuppliers.push(iframeUrl.host);
    }
    localStorage.setItem('acceptedSuppliers', JSON.stringify(acceptedSuppliers));
    
    revealIframes();
}

const suppressIframes = () => {
  
    [...document.querySelectorAll('.js-suppressed-iframe')]
    .forEach(iframe => {
        
            let lang = JSON.parse(iframe.getAttribute('options') ?? '{}');
            const option = () => {
                if (iframe.getAttribute('data-supplier-name') && iframe.getAttribute('data-supplier-policy')) {

                    lang.knownLabels.info = lang.knownLabels.info.replace('{SUPPLIER_WEBSITE}', iframe.getAttribute('data-supplier-name')).replace('{SUPPLIER_POLICY}', iframe.getAttribute('data-supplier-policy'));

                    return lang.knownLabels;

                } else { 
                    return lang.unknownLabels;
                }
            }

            const {title, info, button } = option(); 
            const div = document.createElement('div');
            div.insertAdjacentHTML('beforeend', template({ title, info, button } ));
            const wrapper = div.querySelector("*");
            const buttonEl = wrapper.querySelector('.js-suppressed-iframe-button');
            iframe.parentNode.insertBefore(wrapper, iframe);
            wrapper.appendChild(iframe);
            buttonEl.params = {iframe: iframe};
            buttonEl.addEventListener('click', () => {
                onClicklHandler(iframe);
            });
            div.remove();
        });
}

export default () => addEventListener('DOMContentLoaded', () => {
    if(acceptedSuppliers.length > 0) {
        [...document.querySelectorAll('.js-suppressed-iframe')].forEach(iframe => {
            const iframeUrl = new URL(iframe.getAttribute('data-src'));
            if (acceptedSuppliers.includes(iframeUrl.host)) {
                iframe.setAttribute('src', iframe.getAttribute('data-src'));
                iframe.classList.remove('js-suppressed-iframe');
            }
        })
    }
    suppressIframes();
});

