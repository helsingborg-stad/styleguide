class initBuild {
    
    constructor() {
        this.sassComponentBuilder();
    }
    
    
    /**
     * Sending data to CSS compiler
     */
    sassComponentBuilder() {
        const self = this;
        const generateCSS = document.querySelector('.c-button--generateCSS').getAttribute('id');
        document.getElementById(generateCSS).addEventListener('click', function (e) {
            
            const componentArray = [];
            const checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
            
            for (let i = 0; i < checkboxes.length; i++) {
                componentArray.push(checkboxes[i].value);
            }
            
            if (!document.body.classList.contains('u-display--none')) {
                document.querySelector('.onlineCompiledComponents')
                    .classList.add('u-display--none');
            }
            
            if (componentArray.length > 0) {
                
                document.querySelector('.SelectedComponents').innerHTML = '';
                document.querySelector('.SelectedComponentsTitle').innerHTML = '';
                
                for (let i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
        
                        let node = document.createElement("span");
                        let textNode = document.createTextNode(componentArray[i]);
                        
                        node.appendChild(textNode);
                        node.classList.add('componentList');
                        document.querySelector('.SelectedComponents').appendChild(node);
 
                }
                document.querySelector('.c-loader--text').classList.remove('u-display--none');
                document.querySelector('.selectedComponentsLoader').classList.remove('u-display--none');
                
                document.querySelector('.SelectedComponentsTitle')
                    .innerHTML = 'Compiling CSS with following components:';
                self.fetchFormData(componentArray);
            }
            
            document.querySelector('.c-button--generateCSS').blur();
            document.querySelector('.c-button--generateCSS').innerHTML = 'Compiling CSS';
            document.querySelector('.c-button--generateCSS').setAttribute('disabled', 'disabled');
        });
    };
    
    
    /**
     * FetchData - Send componentData to node
     * @param componentArray
     */
    fetchFormData(componentArray) {
        const self = this;
        fetch("http://localhost:1337/compileSassComponent", {
            method: "POST",
            mode: 'cors',
            body: JSON.stringify({
                "payload": componentArray
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                return res.json();
            })
            .then(res => {
                setTimeout(function () {
                    document.querySelector('.onlineCompiledComponents')
                        .classList.remove('u-display--none');
                    document.querySelector('.selectedComponentsLoader').classList.add('u-display--none');
                    document.querySelector('.c-loader--text').classList.add('u-display--none');
                    document.querySelector('.c-button--generateCSS').innerHTML = 'Generate CSS';
                    document.getElementById('compiledCSS').innerHTML = self.markupTemplate(window
                        .location.hostname + res.cssFile);
                    document.querySelector('.c-button--generateCSS').removeAttribute('disabled');
                }, 10000);
            })
    };
    
    /**
     * Markup template
     * @param cssfile
     * @returns {string}
     */
    markupTemplate(cssfile){
        return  '<span class="token punctuation">&lt;</span><span class="token tag">link</span> ' +
                '<span class="token attr-name">rel="</span>' +
                '<span class="token attr-value">stylesheet</span><span class="token attr-name">"</span> ' +
                '<span class="token attr-name">id="</span><span class="token attr-value">styleguide-css</span>' +
                '<span class="token attr-name">"</span> <span class="token attr-name">type="</span>' +
                '<span class="token attr-value">text/css</span><span class="token attr-name">"</span>' +
                ' <span class="token attr-name">href="</span><span class="token attr-value">' +
                '<a href="https://' + cssfile +'" target="_blank">https://'+cssfile+'</a>'+
                '</span><span class="token attr-name">"</span>' +
                ' <span class="token attr-name">type="</span><span class="token attr-value">text/css</span>' +
                '<span class="token attr-name">"</span> <span class="token attr-name">media="</span>' +
                '<span class="token attr-value">all</span><span class="token attr-name">"</span>' +
                '<span class="token punctuation">&gt;</span>';
    }
    
}

export default initBuild;


