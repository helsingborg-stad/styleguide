const crypto = require('crypto');
const fs = require('fs');
const template = require('./componentTemplate');
const singleComponentPath = 'source/sass/imports';
const {exec} = require('child_process');

/**
 * Creating scss file
 * @param fileName
 */
const buildFile = (fileName, sassData) => {
    
    fs.writeFile(singleComponentPath + '/tmp/' + fileName + '.scss', sassData,
        function (errors) {
            (errors) ? console.log("Error creating scss file!!!!!  : " + errors) :
                console.log("Created new sass file: " + fileName + ".scss");
        });
};


/**
 * Running Webpack to Compile and minify css
 */
const runWebpack = () => {
    
    exec('cd / | npm run build-imports', (err, stdout, stderr) => {
        if (err) {
            console.error(err)
        } else {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
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
    fs.rename(tmpPath, newPath, function (err) {
        if (err) throw err;
            console.log('Successfully Moved file!')
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
            buildFile(fileName, sassData);
            moveFile(fileName, singleComponentPath);
        }

    } else {
        buildFile(fileName, sassData);
        moveFile(fileName, singleComponentPath);
    }
};


const clientOutput = (fileName) => {
    /**document.getElementById('onlineCompiledComponents')
        .setAttribute('href', '/assets/dist/css/compilations/'+fileName+'/'+fileName+'.min.css');
    */
}

/**
 * Creating Directory & SCSS import file with dependency imports
 * @param componentDependency
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
    runWebpack();
    clientOutput(fileName);
};