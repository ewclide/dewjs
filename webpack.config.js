const output = 'dew';
const entry  = './core/main.js';
const build = 'build';

const path = require('path');

module.exports = {
	entry: entry,
	output: {
		path: path.resolve(__dirname, build),
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
	},
	devServer: {
		port: 3000,
		inline: true,
		open: true,
		overlay: {
			warnings: true,
			errors: true
		}
	}
};