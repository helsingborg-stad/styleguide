/**
 * require babel-register and set Babel presets options to es2016
 * - Npm package
 */
require('babel-register')({
    presets: ['es2016'],
});

/**
 * Consola packet for nicer term log - Npm package
 * @type object log
 */
const log = require('consola');

/**
 * Filesystem - Npm package
 * @type {module:fs}
 */
const fs = require('fs');

/**
 * Copy Files - Npm package
 * @type {copyFiles}
 */
const copyFiles = require('copyfiles');

/**
 * Build Class
 */
class Build {
    constructor(processArgs) {
        this.serverLocation = {
            distLocation: 'assets/dist',
            sourceLocation: 'source/sass',
            distCSSLocation: 'assets/dist/css/',
            distSCSSLocation: 'source/sass/material/',
            nodeMaterialLocation: './node_modules/material-design-icons/iconfont/',
        };

        this.handleFiles(processArgs);
    }

    /**
     * Handle Files
     * @param processArgs
     */
    handleFiles(processArgs) {
        if (processArgs === 'assets') {
            this.makeDir();
        } else if (processArgs === 'assetsMaterial') {
            this.copyMoveFiles();
        }
    }

    /**
     * MakeDir in assets
     */
    makeDir() {
        if (!fs.existsSync(this.serverLocation.distLocation)) {
            fs.mkdirSync(this.serverLocation.distLocation);
            log.info('Dist dir created...');
        }
    }

    /**
     * Copy and move files
     */
    copyMoveFiles() {
        // TODO: Lägga till check och kolla om npm paketet är uppdaterat.

        let self = this;

        if (fs.existsSync(this.serverLocation.nodeMaterialLocation)) {
            copyFiles(
                [
                    this.serverLocation.nodeMaterialLocation + '*',
                    this.serverLocation.distCSSLocation,
                ],
                3,
                function(errors) {
                    if (!errors) {
                        log.success('Copy material design icon files to assets');

                        copyFiles(
                            [
                                self.serverLocation.nodeMaterialLocation + 'material-icons.css ',
                                self.serverLocation.distSCSSLocation,
                            ],
                            3,
                            function(errors) {
                                if (!errors) {
                                    log.info('Copying material icon file css to source dir');

                                    fs.rename(
                                        self.serverLocation.distSCSSLocation + 'material-icons.css',
                                        self.serverLocation.distSCSSLocation +
                                            '_material-icons.scss',
                                        function(e) {
                                            !e
                                                ? log.success('Changed format on css file to scss')
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
    }
}

new Build(process.argv[2]);
