const log = require('consola');
const fs = require('fs');
const https = require('https');
const copyFiles = require('copyfiles');


require('@babel/register')({
    presets: ['es2016'],
});

class Build {
    constructor(processArgs) {
        this.dist = 'assets/dist/';
        this.sass = 'source/sass/';
        this.distCSS = `${this.dist}/css/`;
        this.materialSCSS = `${this.sass}/material/`;
        this.iconFont = './node_modules/material-design-icons-iconfont/dist/';
        this.iconsMetadata =`${this.distCSS}/fonts/icons.json`;

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
        if (!fs.existsSync(this.dist)) {
            fs.mkdirSync(this.dist);
            log.info('Dist dir created');
        }
    }

    /**
     * Copy and move files
     */
    copyMoveFiles() {


        new Promise(
            (resolve) => copyFiles(
            [
                `${this.iconFont}fonts/*`,
                this.distCSS,
            ],
            3,
            resolve)
        )
        .then(() => { 
            log.success('Copy material design icon files to assets');
            return new Promise((resolve) => {
                copyFiles(
                    [
                        `${this.iconFont}material-design-icons.css`,
                        this.materialSCSS,
                    ],
                    3,
                    resolve);
            })
        })
        .then(() => {
            return new Promise((resolve) => {
                fs.rename(
                    `${this.materialSCSS}material-design-icons.css`,
                    `${this.materialSCSS}_material-icons.scss`,
                    resolve
                );
            })
        })
        .then(() => {
            log.success('Changed format on css file to scss');
            return new Promise((resolve) => {
                https.get('https://fonts.google.com/metadata/icons', (response) => {
                    const file = fs.createWriteStream(this.iconsMetadata);
                    response.pipe(file);
                    file.on('finish', () => {resolve(file)});
                });
            })
        })
        .then((file) => {
            return new Promise((resolve) => {
                file.close();
                let metadata = fs.readFileSync(this.iconsMetadata).toString().split('\n');
                metadata.shift();
                metadata = metadata.join('\n');
                fs.writeFileSync(this.iconsMetadata, metadata);
                log.success('Downloaded metadata file');
                resolve();
            })
        })
    }
}

new Build(process.argv[2]);
