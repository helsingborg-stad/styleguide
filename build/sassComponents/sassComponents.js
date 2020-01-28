const fs = require('fs');
const path = require('path');
const composeSass = require('./composeSass');
const componentLib = 'source/library/src/Component/';


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
 * Get directory paths
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
module.exports.initSassComponents = (components) => {
    
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
 
        composeSass.build(componentDependency);
    }
};

