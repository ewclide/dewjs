var path = require('path').resolve(__dirname, 'src'),
	UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
	output = "epsilon",
	babel = {
		test: /\.js$/,
		use: { loader: 'babel-loader?presets[]=env' }
	}

const dev = {
	entry: "./core/main.js",
	output: {
		path: path,
		filename: output + '.dev.js'
	},
	module: { rules: [ babel ] }
}

const min = {
	entry: "./core/main.js",
	output: {
		path: path,
		filename: output + '.min.js'
	},
	plugins: [ new UglifyJsPlugin() ],
	module: { rules: [ babel ] }
}

module.exports = dev;