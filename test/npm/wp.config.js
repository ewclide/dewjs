const path = require('path');

module.exports = {
	entry: './test/npm/core.js',
	output: {
		path: path.resolve(__dirname, './'),
		filename: 'index.js'
	}
};
