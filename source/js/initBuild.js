class initBuild {
    
    constructor() {
        this.sassComponentBuilder();
    }
    
    
    /**
     * Sending data to CSS compiler
     */
    sassComponentBuilder() {
        const self  = this;
        const generateCSS = document.querySelector('.c-button--generateCSS').getAttribute('id');
        document.getElementById(generateCSS).addEventListener('click', function (e) {
            
            const componentArray = [];
            const checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
            for (let i = 0; i < checkboxes.length; i++) {
                componentArray.push(checkboxes[i].value);
            }
            
            if (componentArray.length > 0) {
                self.fetchFormData(componentArray);
            }
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
                
                const markup = '&lt;link rel="stylesheet" id="styleguide-css" type="text/css" \n href="https://'+
                    window.location.hostname + res.cssFile + '" type="text/css" media="all"&gt;';
                document.getElementById('compiledCSS').innerHTML = markup;
            })
    };
}

export default initBuild;


