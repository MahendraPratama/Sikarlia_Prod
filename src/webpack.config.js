// var webpack = require("webpack");

// var path = require("path");

// var config = {
//     entry: "./app",
//   output: {
//     path: __dirname,
//     filename: "bundle.js"
//   },
//   // module: {
//   //     loaders: [
//   //         {  
//   //             test: /\.js$/,
//   //             exclude: 'node_modules',
//   //             loader: 'babel',
//   //             query: {presets: ['es2015']},
//   //         }
//   //     ]
//   // },
//   target: "webworker", // or 'node' or 'node-webkit'
//     // externals:{
//     //     fs:    "commonjs fs",
//     //     path:  "commonjs path"
//     // }
//   externals: ["fs"]
// };
// module.exports = config;

const path =  require('path');

// This is main configuration object that tells Webpackw what to do. 
module.exports = {
    //path to entry paint
    entry: './src/index.js',
    //path and filename of the final output
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    
    //default mode is production
    mode: 'development'
}