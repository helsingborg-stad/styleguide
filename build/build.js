const log = require('consola');
const fs = require('fs');
const https = require('https');

require('@babel/register')({
    presets: ['es2016'],
});

class Build {
    constructor(processArgs) {
        this.dist = 'assets/dist/';
        this.sass = 'source/sass/';
        this.distCSS = `${this.dist}/css/`;

        this.handleFiles(processArgs);
    }
 
    /**
     * Handle Files
     * @param processArgs
     */
    handleFiles(processArgs) {
        if (processArgs === 'assets') {
            this.makeDir();
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
}

new Build(process.argv[2]);