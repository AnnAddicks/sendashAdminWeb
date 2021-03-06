var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: ["./sendashAdminWeb/app.js"],
    output: {
        path: __dirname + "/sendashAdminWeb/build",
        filename: "app.js",
        publicPath: "/sendashAdminWeb/build"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel' },
            { test: /node_modules\/admin-config\/.*\.jsx?$/, loader: 'babel' },
            { test: /\.html$/, loader: 'html' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('css') },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        })
    ]
};