module.exports = {
    plugins: [
        require('autoprefixer')({
            overrideBrowserslist: ['> 1%', 'last 4 versions']
        }),
        require('cssnano')
    ]
};
