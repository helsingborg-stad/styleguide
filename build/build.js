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
 * @type object log
 */
const log = require('consola');

/**
 * MakeDir in assets
 */
const makeDir = () => {
    if (!fs.existsSync('./assets/dist')) {
        fs.mkdirSync('./assets/dist');
        log.info('Dist dir created...');
    }
};

/**
 * Copy and move files
 */
const copyMoveFiles = () => {
    // TODO: Lägga till check och kolla om npm paketet är uppdaterat.

    if (fs.existsSync('node_modules/material-design-icons/iconfont/')) {
        copyFiles(
            [
                'node_modules/material-design-icons/iconfont/* ',
                'assets/dist/css/',
            ],
            3,
            function(errors) {
                if (!errors) {
                    log.success('Copy material design icon files to assets');

                    copyFiles(
                        [
                            'node_modules/material-design-icons/iconfont/material-icons.css ',
                            'source/sass/material/',
                        ],
                        3,
                        function(errors) {
                            if (!errors) {
                                log.info(
                                    'Copying material icon file css to source dir'
                                );

                                fs.rename(
                                    'source/sass/material/material-icons.css',
                                    'source/sass/material/_material-icons.scss',
                                    function(e) {
                                        !e
                                            ? log.success(
                                                  'Changed format on css file to scss'
                                              )
                                            : log.error('Error renaming file');
                                    }
                                );
                            } else {
                                log.error(new Error(errors));
                            }
                        }
                    );
                } else {
                    log.error(new Error(errors));
                }
            }
        );
    }
};

/**
 * Switch to handle term arguments
 */
switch (process.argv[2]) {
    case 'assets':
        makeDir();
        break;

    case 'assetsMaterial':
        copyMoveFiles();
        break;

    case 'buildSass':
        const sassComponents = require('./sassComponents/sassComponents');
        sassComponents.initSassComponents(process.argv[3]);
        break;
}
