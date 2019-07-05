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
        'index.min' : './bundles/lib/main',
        'funcs.min' : './bundles/lib/funcs',
        'array.min' : './bundles/lib/array',
		'object.min': './bundles/lib/object',
		'clock.min' : './bundles/lib/clock',
		'lerp.min'  : './bundles/lib/lerp'
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
	entry: './bundles/script/main',
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
