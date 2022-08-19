class IframeAcceptance {
    initIframes() {
        
        function markup(height, width, classes) {
            return `<div data-iframe-container style="height: ${height}; ${width}" class="${classes}">
            <div class="u-level-2 u-position--absolute u-align-middle u-padding__x--3 u-padding__y--3 u-flex-direction--column u-overflow--auto" data-suppressed-iframe style="${width}height:${height};backdrop-filter:blur(30px);display:flex;">
            <h4 class="c-typography c-typography__variant--h2">Informationen i den här rutan hämtas från en extern leverantör</h4>
            <p class="c-typography u-padding__bottom--4 c-typography__variant--p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In libero metus, bibendum id dui non, sollicitudin venenatis orci. In venenatis mi mattis, consectetur ipsum sit amet, porta orci.</p> 
            <button class="c-button c-button__filled c-button__filled--primary c-button--md" target="_top" type="button" aria-pressed="false" style="height:0;padding: calc(var(--base, 8px) * 3) calc(var(--base, 8px) * 4)" js-suppressed-iframe-button>   
            <span class="c-button__label">
            <span class="c-button__label-text">
            Visa informationen
            </span>
            </span>
            </button>  
            </div>
            </div>`
        }
        
        function revealIframes() {
            document.querySelectorAll('[data-suppressed-iframe]').forEach(item => {
                item.classList.add('u-display--none');
            });
        }
        
        function onClicklHandler() {
            localStorage.setItem('iframeAccepted', 'accepted');
            revealIframes();
        }
        
        function suppressIframes() {
            [...document.querySelectorAll('iframe')].forEach(iframe => {
                const wrapper = document.createElement('div');
                const isVideo = iframe.parentElement.classList.contains("embed");
                console.log(!iframe.height);
                wrapper.insertAdjacentHTML('beforeend', markup(isVideo || !iframe.height ? "100%" : iframe.height + "px", isVideo || !iframe.width ? "width:100%;" : "max-width:" + iframe.width + "px;", isVideo ? "u-position--static" : "u-position--relative"));
                iframe.parentNode.insertBefore(wrapper, iframe);
                wrapper.firstChild.appendChild(iframe);
                wrapper.outerHTML = wrapper.innerHTML;
                
            });     
            let buttons = document.querySelectorAll('[js-suppressed-iframe-button]');
            buttons.forEach(button => {
                button.addEventListener('click', onClicklHandler);
            });
        }  

        localStorage.getItem('iframeAccepted') === 'accepted' ? revealIframes() : suppressIframes();
    }
}

export default IframeAcceptance;