const output = "dew";
const entry  = "./core/main.js";
const result = "result";

var path = require('path').resolve(__dirname, result);

module.exports = {
	entry: entry,
	output: {
		path: path,
		filename: output + '.min.js',
		publicPath: result
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: 'env'
				}
			}
		}]
	}
};