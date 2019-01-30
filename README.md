# DEW.js

![license](img/license.svg)

*Dew* is experimental javaScript library for UI programming.

The project was conceived as a replacement for jquery, as well as a combination of solutions and ideas accumulated over two years.
I would also like to note that some solutions that may have analogues were developed by chance :) but have the right to exist.

### **[Documentation][3]**

### Features

- *Speed* - some methods faster than jquery analogues (select, append ...)
- *JS as HTML* - control UI throught JSON objects
- *DOM API* - manage DOM objects without connecting other libraries
- *Async* - create and organize asynchronous objects
- *Binding* - organize objects interaction throught binding
- *Access* - allows to hide or publish fields and methods
- *Templating* - create views throught templates
- Many other good solutions

### Install

For using this library on the site just link CDN hosted script into your page:

```html
<script src="https://cdn.jsdelivr.net/gh/ewclide/dewjs@2.0.0/dist/dew.min.js"></script>
```
Also you can get a local copy using git or download by **[link][1]**.
The script located in dist folder.

	$ git clone https://github.com/ewclide/dewjs.git

For creating your projects use npm

	npm install dewjs --save-dev

### Usage

As npm package:

```js
import {html} from 'dewjs';

const hello = html.create('h1').text('Hello world!');

html.ready.then(() => html.body.append(hello));
```

As library on the page:
```html
<script src="../dew.min.js"></script>
<script>$html = DEW.html</script>
<script src="../user-script.js"></script>
```
```js
const hello = $html.create('h1').text('Hello world!');

$html.ready.then(() => $html.body.append(hello));
```

##
Thank's for using.
Developed by **Max Ustinov** - [ewclide][4]

[1]: https://github.com/ewclide/dewjs/archive/master.zip  "download"
[2]: https://dew.ewclide.com/support  "support"
[3]: https://github.com/ewclide/dewjs/tree/master/docs  "documentation"
[4]: https://github.com/ewclide  "ewclide"