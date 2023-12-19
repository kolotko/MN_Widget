const {merge} = require("webpack-merge");
const commonConfiguration = require('./webpack.common');

const developmentConfiguration ={
    mode: "development",
    devtool: false
};

module.exports = merge(commonConfiguration, developmentConfiguration);