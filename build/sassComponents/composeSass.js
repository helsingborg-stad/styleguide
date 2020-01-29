const crypto = require('crypto');
const fs = require('fs');
const template = require('./componentTemplate');
const singleComponentPath = 'source/sass/imports';
const {exec} = require('child_process');
const { promisify } = require("util");

/**
 * Creating scss file
 * @param fileName
 */
const buildFile = (fileName, sassData, moveFile) => {
    fs.writeFile(singleComponentPath + '/tmp/' + fileName + '.scss',
        sassData, function(error) {
        if(error) {
            console.log('[write auth]: ' + err);
        } else {
            console.log('[write auth]: success');
            moveFile(fileName);
        }
    });
    
};


/**
 * Move files from tmp to production
 * @param hash
 * @param singleComponentPath
 */
const moveFile = (hash) => {
    
    const tmpPath = singleComponentPath + '/tmp/' + hash + '.scss';
    const newPath = singleComponentPath + '/' + hash + '/' + hash + '.scss';
    fs.rename(tmpPath, newPath, function (errors, newPath) {
        if (!errors) {
            console.log('Successfully Moved file!');
            runWebpack(newPath);
        } else {
            console.log(errors);
        }
    });
};

/**
 * Running Webpack to Compile and minify css
 */
const runWebpack = (fileName) => {
    setTimeout(function (){
        exec('cd / | npm run build-imports', (errors, stdout, stderr) => {
            if (errors) {
                console.error(errors)
            } else {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            }
        });
        
    }, 2000);
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
 * Check if filesize has changed
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
            buildFile(fileName, sassData, moveFile);
        }

    } else {
        buildFile(fileName, sassData, moveFile);
    }
    
};


/**
 * Render CSS link
 * @param fileName
 */
const clientOutput = (fileName) => {
    const output = '/assets/dist/css/compilations/'+ fileName+'/'+fileName+'.min.css';
    return output;
    
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
    let fileName = '';
    
    for (let i = 0; i < componentDependency.length; i++) {
        sassData += '        @import "../../component/' + componentDependency[i] + '"; \n';
        component += componentDependency[i];
    }
    
    fileName = crypto.createHash('md5').update(component).digest("hex");
    
    checkFileExist(fileName);
    checkFileSize(fileName, sassData);
    return clientOutput(fileName);
};