const output = "dew";
const entry  = "./core/main.js";
const build = "build";

var path = require('path').resolve(__dirname, build);

module.exports = {
	entry: entry,
	output: {
		path: path,
		filename: output + '.min.js',
		publicPath: build
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