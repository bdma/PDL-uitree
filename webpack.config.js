var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        'app': ["./index.js"]
    },
    output: {
        path: "../dist",
        publicPath: "./assets/",
        filename: "bundle.js"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
    ],

    resolve: {
        extensions: ['', '.ts', '.js']
    },

    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
        ],
        noParse: [path.join(__dirname, 'node_modules', 'angular2', 'bundles')]
    },

    devServer: {
        /*proxy: {
          '/g1/api/af/*': {
            target: 'http://172.16.8.138:8091',
            //target: 'http://10.53.4.115:8080',
            //target: 'http://172.16.8.131:18080',
            rewrite: function(req) {
              req.url = req.url.replace(/^\/g1\/api\/af/, '');
            },
            secure: false
          }
        },*/
        proxy: {
            //注册websocket
            '/g1/service/common/*': {
            // '/notification/api/connections/*': {
                 //target: 'http://172.16.8.138/',
                target: 'http://172.16.8.179/',
                // target: 'http://10.53.4.115:8888/api/',
                rewrite: function(req) {
                     // req.url = req.url.replace(/^\/g1\/service\/common/, '');
                },
                secure: false
            },
            
            '/g1/temp/*': {

                target: 'http://172.16.8.179:8090/',
                rewrite: function(req) {
                    // req.url = req.url.replace(/^\/g1\/temp/, '');
                },
                secure: false

            },
            '/g1/service/af/*': {
                target: 'http://172.16.8.179',
                secure: false
            },


        },

        historyApiFallback: true
    }
};
