/**
 * Filesystem
 * @type {module:fs}
 */
const fs = require('fs');

/**
 * Server paths
 * @type {module:path | path.PlatformPath | path}
 */
const path = require('path');

/**
 * Composer scss files
 */
const composeSass = require('./composeSass');

/**
 * lib server path
 * @type {string}
 */
const componentLib = 'source/library/src/Component/';

/**
 * Flatten directories
 * @param lists
 * @returns {*}
 */
const flatten = lists => {
    return lists.reduce((a, b) => a.concat(b), []);
};

/**
 * Map Directories
 * @param srcPath
 * @returns {string[]}
 */
const getDirectories = srcPath => {
    return fs
        .readdirSync(srcPath)
        .map(file => path.join(srcPath, file))
        .filter(path => fs.statSync(path).isDirectory());
};

/**
 * Get directory paths
 * @param srcPath
 * @returns {*[]}
 */
const getDirectoriesRecursive = srcPath => {
    return [srcPath, ...flatten(getDirectories(srcPath).map(getDirectoriesRecursive))];
};

/**
 * Get json data from Components
 * @param components
 * @returns {string}
 */
module.exports.initSassComponents = components => {
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
            const data = fs.readFileSync(jsonFile);
            const jsonData = JSON.parse(data);

            components.forEach(function(compSlug) {
                if (compSlug === jsonData.slug) {
                    const dependency = jsonData.dependency.sass.components;
                    if (dependency !== undefined && dependency.length !== 0) {
                        for (let i = 0; i < dependency.length; i++) {
                            !componentDependency.includes(dependency[i])
                                ? componentDependency.push(dependency[i])
                                : null;
                        }
                    }
                }
            });

            return componentDependency;
        });

        return composeSass.build(componentDependency);
    }
};
