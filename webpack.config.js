const path = require('path');
const glob = require('glob');

module.exports = {
    // ...
    externals: {
        material: '@material',
    },

    /**
     * Entry files - Add more entries if needed.
     */
    entry: {
        'styleguide-js': glob.sync('./source/js/**/*.js'),
        'buildcss': './build/index.js'
    },
    mode: 'development',
    watchOptions: {
        poll: 100,
        ignored: /node_modules/,
    },

    /**
     * Output files
     */
    output: {
        path: path.resolve(__dirname, 'assets/dist/'),
        filename: 'js/[name].min.js',
    },

    /**
     * Modules
     */
    module: {
        rules: [
            /**
             * Babel
             */
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },

            /**
             * Fonts - File loader
             */
            {
                test: /\.(woff|woff2|ttf|otf|eot|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts',
                        },
                    },
                ],
            },
        ],
    },

    /**
     * Plugins
     */
    plugins: [],
    // ...
};
