const template = () => (`
    <div class="js-suppressed-iframe-wrapper" style="position:relative;">
        <div class="js-suppressed-iframe-prompt" style="position:absolute; left:0; top:0; width:100%; height:100%; z-index:1; background-color: white; display: flex; align-items: center;">
            <div style="max-width: 600px; width: 100%; margin: auto; padding: 0 24px;">
            <h4 class="c-typography c-typography__variant--h2">Informationen i den här rutan hämtas från en extern leverantör</h4>
            <p class="c-typography u-padding__bottom--4 c-typography__variant--p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In libero metus, bibendum id dui non, sollicitudin venenatis orci. In venenatis mi mattis, consectetur ipsum sit amet, porta orci.</p> 
                <button class="js-suppressed-iframe-button c-button c-button__filled c-button__filled--primary c-button--md" target="_top" type="button" aria-pressed="false" style="">   
                    <span class="c-button__label">
                        <span class="c-button__label-text">Visa informationen</span>
                    </span>
                </button>  
            </div>
        </div>
    </div>
`)

const revealIframes = () => {
    [...document.querySelectorAll('.js-suppressed-iframe-prompt')]
        .forEach(item => {
            item.classList.add('u-display--none');
        });
}

const onClicklHandler = () => {
    localStorage.setItem('iframeAccepted', 'accepted');
    revealIframes();
}

const suppressIframes = () => {
    [...document.querySelectorAll('.js-suppressed-iframe')]
        .forEach(iframe => {
            const div = document.createElement('div');
            div.insertAdjacentHTML('beforeend', template());
            const wrapper = div.querySelector("*");
            iframe.parentNode.insertBefore(wrapper, iframe);
            div.remove();
            wrapper.appendChild(iframe);
            wrapper.querySelector('.js-suppressed-iframe-button').addEventListener('click', onClicklHandler);
        });
}


export default () => addEventListener('DOMContentLoaded', localStorage.getItem('iframeAccepted') !== 'accepted' ? suppressIframes : () => {});