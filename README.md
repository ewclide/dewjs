# DEW.js

![license](img/license.svg)  

DEW is experimental javaScript library for UI programming.

At the moment, the project is being developed by one person. If you liked the project, please **[support][2]** it.  

Initially, the project was conceived as a replacement for jquery, as well as a combination of solutions and ideas accumulated over two years. I would also like to note that some solutions that may have analogues were developed by chance :) but have the right to exist.

### **[Documentation][3]**

### Install

The easiest way to get started is to drop the CDN hosted library into your page:

```html
<script src="https://cdn.jsdelivr.net/gh/ewclide/dewjs@1.0.0/build/dew.min.js"></script>
```

Using npm:

	npm install dewjs --save

To get a local copy of the current code, clone it using git:

	$ git clone https://github.com/ewclide/dewjs.git

Also you can simply **[download][1]** library and linked to your page.

### Usage

Import single solutions from npm package.  
Or include library to the page as script and use global objects

```js
import {$html} from 'dewjs'; // using npm

let hello = $html.create("h1").text("Hello world!");

$html.ready(function(){
	$html.body.append(hello);
});

```

##
Thank's for using.  
Developed by **Ustinov Maxim** - [ewclide][4]

[1]: https://github.com/ewclide/dewjs/archive/master.zip  "download"
[2]: https://dew.ewclide.com/support  "support"
[3]: https://dew.ewclide.com/documentation  "documentation"
[4]: https://github.com/ewclide  "ewclide"