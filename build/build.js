switch(process.argv[2]) {
    
    case "assets":
        
        const fs = require('fs');
        const distDir = './assets/dist';
        
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir);
            console.log('Dist dir created...');
        }
        
        if (!fs.existsSync(iconDir)) {
            fs.mkdirSync(iconDir);
            console.log('Icons dir created in dist...');
        }
        break;
        
    case "buildSass":
        
        const sassComponents = require('./sassComponents/sassComponents');
        sassComponents.initSassComponents(['button', 'icon', 'card']);
        break;
        
}