class initBuild {
    
    constructor() {
        this.sassComponentBuilder();
    }
    
    /**
     * Copy Markup to clipboard....
     */
    copyGenLinks() {
        const copyLink = document.querySelector('.c-button--copy-compiled-link').getAttribute('id');
        document.getElementById(copyLink).addEventListener('click', function (element) {
            navigator.clipboard.writeText(document.getElementById('compiledCSS').innerText)
                .then(() => {
                    document.querySelector('.c-button--copy-compiled-link').innerText = 'COPIED!';
                    setTimeout(function () {
                        document.querySelector('.c-button--copy-compiled-link').innerText = 'COPY';
                    }, 3000);
                })
                .catch(err => {
                    console.error('Sorry! - Could not copy markup: ', err);
                });
        });
    }
    
    /**
     * Sending data to CSS compiler
     */
    sassComponentBuilder() {
        
        const self = this;
        
        if (!document.querySelector('.c-button--generate-css')) {
            return;
        }
        
        // Prepare to generate build
        const generateCSS = document.querySelector('.c-button--generate-css').getAttribute('id');
        document.getElementById(generateCSS).addEventListener('click', function (e) {
            
            self.changeMarkupState('preBuild', null);
            
            const componentArray = [];
            const checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
            
            // Loop through all component checkboxes
            for (let i = 0; i < checkboxes.length; i++) {
                componentArray.push(checkboxes[i].value);
            }
            
            // Set display none to CSS Link Code area
            if (!document.body.classList.contains('u-display--none')) {
                document.querySelector('.online-compiled-components').classList.add('u-display--none');
            }
            
            if (!componentArray.length > 0) {
                return;
            }
            
            // Get selected component values and create list of component from selection
            for (let i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = false;
                
                let node = document.createElement("span");
                let textNode = document.createTextNode(componentArray[i]);
                
                node.appendChild(textNode);
                node.classList.add('component-list', 'c-link', 'c-tags', 'c-tag--default');
                node.setAttribute('disabled', 'disabled');
                document.querySelector('.selected-components').appendChild(node);
                
            }
            
            // Create SCSS and Build CSS
            self.changeMarkupState('build', null);
            self.fetchFormData(componentArray);
            
            // Change markup
            self.changeMarkupState('postBuild', null);
        });
    };
    
    
    /**
     * FetchData - Send componentData to node
     * Build SCSS & compile SCC
     * @param componentArray
     */
    fetchFormData(componentArray) {
        const self = this;
        
        fetch("http://localhost:1337/compilesasscomponent", {
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
                // Wait for 10 secs until stuff is done....
                setTimeout(function () {
                    const cssLink = res.cssFile;
                    const cssUrl = 'https://' + window.location.hostname + cssLink;
                    
                    self.changeMarkupState('result', cssUrl);
                    self.copyGenLinks();
                    
                }, 2000);
            })
    };
    
    
    /**
     * Change stuff in markup
     * @param cssUrl
     */
    changeMarkupState(buildState, cssUrl) {
        
        switch (buildState) {
            
            case "preBuild":
                document.querySelector('.selected-components').innerHTML = '';
                document.querySelector('.Selected-components-title').innerHTML = '';
                break;
            
            case "build":
                document.querySelector('.c-loader--text').classList.remove('u-display--none');
                document.querySelector('.selected-components-loader').classList.remove('u-display--none');
                document.querySelector('.Selected-components-title')
                    .innerHTML = 'Compiling CSS with following components:';
                break;
            
            case "postBuild":
                document.querySelector('.c-button--generate-css').blur();
                document.querySelector('.c-button--generate-css').innerHTML = 'Compiling CSS';
                document.querySelector('.c-button--generate-css')
                    .setAttribute('disabled', 'disabled');
                break;
            
            case "result":
                document.querySelector('.online-compiled-components').classList.remove('u-display--none');
                document.querySelector('.selected-components-loader').classList.add('u-display--none');
                document.querySelector('.c-loader--text').classList.add('u-display--none');
                document.querySelector('.c-button--generate-css').innerHTML = 'Generate CSS';
                document.querySelector('.c-button--generate-css').removeAttribute('disabled');
                document.getElementById('css-code-template').setAttribute('href', cssUrl);
                document.getElementById('css-code-template').innerHTML = cssUrl;
                break;
        }
    };
}

export default initBuild;


