//if(process.env.NODE_ENV === 'production') {
    module.exports = {
        plugins: [
            require('autoprefixer')({browsers: ['last 10 versions']}),
            require('cssnano')
        ]
    }
//}
