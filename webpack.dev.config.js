const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const glob = require('glob');
const package = require('./package.json');
const version = package.version;

module.exports = {

    devServer: {
        lazy: true,
        writeToDisk: true,
    },

    /**
     * Entry files - Add more entries if needed.
     */
    entry: {
        'styleguide-js': glob.sync('./source/js/**/*.js'),
        'styleguide-css': './source/sass/main.scss',
    },

    /**
     * Output files
     */

    output: {
        path: path.resolve(__dirname, 'assets/dist/' + version + '/'),
        filename: 'js/[name].dev.js'
    },

    mode: 'development',

    watch: true,
    watchOptions: {
        poll: 300,
        ignored: /node_modules/
    },

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
                        presets: ['@babel/preset-env']
                    }
                }
            },

            /**
             * Compile sass to css
             */
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "postcss-loader"
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass")
                        }
                    }
                ]
            },

            /**
             * Fonts - File loader
             */
            {
                test: /\.(woff|woff2|ttf|otf|eot|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: 'fonts'
                        }
                    }
                ]
            }
        ]
    },

     /**
     * Plugins
     */
    plugins: []
};
