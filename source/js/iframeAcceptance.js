let acceptedSuppliers = JSON.parse(localStorage.getItem('acceptedSuppliers')) ?? [];

const template = ({ titleText, infoText, buttonText }) => (`
    <div class="js-suppressed-iframe-wrapper" style="position:relative;">
        <div class="js-suppressed-iframe-prompt" style="position:absolute; left:0; top:0; width:100%; height:100%; z-index:1; background-color: white; display: flex; align-items: center;">
            <div style="max-width: 600px; width: 100%; margin: auto; padding: 0 24px;">
            <h4 class="c-typography c-typography__variant--h2">${titleText}</h4>
            <p class="c-typography u-padding__bottom--4 c-typography__variant--p">${infoText}</p> 
                <button class="js-suppressed-iframe-button c-button c-button__filled c-button__filled--primary c-button--md" target="_top" type="button" aria-pressed="false" style="">   
                    <span class="c-button__label">
                        <span class="c-button__label-text">${buttonText}</span>
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
            const iframeUrl = new URL('https:'.concat(iframe.getAttribute('data-src')));
            if(acceptedSuppliers.includes(iframeUrl.host)) {
                iframe.setAttribute('src', iframe.getAttribute('data-src'));
                item.classList.add('u-display--none');
            }
        }); 
}

const onClicklHandler = (iframe) => {
    const iframeUrl = new URL('https:'.concat(iframe.getAttribute('data-src')));
    if (!acceptedSuppliers.includes(iframeUrl.host)) {
        acceptedSuppliers.push(iframeUrl.host);
    }
    localStorage.setItem('acceptedSuppliers', JSON.stringify(acceptedSuppliers));
    
    revealIframes();
}

const suppressIframes = () => {
  
    
    [...document.querySelectorAll('.js-suppressed-iframe')]
    .forEach(iframe => {

            const dataAttribute = JSON.parse(iframe.getAttribute('options') ?? '{}');
            
            const option = () => {
                console.log("körs");
                if (iframe.getAttribute('data-supplier') && iframe.getAttribute('data-policy')) {
                   let options = dataAttribute.knownSupplierLabels;
                   console.log(options);
                    const supplier = options.infoText.replace('{SUPPLIER_WEBSITE}', iframe.getAttribute('data-supplier')).replace('{SUPPLIER_POLICY}', iframe.getAttribute('data-policy'));
                    options.infoText = supplier;
                    return options;
                } else {
                    return dataAttribute.unknownSupplierLabels;
                }
            }

            const {titleText, infoText, buttonText } = option(); 
            const div = document.createElement('div');
            div.insertAdjacentHTML('beforeend', template({ titleText, infoText, buttonText }));
            const wrapper = div.querySelector("*");
            const button = wrapper.querySelector('.js-suppressed-iframe-button');
            iframe.parentNode.insertBefore(wrapper, iframe);
            wrapper.appendChild(iframe);
            button.params = {iframe: iframe};
            button.addEventListener('click', () => {
                onClicklHandler(iframe);
            });
            div.remove();
        });
}

export default () => addEventListener('DOMContentLoaded', () => {
    if(acceptedSuppliers.length > 0) {
        [...document.querySelectorAll('.js-suppressed-iframe')].forEach(iframe => {
            const iframeUrl = new URL('https:'.concat(iframe.getAttribute('data-src')));
            if (acceptedSuppliers.includes(iframeUrl.host)) {
                iframe.setAttribute('src', iframe.getAttribute('data-src'));
                iframe.classList.remove('js-suppressed-iframe');
            }
        })
    }
    suppressIframes();
});

