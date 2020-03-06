const fs = require('fs');
var copyfiles = require('copyfiles');

switch (process.argv[2]) {
    
    /**
     * Make assets dir if not exists
     */
    case "assets":
        if (!fs.existsSync('./assets/dist')) {
            
            fs.mkdirSync('./assets/dist');
            console.log('Dist dir created...');
        }
        break;
    
    /**
     * Move Material font files and css from node modules to assets dir.
     * + Add it to sass for compilation
     */
    case "assetsMaterial":
        
        // TODO: Lägga till check och kolla om npm paketet är uppdaterat.
        if (fs.existsSync('node_modules/material-design-icons/iconfont/')) {
            
            copyfiles([
                'node_modules/material-design-icons/iconfont/* ',
                'assets/dist/css/'
            ], 3, function (errors) {
                if (!errors) {
                    console.log('Copy material Icons files to assets');
                } else {
                    console.log(errors);
                }
            });
    
            copyfiles([
                'node_modules/material-design-icons/iconfont/material-icons.css ',
                'source/sass/material/'
            ], 3, function (errors) {
                if (!errors) {
                    console.log('Copy material icons css to sass dir');
                    fs.rename('source/sass/material/material-icons.css',
                        'source/sass/material/_material-icons.scss',
                        function (errors) {
                        if (!errors) {
                            console.log('Changed format on css file to scss');
                        } else {
                            console.log(errors);
                        }
                    });
                } else {
                    console.log(errors);
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
