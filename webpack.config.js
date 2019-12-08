const path = require('path');

module.exports = {
    entry: './include/ks_pvz/js/src/class.js',
    output:{
        path: path.join(__dirname,'include/ks_pvz/js/dist/'),
        filename: 'bundle.js',
        publicPath: '/include/ks_pvz/dist/'
    },
    module:{
        rules:[
        {
           test: '/\.js/',
           use:[{
               loader:"babel-loader",
               options:{ presets: ["env"] },
           }]
        }
        ]
    }
}