/**
 * Filesystem
 * @type {module:fs}
 */
const fs = require('fs');

/**
 * Copy Files
 * @type {copyFiles}
 */
const copyFiles = require('copyfiles');

/**
 * Consola packet for nicer term log
 * @type object consLog
 */
const consLog = require('consola');

/**
 * Switch to handle term arguments
 */
switch (process.argv[2]) {
    
    /**
     * Make assets dir if not exists
     */
    case "assets":
        
        if (!fs.existsSync('./assets/dist')) {
            fs.mkdirSync('./assets/dist');
            consLog.info('Dist dir created...');
        }
        break;
    
    /**
     * Move Material font files and css from node modules to assets dir.
     * + Add it to sass for compilation
     */
    case "assetsMaterial":
        // TODO: Lägga till check och kolla om npm paketet är uppdaterat.
        if (fs.existsSync('node_modules/material-design-icons/iconfont/')) {
            copyFiles([
                'node_modules/material-design-icons/iconfont/* ',
                'assets/dist/css/'
            ], 3, function (errors) {
                
                if (!errors) {
                    consLog.success('Copy material design icon files to assets');
                    copyFiles([
                        'node_modules/material-design-icons/iconfont/material-icons.css ',
                        'source/sass/material/'
                    ], 3, function (errors) {
                        
                        if (!errors) {
                            consLog.info('Copying Material icon file css to source dir');
                            fs.rename('source/sass/material/material-icons.css',
                                'source/sass/material/_material-icons.scss',
                                function (e) {
                                    (!e) ? consLog.success('Changed format on css file to scss') :
                                        consLog.error('Error renaming file');
                                });
                            
                        } else {
                            consLog.error(new Error(errors));
                        }
                    });
                } else {
                    consLog.error(new Error(errors));
                }
            });
        }
        
        break;
    
    /**
     * Build sass files manually
     */
    case "buildSass":
        const sassComponents = require('./sassComponents/sassComponents');
        sassComponents.initSassComponents(process.argv[3]);
        break;
    
}
