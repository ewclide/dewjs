const path = require('path');

const rules = [{
	test: /\.js$/,
	exclude: /node_modules/,
	use: {
		loader: 'babel-loader',
		options: {
			presets: ['@babel/preset-env'],
			plugins: [
				['@babel/plugin-transform-runtime', { regenerator: true }],
				['@babel/plugin-proposal-class-properties', { loose: true }],
				'@babel/plugin-proposal-export-default-from'
			]
		}
	}
}];

module.exports = {
	entry: './core',
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
