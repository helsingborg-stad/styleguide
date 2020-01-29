/**
 * Sending data to CSS compiler
 */
const sassComponentBuilder = () => {
    
    document.querySelector('.c-button--generateCSS').addEventListener("click",
        function (e) {
            
            const componentArray = [];
            const checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
            
            for (let i = 0; i < checkboxes.length; i++) {
                componentArray.push(checkboxes[i].value)
            }
    
            fetchFormData(componentArray);
        });
};

/**
 * FetchData - Send componentData to node
 * @param componentArray
 */
const fetchFormData = (componentArray) => {
    
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
        .then(res=>{
            console.log("res1",res);
            return res.json();
        })
        .then(res=>{

           /*document.querySelector('.onlineCompiledComponents').innerHTML =
                '<link rel="stylesheet" id="styleguide-css" type="text/css" href="'+
                res.cssFile + '" type="text/css" media="all">';*/
            document.querySelector('.onlineCompiledComponents').innerHTML = res.cssFile;
        })
};

export default sassComponentBuilder;


