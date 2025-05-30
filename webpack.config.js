const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScripts = require('webpack-remove-empty-scripts');

module.exports = {
    /**
     * Entry files - Add more entries if needed.
     */
    entry: {
        'styleguide-css': ['./source/sass/main.scss'],
        'styleguide-js': glob.sync('./source/js/**/*.js'),
        buildcss: './build/index.js',
    },
    mode: 'production',
    cache: true,

    //assets/dist/css/styleguide-css.min.css
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
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'entry',
                                    corejs: 3,
                                },
                            ],
                        ],
                        plugins: [
                            ['@babel/plugin-transform-runtime', { corejs: 3, regenerator: true }],
                        ],
                    },
                },
            },
            /**
             * TypeScript
             */
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },

            /**
             * Styles
             */
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('postcss-object-fit-images')],
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: ['node_modules']
                            }
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    /**
     * Plugins
     */
    plugins: [
        /**
         * Fix CSS entry chunks generating js file
         */
         new RemoveEmptyScripts(),

        /**
         * Output CSS files
         */
        new MiniCssExtractPlugin({
            filename: 'css/[name].min.css',
        }),
    ],
    // ...
};
