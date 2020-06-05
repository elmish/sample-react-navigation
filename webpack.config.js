const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MinifyPlugin = require("terser-webpack-plugin");

const isProduction = process.argv.indexOf("-p") >= 0;
console.log("Bundling for " + (isProduction ? "production" : "development") + "...");

const plugins =
    isProduction
    ? [ new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            filename: path.resolve('./build/index.html'),
            template: path.resolve('./src/index.html')
        })
    ]
    : [
        new HtmlWebpackPlugin({
            filename: path.resolve('./build/index.html'),
            template: path.resolve('./src/index.html')
        })
    ];

module.exports = {
    mode: "development",
    devtool: isProduction ? false : "source-map",
    entry: isProduction ? // We don't use the same entry for dev and production, to make HMR over style quicker for dev env
    {
        demo: [
            "@babel/polyfill",
            './src/app.fsproj'
        ]
    } : {
        app: [
            "@babel/polyfill",
            './src/app.fsproj'
        ]
    },
    output: {
        path: path.join(__dirname, "./build"),
        filename: isProduction ? '[name].[hash].js' : '[name].js',
        publicPath: ""
    },
    optimization : {
        splitChunks: {
            cacheGroups: {
                fable: {
                    test: /fable-library/,
                    name: "fable",
                    chunks: "all"
                },
                commons: {
                    test: /node_modules/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        },
        minimizer: isProduction
            ? [new MinifyPlugin()]
            : []
    },
    plugins: plugins,
    devServer: {
        port: 8090,
        hot: true,
        inline: true,
        proxy: {
        }
    },
    module: {
        rules: [{
            test: /\.fs(x|proj)?$/,
            use: "fable-loader"
        },
        {
            test: /\.(sass|scss|css)$/,
            use: isProduction
                    ? ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ["css-loader", "sass-loader"]
                    })
                    : ['style-loader',
                       'css-loader',
                       'sass-loader' 
                    ],
        },
        {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*$|$)/,
            use: ["file-loader"]
        }]
    }
}