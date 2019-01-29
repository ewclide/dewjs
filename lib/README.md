# DEW.js

DEW is experimental javaScript library for UI programming.

At the moment, the project is being developed by one person. If you liked the project, please **[support][1]** it.

Initially, the project was conceived as a replacement for jquery, as well as a combination of solutions and ideas accumulated over two years. I would also like to note that some solutions that may have analogues were developed by chance :) but have the right to exist.

## Install & Usage

	npm install dewjs --save-dev

```js
import { html } from 'dewjs';

const hello = html.create('h1').text('Hello world!');

html.body.append(hello);

```

### **[Documentation][2]**

##
Thank's for using.
Developed by **Ustinov Maxim** - [ewclide][3]

[1]: https://dew.ewclide.com/support  "support"
[2]: https://dew.ewclide.com/documentation  "documentation"
[3]: https://github.com/ewclide  "ewclide"