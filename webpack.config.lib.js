const path = require('path');

module.exports = {
	entry: {
        'index.min': './core/lib.js',
        'array.min': './core/lib-array.js',
        'object.min': './core/lib-object.js'
    },
	output: {
		path: path.resolve(__dirname, 'lib/src'),
        filename: '[name].js',
		library: 'Dew',
		libraryTarget: 'commonjs2'
	}
};