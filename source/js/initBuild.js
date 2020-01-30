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
                    const markup = '&lt;link rel="stylesheet" id="styleguide-css" type="text/css" \n href="https://' +
                        window.location.hostname + res.cssFile + '" type="text/css" media="all"&gt;';
                    
                    document.getElementById('compiledCSS').innerHTML = markup;
                    document.querySelector('.c-button--generateCSS').removeAttribute('disabled');
                }, 10000);
            })
    };
}

export default initBuild;


