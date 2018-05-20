
# **Dew.js**

Dew - Experimental JavaScript library for UI programming.

## About project

At the moment, the project is being developed by one person. If you liked the project, please [support][2] it.  

Initially, the project was conceived as a replacement for jquery, as well as a combination of solutions and ideas accumulated over two years. I would also like to note that some solutions that may have analogues were developed by chance :) but have the right to exist.

All detailed **documentation** you can read [there][3].

## Quick Start

The easiest way to get started is to drop the CDN hosted library into your page:

```html
<script src="https://cdn.some-address.com/libs/dew/1.3.1/dew.min.js"></script>
```

Using npm:

	npm install dewjs --save

To get a local copy of the current code, clone it using git:

	$ git clone https://github.com/ewclide/dewjs.git

Also you can simply [download][1] library and linked to your page.

Then you're ready to start your application:

```js
var hello = $html.create("h1").text("Hello world!");
$html.ready(function(){
	$html.body.append(hello);
});
```

-------------
Thank's for using.  
Developed by **Ustinov Maxim** - [ewclide][4]

[1]: https://dew.ewclide.com/download/dew.min.js  "download"
[2]: https://dew.ewclide.com/support/  "support"
[3]: https://dew.ewclide.com/documentation/  "documentation"
[4]: https://vk.com/ewclide  "ewclide"