const path = require('path');
const resolve = (target) => path.resolve(__dirname, target);

module.exports = {
	entry: resolve('./src/index.js'),
	output: {
		path: resolve('./dist'),
		filename: 'app.js'
	},
	module: { rules: [{
		test: /\.js$/,
		exclude: /node_modules/,
		use: {
			loader: 'babel-loader',
			options: {
				plugins: [
					['dewjs/babel-plugin', { scriptMode: true }]
				]
			}
		}
	}] }
}
