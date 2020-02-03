const path = require('path');
const fs = require('fs');
const distDir = './assets/dist';

switch(process.argv[2]) {
    
    case "assets":
        const fs = require('fs');
        const distDir = './assets/dist';
        
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir);
            console.log('Dist dir created...');
        }
        break;
        
    case "buildSass":
        const sassComponents = require('./sassComponents/sassComponents');
        sassComponents.initSassComponents(process.argv[3]);
        break;
}
