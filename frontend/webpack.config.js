const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const process = require('process');


module.exports = {
    entry: {
        '0-angular': './node_modules/angular/angular.js',
        '1-vendors': [
            './node_modules/angular-route/angular-route.min.js',
            './node_modules/angular-animate/angular-animate.min.js',
            './node_modules/angular-aria/angular-aria.min.js',
            './node_modules/angular-messages/angular-messages.min.js',
            './node_modules/angular-material/angular-material.min.js',
            './node_modules/angular-material-data-table/dist/md-data-table.js'
        ],
        '2-app': './src/app/app.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },

    plugins: [
        new ExtractTextPlugin('styles.css'),
        new HtmlWebpackPlugin({
            template: './src/public/index.html',
            inject: 'body',
            chunksSortMode: function (a, b) {  //alphabetical order
                if (a.names[0] > b.names[0]) {
                    return 1;
                }
                if (a.names[0] < b.names[0]) {
                    return -1;
                }
                return 0;
            }
        }),
        new webpack.DefinePlugin({
            'API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:8000')
        }),
        new CopyWebpackPlugin([
            { from: './templates', to: 'templates' },
            { from: './assets', to: '.' }
        ])
    ],

    devtool: 'inline-source-map',

    devServer: {
        contentBase: path.join(__dirname),
        compress: true,
        port: 8080
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    // It is also required to avoid compiling errors when importing angular or jquery.
    externals: {
        'angular': 'angular'
    }
};
