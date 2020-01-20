var fs = require('fs');
var template = require('./componentTemplate.js');
var singleComponentPath = './source/sass/imports/';

/**
 * Read json and Create scss files - for single components
 */
fs.readFile('./build/components.json', 'utf8', function (error, data) {
    
    var jsonData = JSON.parse(data);
    var objectKeysArray = Object.keys(jsonData);
    
    objectKeysArray.forEach(function (objKey) {
        
        var objValue = jsonData[objKey];
        var componentFileName = objKey;
        var imports = template.sassTemplate + '\n';
        
        for (var i = 0; i < objValue.components.length; i++) {
            imports += '        @import "../component/' + objValue.components[i] + '"; \n';
        }
        
        if (!fs.existsSync(singleComponentPath)) {
            fs.mkdirSync(singleComponentPath);
        }
    
        if (!fs.existsSync(singleComponentPath + componentFileName + '.scss')) {
            fs.writeFile(singleComponentPath + componentFileName + '.scss', imports,
                function (errors) {
                    (errors) ? console.log("Error Dewd!!!!!  : " + errors) :
                        console.log("Created new sass file:" + componentFileName + ".scss");
                });
        }
    })
});