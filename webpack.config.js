const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const path = require('path');
const glob = require('glob');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');


module.exports = {

    externals: {
        material: '@material'
    },

    /**
     * Entry files - Add more entries if needed.
     */
    entry: {
        'styleguide-js': glob.sync('./source/js/**/*.js'),
        'styleguide-css': './source/sass/main.scss',
    },
    mode: 'development',
    watch: true,
    watchOptions: {
        poll: 100,
        ignored: /node_modules/
    },

    /**
     * Output files
     */
    output: {
        path: path.resolve(__dirname, 'assets/dist/'),
        filename: 'js/[name].min.js'
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
                        loader: "postcss-loader",
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

        // Prevent Webpack to create javascript css
        new FixStyleOnlyEntriesPlugin(),

        // Minify css and create css file
        new MiniCssExtractPlugin({
            filename: 'css/[name].min.css',
            chunkFilename: 'css/[name].min.css'
        }),

        // Copy css icon file created by icon-font-generator to sass in source before bundling
        new FileManagerPlugin({
            onStart: [
                {
                    copy: [
                        {source: './assets/dist/icons/styleguide-icons.css', destination: './source/sass/generic/_icons.scss'}
                    ]
                }

            ]
        }),

        //Lint for scss
        new StylelintPlugin({
            context: "./source/sass",
            configFile: "./.stylelintrc"
        })
    ]
};
