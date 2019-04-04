const path = require('path');

const rules = [];

rules.push({
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
});

const npmlib = {
	entry: {
        'index.min' : './core/lib-main',
        'funcs.min' : './core/functions',
        'array.min' : './core/array',
		'object.min': './core/object',
		'clock.min' : './core/clock',
		'lerp.min'  : './core/lerp'
    },
	output: {
		path: path.resolve(__dirname, './lib/src'),
        filename: '[name].js',
		library: 'DEW',
		libraryTarget: 'commonjs2'
	},
	module: { rules }
};

const script = {
	entry: './core/main',
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
};

const prod = process.argv.includes('production');

module.exports = prod ? [ npmlib, script ] : script;
