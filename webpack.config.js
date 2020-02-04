const path = require('path');

const rules = [{
	test: /\.js$/,
	exclude: /node_modules/,
	loader: 'babel-loader'
}];

module.exports = {
	entry: './core/index.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'dew.min.js',
		publicPath: '/dist/'
	},
	module: { rules },
	devServer: {
		port: 3000,
		inline: true,
		open: true,
		overlay: {
			warnings: true,
			errors: true
		}
	}
}
