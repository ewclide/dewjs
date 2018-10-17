const path = require('path');

module.exports = {
	entry: './core/lib.js',
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: 'dew.lib.min.js',
		library: 'Dew',
		libraryTarget: 'commonjs2'
	}
};