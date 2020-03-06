/**
 * Crypto for hash
 * @type {module:crypto}
 */
const crypto = require('crypto');

/**
 * FileSystem
 * @type {module:fs}
 */
const fs = require('fs');
const template = require('./componentTemplate');
const sass = require('node-sass');

/**
 * Server path
 * @type {string}
 */
const singleComponentPath = 'source/sass/imports';
const compiledComponentPath = 'assets/dist/css/compilations';


/**
 * Creating scss file
 * @param fileName
 * @param sassData
 */
const buildFile = (fileName, sassData) => {
    fs.writeFile(singleComponentPath + '/tmp/' + fileName + '.scss',
        sassData, function (error) {
            if (error) {
                console.log('Problem building file: ' + error);
            } else {
                moveFile(fileName);
            }
        });
};


/**
 * Move files from tmp to production
 * @param hash
 */
const moveFile = (hash) => {
    
    const serverObj = {
        'tmp': singleComponentPath + '/tmp/' + hash + '.scss',
        'scss': singleComponentPath + '/' + hash + '/' + hash + '.scss',
        'css': compiledComponentPath + '/' + hash + '.min.css'
    };
    
    fs.rename(serverObj.tmp, serverObj.scss, function (errors) {
        if (!errors) {
            runNodeSass(serverObj);
        } else {
            console.log(errors);
        }
    });
};


/**
 * Running Webpack to Compile and minify css
 * @param serverObj
 */
const runNodeSass = (serverObj) => {
    
    sass.render({
        file: serverObj.scss,
        outputStyle: 'compressed',
        outFile: serverObj.css,
    }, function (error, result) {
        
        if (error) {
            console.log('Error!');
        } else {
            fs.writeFile(serverObj.css, result.css, (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Custom compiled CSS file was created.');
            });
        }
        
    });
};


/**
 * Check if directories and files exists
 * @param fileName
 */
const checkFileExist = (fileName) => {
    
    if (!fs.existsSync(singleComponentPath)) {
        fs.mkdirSync(singleComponentPath);
    }
    
    if (!fs.existsSync(singleComponentPath + '/tmp/')) {
        fs.mkdirSync(singleComponentPath + '/tmp/');
    }
    
    if (!fs.existsSync(singleComponentPath + '/' + fileName + '/')) {
        fs.mkdirSync(singleComponentPath + '/' + fileName + '/');
    }
};


/**
 * Check if file-size has changed
 * @param fileName
 * @param sassData
 */
const checkFileSize = (fileName, sassData) => {
    
    if (fs.existsSync(singleComponentPath + '/' + fileName + '/' + fileName + '.scss')) {
        
        const statsTmp = fs.statSync(singleComponentPath + '/' + fileName + '/' + fileName + '.scss');
        const fileSizeInBytesTmp = statsTmp["size"];
        const stats = fs.statSync(singleComponentPath + '/' + fileName + '/' + fileName + '.scss');
        const fileSizeInBytes = stats["size"];
        
        if (fileSizeInBytesTmp !== fileSizeInBytes) {
            buildFile(fileName, sassData);
        }
        
    } else {
        buildFile(fileName, sassData);
    }
    
};


/**
 * Render CSS link
 * @param fileName
 */
const clientOutput = (fileName) => {
    return '/assets/dist/css/compilations/' + fileName + '.min.css';
};


/**
 * Creating Directory & SCSS import file with dependency imports
 * @param componentDependency
 * @returns {string}
 */
module.exports.build = (componentDependency) => {
    
    componentDependency = componentDependency.sort();
    
    let sassData = template.sassTemplate + '\n';
    let component = '';
    
    for (let i = 0; i < componentDependency.length; i++) {
        sassData += '        @import "../../component/' + componentDependency[i] + '"; \n';
        component += componentDependency[i];
    }
    
    const fileName = crypto.createHash('md5').update(component).digest("hex");
    
    checkFileExist(fileName);
    checkFileSize(fileName, sassData);
    
    return clientOutput(fileName);
};