const crypto = require('crypto');
const fs = require('fs');

const template = require('./componentTemplate');
const singleComponentPath = '../source/sass/imports';
const {exec} = require('child_process');

/**
 * Creating Directory & SCSS import file with dependency imports
 * @param componentDependency
 */
module.exports.build = (componentDependency) => {
    
    componentDependency = componentDependency.sort();
    
    let imports = template.sassTemplate + '\n';
    let encryptFileName = '';
    
    for (let i = 0; i < componentDependency.length; i++) {
        imports += '        @import "../../component/' + componentDependency[i] + '"; \n';
        encryptFileName += componentDependency[i];
    }
    
    const hmac = crypto.createHmac('sha256', 'a secret');
    hmac.update(encryptFileName);
    const fileName = hmac.digest('hex');
    
    if (!fs.existsSync(singleComponentPath)) {
        fs.mkdirSync(singleComponentPath);
    }
    
    if (!fs.existsSync(singleComponentPath + '/' + fileName + '/')) {
        fs.mkdirSync(singleComponentPath + '/' + fileName + '/');
        if (!fs.existsSync(singleComponentPath + '/' + fileName + '/' + fileName + '.scss')) {
            fs.writeFile(singleComponentPath + '/' + fileName + '/' + fileName + '.scss', imports,
                function (errors) {
                    (errors) ? console.log("Error creating scss file!!!!!  : " + errors) :
                        console.log("Created new sass file: " + fileName + ".scss");
                    
                    exec('cd / | npm run build-imports', (err, stdout, stderr) => {
                        if (err) {
                            //some err occurred
                            console.error(err)
                        } else {
                            // the *entire* stdout and stderr (buffered)
                            console.log(`stdout: ${stdout}`);
                            console.log(`stderr: ${stderr}`);
                        }
                    });
                    
                });
        }
    } else {
        console.log("File already exist!!!!!");
        console.log(singleComponentPath + '/' + fileName + '/' + fileName + '.scss');
    }
};