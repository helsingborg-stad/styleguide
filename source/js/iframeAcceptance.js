class IframeAcceptance {
    initIframes() {
        const {title, content, buttonText} = document.suppressIframeLabels ? document.suppressIframeLabels : {
            title: 'Title',
            content: 'Content',
            buttonText: 'Button Text'
        };

        localStorage.clear();
        const accepted = localStorage.getItem('iframeAccepted') === 'accepted';

        accepted ? revealIframes() : suppressIframes();

        function markup(width, height, title, content, buttonText) {
            return `<div data-iframe-container style="height: ${height}px; width:100%">
                <div class="u-level-top u-position--absolute u-align-middle u-padding__x--3 u-padding__y--3 u-flex-direction--column u-overflow--auto" data-suppressed-iframe style="width:100%;height:100%;backdrop-filter:blur(30px);display:flex;">
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
            console.log("reveal");
            document.querySelectorAll('[data-suppressed-iframe]').forEach(item => {
                item.classList.add('u-display--none');
            });
        }
        
        function onClicklHandler() {
            console.log("click");
            //localStorage.setItem('iframeAccepted', 'accepted');
            revealIframes();
        }
        
        function suppressIframes() {
            [...document.querySelectorAll('iframe')].forEach(iframe => {
                const wrapper = document.createElement('div');
                wrapper.insertAdjacentHTML('beforeend', markup(iframe.width, iframe.parentElement.classList.contains("embed") ? iframe.parentElement.offsetHeight : iframe.height, "title", "content", "buttonText"));
                iframe.parentNode.insertBefore(wrapper, iframe);
                wrapper.firstChild.appendChild(iframe);
                wrapper.outerHTML = wrapper.innerHTML;
                
            });     
            let buttons = document.querySelectorAll('[js-suppressed-iframe-button]');
            buttons.forEach(button => {
                button.addEventListener('click', onClicklHandler);
            });
        }  
    }
}

export default IframeAcceptance;