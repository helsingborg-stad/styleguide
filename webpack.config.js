const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const glob = require('glob');
const package = require('./package.json');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const version = package.version;

module.exports = {

    /**
     * Entry files - Add more entries if needed.
     */
    entry: {
        'prime-js': glob.sync('./source/js/**/*.js'),
        'prime-css': './source/sass/main.scss',
    },
    mode: 'production',
    watch: true,
    watchOptions: {
        poll: 1000,
        ignored: /node_modules/
    },

    /**
     * Output files
     */
    output: {
        path: path.resolve(__dirname, 'assets/dist/' + version + '/'),
        filename: 'js/hbg-[name].min.js'
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
    plugins: [

        //Minify css and create css file
        new MiniCssExtractPlugin({
            filename: 'css/hbg-[name].min.css',
            chunkFilename: 'css/hbg-[name].min.css'
        }),

        // Copy dist from version and create latest in dist
        new FileManagerPlugin({
            onEnd: [
                {
                    copy: [
                        {source: './assets/dist/' + version + '/', destination: './assets/dist/'}
                    ]
                }

            ]
        })
    ]
};
