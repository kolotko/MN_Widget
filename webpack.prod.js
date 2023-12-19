const {merge} = require("webpack-merge");
const commonConfiguration = require('./webpack.common');

const prodConfiguration ={
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};

module.exports = merge(commonConfiguration, prodConfiguration);