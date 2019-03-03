# DEW.js

Dew is experimental javaScript library for UI programming.

The project was conceived as a replacement for jquery, as well as a combination of solutions and ideas accumulated over two years.
I would also like to note that some solutions that may have analogues were developed by chance :) but have the right to exist.

### **[Documentation][2]**

## Features

- *Speed* - some methods faster than jquery analogues (select, append ...)
- *JS as HTML* - control UI throught JSON objects
- *DOM API* - manage DOM objects without connecting other libraries
- *Async* - create and organize asynchronous objects
- *Binding* - organize objects interaction throught binding
- *Access* - hide or publish fields and methods of classes
- *Templating* - create views throught templates
- Many others good solutions ;)

## Install & Usage

	npm install dewjs --save-dev

```js
import { html } from 'dewjs';

const hello = html.create('h1').text('Hello world!');

html.ready.then(() => html.body.append(hello));
```

##
Thank's for using.  
Developed by **Ustinov Maxim** - [ewclide][3]

[1]: https://dew.ewclide.com/support  "support"
[2]: https://github.com/ewclide/dewjs/tree/master/docs  "documentation"
[3]: https://github.com/ewclide  "ewclide"