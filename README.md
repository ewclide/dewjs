# Dew.js

![license](img/license.svg)

![logo](img/logo.svg)

This is experimental javaScript library.  
The project is a combination of solutions and ideas accumulated over few years.
I would also like to note that some solutions that may have analogues were developed by chance :) but have the right to exist.

### **[Documentation][3]**
in development stage...

### Features

- *Speed* - some methods faster than jquery analogues (select, append ...)
- *JS as HTML* - control UI throught JSON objects
- *DOM API* - manage DOM objects without connecting other libraries
- *Async* - create and organize asynchronous objects
- *Binding* - organize objects interaction throught binding
- *Access* - hide or publish fields and methods of classes
- *Templating* - create views throught templates
- Many other good things ;)

### Install

For using this library on the site just get a local copy using git or press to **[download][1]**.  
And link script, which located in dist folder, into your page.

	$ git clone https://github.com/ewclide/dewjs.git

For creating your projects use npm

	npm install dewjs --save-dev

And setup your webpack config, for working with dewjs babel plugin.

```js
const rule = {
	test: /\.js$/,
	exclude: /node_modules/,
	use: {
		loader: 'babel-loader',
		options: {
			plugins: ['dewjs/babel-plugin']
		}
	}
}
```

This plugin allows you to write short import paths with imports only specified functions to your final bundle

```js
/* using with babel plugin */
import { randi, idGetter, capitalize } from 'dewjs/helper';

/* using without babel plugin */
import randi from 'dewjs/core/helper/rand-i';
import idGetter from 'dewjs/core/helper/id-getter';
import capitalize from 'dewjs/core/helper/capitalize';
```

### Usage

```js
import { html } from 'dewjs';

(async () => {
	await html.ready;

	const hello = html.create('h1').text('Hello world!');
	html.body.append(hello);
})()
```

##
*Thanks for using*  
@ Developed by **Max Ustinov** - **[ewclide][4]**

[1]: https://github.com/ewclide/dewjs/archive/master.zip  "download"
[2]: https://dew.ewclide.com/support  "support"
[3]: https://github.com/ewclide/dewjs/tree/master/docs  "documentation"
[4]: https://github.com/ewclide  "ewclide"