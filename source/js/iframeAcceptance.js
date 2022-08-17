class IframeAcceptance {
    initIframes() {
        const accepted = localStorage.getItem('iframeAccepted') === 'accepted';
        const iframes = document.querySelectorAll('iframe');
        
        accepted ? revealIframes() : suppressIframes();

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
            iframes.forEach(iframe => {
                const wrapper = document.createElement('div');
                wrapper.insertAdjacentHTML('beforeend', `<div data-iframe-container style="height: ${iframe.height}px; width:${iframe.width}px">
                    <div class="u-level-top u-position--absolute u-align--middle u-padding__x--3 u-display-block" data-suppressed-iframe style="width:${iframe.width}px;height:${iframe.height}px;backdrop-filter:blur(30px);">
                        <h2>
                                Informationen i den här rutan hämtas från en extern leverantör
                        </h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget viverra ex, in facilisis ex. Praesent sit amet massa felis. Interdum et malesuada fames ac ante ipsum primis in faucibus.
                        </p>  

                        <button class="c-button c-button__filled c-button__filled--primary c-button--md" target="_top" type="button" aria-pressed="false" js-suppressed-iframe-button>   
                            <span class="c-button__label">
                                <span class="c-button__label-text">
                                    Visa informationen
                                </span>
                            </span>
                        </button>  
                        </div>
                    </div>`);
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