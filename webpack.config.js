var path = require('path'),
	UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: "./core/main.js",
	output: {
		path: path.resolve(__dirname, 'src'),
		filename: 'epsilon.dev.js'
	},
	// plugins: [
	// 	new UglifyJsPlugin({
	// 		include: /\.min\.js$/
	// 	})
	// ],
	module: {
	  rules: [
	    {
	    	test: /\.js$/,
	    	use: {
		    	loader: 'babel-loader?presets[]=env'
	      	}
	    }
	  ]
	}
};