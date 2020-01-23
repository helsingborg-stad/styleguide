const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const template = require('./componentTemplate.js');
const singleComponentPath = '../../source/sass/imports/';
const componentLib = '../../source/library/src/Component/';

/**
 * Flatten directories
 * @param lists
 * @returns {*}
 */
const flatten = (lists) => {
    return lists.reduce((a, b) => a.concat(b), []);
};


/**
 * Map Directories
 * @param srcpath
 * @returns {string[]}
 */
const getDirectories = (srcpath) => {
    return fs.readdirSync(srcpath)
        .map(file => path.join(srcpath, file))
        .filter(path => fs.statSync(path).isDirectory());
};


/**
 * Get direcorie paths
 * @param srcpath
 * @returns {*[]}
 */
const getDirectoriesRecursive = (srcpath) => {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
};


/**
 * Get json data from Components
 * @param components
 */
const getComponentsJson = (components) => {
    const componentDir = getDirectoriesRecursive(componentLib);
    if (componentDir.length > 0) {
        let fileList = [];
        componentDir.forEach(dir => {
            
            let files = fs.readdirSync(dir);
            files.forEach(file => {
                if (file.substring(file.lastIndexOf('.') + 1) === 'json') {
                    return fileList.push(dir + '/' + file);
                }
            });
        });
        
        let componentDependency = [];
        fileList.forEach(jsonFile => {
            let data = fs.readFileSync(jsonFile);
            const jsonData = JSON.parse(data);
            
            components.forEach(function (compSlug) {
                if (compSlug === jsonData.slug) {
                    const dependency = jsonData.dependency.sass.components;
                    if (dependency !== undefined && dependency.length !== 0) {
                        for (let i = 0; i < dependency.length; i++) {
                            if (!componentDependency.includes(dependency[i])) {
                                componentDependency.push(dependency[i]);
                            }
                        }
                    }
                }
            });
            return componentDependency;
        });
        
        buildSassImport(componentDependency);
    }
};


/**
 * Creating Directory & SCSS import file with dependency imports
 * @param componentDependency
 */
const buildSassImport = (componentDependency) => {
    
    componentDependency = componentDependency.sort();
    
    let imports = template.sassTemplate + '\n';
    let encryptFileName = '';
    
    for (let i = 0; i < componentDependency.length; i++) {
        imports += '        @import "../component/' + componentDependency[i] + '"; \n';
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
                });
        }
    } else {
        console.log("File already exist!!!!!");
    }
};

getComponentsJson(['button', 'icon', 'card']);

