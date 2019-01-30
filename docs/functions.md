### Usage
just import the file before using.

```js
import { /* function */ } from 'dewjs/funcs';
```

### browser

Not a function. Contains name of user browser as a string.
It supports browsers - *Chrome, Firefox, Opera, Safari, IE*

##
### printErr
( **error** : *Array*, **source** : *Boolean* ) => *false*

Allows to print errors in the console.

- *error* - can be string or array. If you want to print errors stack, then pass array with title property.
- *source* [true] - If true, then it prints the file where was called this function.

```js
const err = [];
err.title = 'You cant do it!';

err.push('first error');
err.push('second error');

printErr(err);

/*
  Error: You cant do it!
  --> first error
  --> second error
  -----
  Source: http://localhost:3000/core/index.js:81:11
*/
```

##
### isType
( **value** : *Any*, **type** : *String* ) => *Boolean* | *String*

Checks type of the value. Returns result of checking as Boolean.
Function wich called with one argument will returns type of the passed value as string.
*HTMLTools* - is a special type of objects produced throught library html object.

- *value* - value itself.
- *type* - type as string. It supports types: *number, string, boolean, array, function, DOM, HTMLTools*.

```js
if (isType(some, 'array')) {
    console.log('good!');
}

// ...or
if (isType(some) == 'array') {
    console.log('good again!');
}
```
##
### strParse
( **value** : *String* ) => *Any*

Parses and converts a string to type. Uses when result come as string and his necessary convert to the correct type. Supports types - *number, boolean, json, array*. If it can't converts a value, then it trims spaces and returns a string

- *value* - a string wich must converted

```js
const arr = strParse('[1, 2, 3]');
console.log(arr) // [1,2,3]
```

##
### intParse
( **value** : *String* ) => *Integer Number*

Removes all not number chars from the string and returns integer number.

- *value* - a string wich contains int number.

```js
const val = intParse('as125%7d');
console.log(val) // 1257
```

##
### floatParse
( **value** : *String* ) => *Float Number*

Removes all not number chars from the string and returns float number. Recognizes points and commas for separating real and fractional parts. If it founds two points (commas), then it removed all chars after second separator.

- *value* - a string wich contains float number.

```js
const val = intParse('as12,5%7d');
console.log(val) // 12.57
```

##
### jsonParse
( **value** : *String* ) => *JSON*

Recognizes json object in the string. More permissive then JSON.parse method. Not sensitive to quots.

- *value* - a string wich contains json object.

```js
const json = intParse(`{ a: text, b: 'text2', "c": 123 }`);
console.log(json) // { a: "text", b: "text2", c: 123 }
```

##
### construct
*Deprecated* - you can use ES6 spread syntax ~ new Class(...args).

( **class** : *Class*, **arguments** : *Array* ) => *Object - instance*

Allows to invoke constructor with arguments as array. Uses when arguments generates in run time.

```js
class Test {
    constructor(a, b, c) {
        //...code
    }
}

const inst = construct(Test, [1,2,3]);
```

##
### publish
( **class** : *Class*, **methods** : *Array*, **fields** : *Array* ) => *Class*

Allows to publish specified fields and methods and encapsulate others. Returns new class.

- *class* - a class.
- *methods* - a methods list, wich you want to publish.
- *fields* - a fields list, wich you want to publish.

```js
class Test {
    constructor() {
        this.first = 'first';
        this.second = 'second';
    }

    doSomeThing() {
        console.log('something completed!')
    }

    doAnother() {
        console.log('another completed!')
    }
}

const TestPub = publish(Test, ['doSomeThing'], ['first']);
const inst = new TestPub();

console.log(inst.first, inst.second); // 1 undefined
inst.doSomeThing(); // something completed!
inst.doAnother(); // Uncaught TypeError: inst.doAnother is not a function
```
#
getElementData(settings, defaults, attributes, element)
fetchSettings(settings, defaults, types = {}, rates = {})
randi(min = 0, max = 9999999)
randf(min, max)
randKey(length = 15, types = ['all'])
idGetter(prefix = 0)
camelCaseToDash(str)
dashToCamelCase(str)
camelCaseMerge(...list)
capitalize(str)
vmin(value)
vmax(value)
vw(value)
vh(value)
clamp(val, from, to)
clampOut(val, from, to)
clampSide(value, border, flip)
entry(val, from, to)
log()
log.json = (json, spaces = 4)
log.time = (name)
log.timeEnd = (name)