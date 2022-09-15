const template = () => (`
    <div class="js-suppressed-iframe-wrapper" style="position:relative;">
        <div class="js-suppressed-iframe-prompt" style="position:absolute; left:0; top:0; width:100%; height:100%; z-index:1; background-color: white; display: flex; align-items: center;">
            <div style="max-width: 600px; width: 100%; margin: auto; padding: 0 24px;">
            <h4 class="c-typography c-typography__variant--h2">We need your acceptance to continue</h4>
            <p class="c-typography u-padding__bottom--4 c-typography__variant--p">This part of the website shows content from another website. By continue, you are accepting <a href="#policy" target="_blank">GDPR and privacy policy</a></p> 
                <button class="js-suppressed-iframe-button c-button c-button__filled c-button__filled--primary c-button--md" target="_top" type="button" aria-pressed="false" style="">   
                    <span class="c-button__label">
                        <span class="c-button__label-text">I understand, continue.</span>
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
            const button = wrapper.querySelector('.js-suppressed-iframe-button');
            iframe.parentNode.insertBefore(wrapper, iframe);
            wrapper.appendChild(iframe);
            button.addEventListener('click', onClicklHandler);
            div.remove();
        });
}


export default () => addEventListener('DOMContentLoaded', localStorage.getItem('iframeAccepted') !== 'accepted' ? suppressIframes : () => {});