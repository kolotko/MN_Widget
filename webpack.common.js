const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    // devtool: 'source-map',
    entry: {
        main: './src/app/app.js',
        sources: './src/app/sources.js',
        styles: './src/app/styles.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'mn-widget-library'),
        library: {
            type: "var",
            name: "MNGlobalLibrary"
        }
    },

    devServer: {
        static: {
            directory: path.join(__dirname, './mn-widget-library'),
        }
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: function () {
                                    return [
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        }
                    },
                    "sass-loader"
                ],
            },
            {
                test: /\.(jpe?g|png|svg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: '[path][name][ext]'
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            }
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.js']
    }
}