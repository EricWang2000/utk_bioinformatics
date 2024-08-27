const path = require("path")
const webpack = require("webpack");
const BundleTracker = require("webpack-bundle-tracker");
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
module.exports = { 
    // entry: "/assets/scripts/index.js",
    entry: path.resolve(__dirname, "assets", "scripts", "index.js"),
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "web", "static"),
        publicPath: "auto",
    },

    module: {
        rules: [
            {
                test: /\.css$/i, 
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },

    plugins: [
    //     new BundleTracker({ path: __dirname, filename: "webpack-stats.json" }),
    
    new WebpackManifestPlugin({
        fileName: 'webpack-stats.json',  // Name of the generated stats file
      }),
    ],
}

