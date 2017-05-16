const webpack = require('webpack');
ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
const fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
	.filter(function(x) {
		return ['.bin'].indexOf(x) === -1;
	})
	.forEach(function(mod) {
		nodeModules[mod] = 'commonjs ' + mod;
	});

const common = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015'] }
                }],
            },
        ]
    } 
};

const frontend = {
    entry: path.join(__dirname, 'src/app.js'),
    output: {
        path: path.join(__dirname, 'dist'),  
        filename: 'bundle.[name].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        scss: 'vue-style-loader!css-loader!sass-loader?' + JSON.stringify({
                            includePaths: [
                                path.resolve(__dirname, 'node_modules/@material'),
                            ]
                        }), // <style lang="scss">
                        sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
                    }
                }
            },
            {
                test: /\.(jpg|png|svg)$/,
                loader: 'file-loader', 
                options: {
                    name: './images/[name].[ext]',
                },
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    loader: ['css-loader', 'postcss-loader'],
                }),
            }, 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    loader: ['css-loader', 'postcss-loader', 'sass-loader'],
                }),
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                },
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin({ filename: 'bundle.[name].css'}),
        new webpack.ProvidePlugin({
            "window.Vue": "Vue"
        }),
        // new PurifyCSSPlugin({ paths: glob.sync(path.join(__dirname, 'src/**/*.js'), { nodir: true }) })
    ],
};

const backend = {
    entry: path.join(__dirname, 'server/server.js'),
    output: {
        path: path.join(__dirname, 'server'),
        filename: 'bundle.[name].js'
    },
    target: 'node',
    node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		__filename: true,
		__dirname: true
	},
    externals: nodeModules,
	plugins: [
		new webpack.IgnorePlugin(/\.(css|less)$/)
	],
};

module.exports = [
    Object.assign({}, common, frontend),
    Object.assign({}, common, backend)
];