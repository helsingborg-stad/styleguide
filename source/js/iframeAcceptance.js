class IframeAcceptance {
    initIframes() {
        const {title, content, buttonText} = document.suppressIframeLabels ? document.suppressIframeLabels : {
            title: 'Title',
            content: 'Content',
            buttonText: 'Button Text'
        };

        const accepted = localStorage.getItem('iframeAccepted') === 'accepted';
        localStorage.clear();
        accepted ? revealIframes() : suppressIframes();

        function markup(width, height, title, content, buttonText) {
            return `<div data-iframe-container style="height: ${height}px; width:${width}px">
                <div class="u-level-top u-position--absolute u-align-middle u-padding__x--3 u-display-block" data-suppressed-iframe style="width:${width}px;height:${height}px;backdrop-filter:blur(30px);">
                    <h2>${title}</h2>
                    <p>${content}</p> 
                    <button class="c-button c-button__filled c-button__filled--primary c-button--md" target="_top" type="button" aria-pressed="false" js-suppressed-iframe-button>   
                        <span class="c-button__label">
                            <span class="c-button__label-text">
                                ${buttonText}
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
            console.log('click');
            //localStorage.setItem('iframeAccepted', 'accepted');
            revealIframes();
        }
        
        function suppressIframes() {
    console.log("supress");
            [...document.querySelectorAll('iframe')].forEach(iframe => {
                const wrapper = document.createElement('div');
                wrapper.insertAdjacentHTML('beforeend', markup(iframe.width, iframe.height, "title", "content", "buttonText"));
                iframe.parentNode.insertBefore(wrapper, iframe);
                wrapper.firstChild.appendChild(iframe);
                wrapper.outerHTML = wrapper.innerHTML;
                
            });     
            let buttons = document.querySelectorAll('[js-suppressed-iframe-button]');
            console.log(buttons);
            buttons.forEach(button => {
                button.addEventListener('click', onClicklHandler);
            });
        }  
    }
}

export default IframeAcceptance;