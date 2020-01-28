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
    }).then(function(response) {
        console.log(response.status);
    }, function(error) {
        error.message;
    });
    
};

export default sassComponentBuilder;


