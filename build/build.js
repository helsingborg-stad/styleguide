switch (process.argv[2]) {
    
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
    
    case "test":
    
        const sass = require('node-sass');
        const result = sass.renderSync({
            file: './source/sass/main.scss',
            outputStyle: 'compressed',
            outFile: './nodesass.css',
            sourceMap: true,
        });
    
        console.log(sass.info);
        //console.log(result);
        //console.log(result.css);
        //console.log(result.map);
        //console.log(result.stats);
        
        break;
}
