const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const config = {
    mode: 'development',
    entry: {
        main: './src/js/src/main.js'
    },
    output: {
        filename: "[name].js"
    },
    plugins: [
        new UglifyJSPlugin({
            // sourceMap: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env']
                }
            }
        ]
    },
    externals: {
        jquery: 'jQuery'
    }

};
module.exports = config;