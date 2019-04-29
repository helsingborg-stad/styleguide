const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const package = require('./package.json');
const version = package.version;

module.exports = {

    /**
     * Entry files
     */

    entry: {
        'index': glob.sync('./source/js/**/*.js'),
        'red': './source/sass/themes/red.scss',
        'blue': './source/sass/themes/blue.scss',
        'familjen': './source/sass/themes/familjen.scss',
        'gray': './source/sass/themes/gray.scss',
        'green': './source/sass/themes/green.scss',
        'hultsfred': './source/sass/themes/hultsfred.scss',
        'purple': './source/sass/themes/purple.scss',
        'astorp': './source/sass/themes/astorp.scss'
    },

    mode: 'production',
    watch: true,
    watchOptions: {
        poll: 1000,
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
     * Output files
     */

    output: {
        path: path.resolve(__dirname, 'assets/dist/'),
        filename: 'js/hbg-prime-latest.min.js'
    },

    /**
     * Minify css and create css file
     */
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/hbg-prime-latest.min.css',
            chunkFilename: 'css/hbg-prime-latest.min.css'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};
