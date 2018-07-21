const output = "dew";
const entry  = "./core/main.js";
const result = "result";

var min = process.argv.indexOf('-p') !== -1,
	UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
	path = require('path').resolve(__dirname, result);

module.exports = {
	entry: entry,
	output: {
		path: path,
		filename: output + (min ? '.min.js' : '.dev.js')
	},
	plugins: min ? [ new UglifyJsPlugin() ] : [],
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader?presets[]=env'
				}
			}
		]
	}
};