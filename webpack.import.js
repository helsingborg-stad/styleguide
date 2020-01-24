const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const path = require('path');
const glob = require('glob');
/**
 * Compile css from dynamic scss files
 * @type {{mode: string, output: {path: string, filename: string}, entry: {} & {[p: string]: *}, watch: boolean, plugins: [WebpackFixStyleOnlyEntriesPlugin, MiniCssExtractPlugin], module: {rules: [{test: RegExp, use: [{loader: string}, {loader: string}, {loader: string}, {loader: string, options: {sourceMap: boolean, implementation: *, name: string, modules: boolean}}]}]}, externals: {material: string}, watchOptions: {ignored: RegExp, poll: number}}}
 */
module.exports = {
    
    // ...
    externals: {
        material: '@material'
    },
    
    /**
     * Entry files - Add more entries if needed.
     */
    entry: glob.sync('./source/sass/imports/**/*.scss').
    reduce((entries, entry) => Object.
    assign(entries, {[entry.
        replace('./source/sass/imports/', '').
        replace('.scss', '')]: entry}), {}),
    
    mode: 'development',
    watch: false,
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
                            sourceMap: true,
                            modules: true,
                            implementation: require("sass"),
                            name: "css/compilations/[name].css"
                        }
                    }
                ]
            },
            
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
            filename: 'css/compilations/[name].min.css',
            chunkFilename: 'css/compilations/[name].min.css'
        }),
        
    ]
    // ...
};