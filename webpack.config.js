const path = require('path');

const npmlib = {
	entry: {
        'index.min': './lib-build/lib-main.js',
        'funcs.min': './lib-build/lib-funcs.js',
        'array.min': './lib-build/lib-array.js',
		'object.min': './lib-build/lib-object.js'
    },
	output: {
		path: path.resolve(__dirname, './lib/src'),
        filename: '[name].js',
		library: 'DEW',
		libraryTarget: 'commonjs2'
	}
};

const script = {
	entry: './core/main',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'dew.min.js',
		publicPath: './dist'
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

const prod = process.argv.includes('production');

module.exports = prod ? [ npmlib, script ] : script;
