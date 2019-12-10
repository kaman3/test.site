const path = require('path');

module.exports = {
    mode: 'production',
    entry: './include/ks_pvz/js/src/class.js',
    output:{
        path: path.join(__dirname,'include/ks_pvz/js/dist/'),
        filename: 'bundle.js',
        publicPath: '/include/ks_pvz/dist/'
    },
    module: {
        rules: [
            // the 'transform-runtime' plugin tells Babel to
            // require the runtime instead of inlining it.
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader'
              }
            }
          ]
    }
}