### Usage
just import the file before using.

```js
import { /* functions */ } from 'dewjs/funcs';
```

### browser

Not a function. Contains name of user browser as a string.
It supports browsers - *Chrome, Firefox, Opera, Safari, IE*

##
### printErr
( ***error*** : *Array*, ***source*** : *Boolean* ) => *false*

Allows to print errors in the console.

- **error* - can be string or array. If you want to print errors stack, then pass array with title property.
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
( ***value*** : *Any*, ***type*** : *String* ) => *Boolean* | *String*

Checks type of the value. Returns result of checking as Boolean.
Function, wich called with one argument will returns type of the passed value as string. If you pass array of types, then it checks value with each type in the array and returns true if value is one of this types.
*HTMLTools* - is a special type of objects produced through library html object.

- **value* - value itself.
- *type* - type as string. It supports types: *number, string, boolean, array, function, DOM, HTMLTools*.

```js
const some = [];
if (isType(some, 'array')) {
    // ...code
}

console.log(isType(some)); // array

// array of types
const other = 'hello';
if (isType(other, ['string', 'number']) {
    // ...code
}
```
##
### strParse
( ***value*** : *String* ) => *Any*

Parses and converts a string to type. Uses when result come as string and his necessary convert to the correct type. Supports types - *number, boolean, json, array*. If it can't converts a value, then it trims spaces and returns a string

- **value* - a string, wich must converted

```js
strParse('[1, 2, 3]'); // [1,2,3]
```

##
### intParse
( ***value*** : *String* ) => *Integer Number*

Removes all not number chars from the string and returns integer number.

- **value* - a string, wich contains int number.

```js
intParse('as125%7d'); // 1257
```

##
### floatParse
( ***value*** : *String* ) => *Float Number*

Removes all not number chars from the string and returns float number. Recognizes points and commas for separating real and fractional parts. If it founds two points (commas), then it removed all chars after second separator.

- **value* - a string, wich contains float number.

```js
floatParse('as12,5%7d'); // 12.57
```

##
### jsonParse
( ***value*** : *String* ) => *JSON*

Recognizes json object in the string. More permissive then JSON.parse method. Not sensitive to quots.

- **value* - a string, wich contains json object.

```js
jsonParse(`{ a: text, b: 'text2', "c": 123 }`);
// { a: "text", b: "text2", c: 123 }
```

##
### construct
*Deprecated* - you can use ES6 spread syntax ~ new Class(...args).

( ***class*** : *Class*, ***arguments*** : *Array* ) => *Object - instance*

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
( ***class*** : *Class*, ***methods*** : *Array*, ***fields*** : *Array* ) => *Class*

Allows to publish specified fields and methods and encapsulate others. Returns new class.

- **class* - a class.
- **methods* - methods list, wich you want to publish.
- *fields* - fields list, wich you want to publish.

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

inst.first; // 1
inst.second; // undefined
inst.doSomeThing(); // something completed!
inst.doAnother(); // Uncaught TypeError: inst.doAnother is not a function
```
##
### getElementData
( ***settings*** : *Object*, ***defaults*** : *Object*, ***element*** : *DOM Element*, ***attributes*** : *Object* ) => *Object*

Compiles settings from different sources - *defaults, user settings and element data-attributes*.
At the begin it gets value from user object, after from attribute and at the end gets default.
All settings must have defaults values.
If attribute founds but is empty, then take as *true* value.
If you want give special name to the attribute, then use attribute object, by default name of attribute takes as name of option with prefix "data-". Options writed through camel-case spelling will replaced by dash-case attributes.
Function also detects *Boolean* values in attrubtes.

- **settings* - object with user settings.
- **defaults* - default values.
- *element* - DOM element, wich contains attrubites.
- *attributes* - list of attributes, which corresponds to the settings.

```html
<!-- some where in template -->
<div
    data-other-option
    data-some-option="good"
    data-color="blue"
></div>
```

```js
// some where in code
const elem = document.getElementById('#spec');
const defs = {
    size: 150,
    color: 'red',
    otherOption: false,
    theSomeLongNamedOption: 'easy',
}

const attrs = {
    theSomeLongNamedOption: 'some-option'
}

const data = getElementData(settings, defs, elem, attrs);
console.log(data);
/* {
    size: 150,
    color: "blue",
    otherOption: true,
    theSomeLongNamedOption: "good"
} */
```

##
### fetchSettings
( ***settings*** : *Object*, ***defaults*** : *Object*, ***types*** : *Object*, ***rates*** : *Object* ) => *Object*

Compiles settings from defaults and user settings. It also allows to assign permissible types and values. All settings must have defaults values.

- **settings* - object with user settings.
- **defaults* - default values.
- *types* - permissible types.
- *rates* - list of permissible values.

```js
const defs = {
    width: 50,
    name : 'some',
    color: 'red',
};

const types = {
   width: 'number',
   name : ['string', 'number'],
   color: 'string'
}

const rates = {
   color: ['red', 'blue', 'green']
}

const config = {
    width: '100',
    color: 'blue'
}

const settings = fetchSettings(config, defs, types, rates);
console.log(settings);
/* {
    width: 50,
    name: "some",
    color: "blue"
} */
```

##
### randi
( ***min*** : *Number*, ***max*** : *Number* ) => *Number*

Returns random integer value.

- *min* [0] - min range value.
- *max* [999999] - max range value.

##
### randf
( ***min*** : *Number*, ***max*** : *Number*, ***size*** : *Number* ) => *Number*

Returns random float value.

- *min* [0] - min range value.
- *max* [1] - max range value.
- *size* - size of rounding.

```js
randf(3, 10, 2); // 4.12
```

##
### randKey
( ***length*** : *Number*, ***types*** : *Array* ) => *String*

Returns string of random chars.

- *length* [15] - length of result string.
- *types* [all] - List of char types, wich will be used. Available types - *all, lower, upper, numbers, specials*;

```js
randKey(10, ['upper', 'lower']); // "mkFqWeTGdp"
```

##
### idGetter
( ***prefix*** : *String* ) => *Function*

Returns function, wich returns unique value in own space (Just increment value)

- *prefix* - a string, wich will be added before value.

```js
const getName = idGetter('unique_');
getName(); // unique_1
getName(); // unique_2
// ...unique_++

const getId = idGetter();
getId(); // 1
getId(); // 2
// ...++
```

##
### camelCaseToDash
(***string*** : *String*) => *String*

Converts string to camel-case spelling.

- **string* - a string itself.

```js
camelCaseToDash('camelCaseToDash'); // "camel-case-to-dash"
```

##
### dashToCamelCase
(***string*** : *String*) => *String*

Converts string to dash-case spelling.

- **string* - a string itself.

```js
dashToCamelCase('dash-to-camel-case'); // "dashToCamelCase"
```

##
### camelCaseMerge
(***word1, word2 ...*** : *Arguments*) => *String*

Merges list of words to camel-sace spelling word.

- **word1, word2 ...* - an arguments of words.

```js
camelCaseMerge('hello', 'world', 'have', 'fun'); // "helloWorldHaveFun"
```

##
### trim
(***string*** : *String*, ***all*** : *Boolean*) => *String*

Is a wrapper of native function. Deletes spaces from both ends of a string. If you pass second argument as true, then all repeated spaces on the string will be replaced by once space.

- **string* - a sring itself.
- *all* - a flag, wich allows to replace all spaces by one.

```js
trim(' hello world,   have fun! '); // "hello world, have fun!"
```

##
### capitalize
(***string*** : *String*, ***each*** : *Boolean*) => *String*

Trimes spaces in the string and converts first char in the word to upper-case.

- **string* - a string itself.
- *each* - if it's true, then all words in the string will be converted.

```js
capitalize('hello world!'); // "Hello world!"
capitalize(' have   fun! ', true); // "Have Fun!"
```

##
### zeroPad
(***number*** : *Number*, ***size*** : *Number*) => *String*

Addes zero chars to the begin of number and returns string.

- **number* - a number itself.
- *size* [2] - length of a result string.

```js
zeroPad(5, 3); // "005"
zeroPad(25, 3); // "025"
```

##
### vmin
(***value*** : *Number*) => *Number*

Converts a value specified in CSS units "vmin" to value in pixels.

- **value* - a value itself.

```js
// window - 1920 x 969
vmin(25); // 242.25
```

##
### vmax
(***value*** : *Number*) => *Number*

Converts a value specified in CSS units "vmax" to value in pixels.

- **value* - a value itself.

```js
// window - 1920 x 969
vmax(25); // 480
```

##
### vw
(***value*** : *Number*) => *Number*

Converts a value specified in CSS units "vw" to value in pixels.

- **value* - a value itself.

```js
// window - 1920 x 969
vw(25); // 480
```

##
### vh
(***value*** : *Number*) => *Number*

Converts a value specified in CSS units "vh" to value in pixels.

- **value* - a value itself.

```js
// window - 1920 x 969
vh(25); // 242.25
```

##
### clamp
(***value*** : *Number*, ***from*** : *Number*, ***to*** : *Number*) => *Number*

Truncates the value inside of the interval.

- **value* - a value itself.
- **from* - lower border of the interval.
- **to* - upper border of the interval.

```js
clamp(125, 50, 100); // 100
clamp(25, 50, 100); // 50
clamp(70, 50, 100); // 70
```

##
### clampOut
(***value*** : *Number*, ***from*** : *Number*, ***to*** : *Number*) => *Number*

Truncates the value outside of the interval. If value specified inside of the interval, then the value truncates to a neares border.

- **value* - a value itself.
- **from* - lower border of the interval.
- **to* - upper border of the interval.

```js
clampOut(125, 50, 100); // 125
clampOut(25, 50, 100); // 25
clampOut(70, 50, 100); // 50
clampOut(80, 50, 100); // 100
```

##
### clampSide
(***value*** : *Number*, ***border*** : *Number*, ***flip*** : *Boolean*) => *Number*

Truncates the value from one side of a border - between infinity and border value.

- **value* - a value itself.
- **border* - border value.
- *flip* [false]- flag, value truncates from other side of a border.

```js
clampSide(125, 50); // 50
clampSide(25, 50); // 25
clampSide(25, 50, true); // 50
```

##
### clampAngle
(***angle*** : *Number*, ***radians*** : *Boolean*) => *Number*

Translates angle in radians to value between *0* and *Math.PI * 2*.

- **angle* - a angle itself.
- *radians* [true] - if false, then will works in degrees.

```js
clampAngle(390, true); // 30
clampAngle(-90, true); // 270
clampAngle(30, true); // 30
```

##
### mirrAngle
(***angle*** : *Number*, ***radians*** : *Boolean*) => *Number*

Translates angle in radians to value between *-Math.PI* and *Math.PI*.

- **angle* - a angle itself.
- *radians* [true] - if false, then will works in degrees.

```js
mirrAngle(390, true); // 30
mirrAngle(270, true); // -90
mirrAngle(-30, true); // -30
```

##
### limitCalls
(***function*** : *Function*, ***count*** : *Number*) => *Function*

Returns wrapper function, wich can be called a certain number of times.

- **function* - a function.
- *count* [1] - permissible number of calling.

**Methods**
- *resetCalls()* - resets count of calls.
- *getSource()* - returns source function.


```js
const func = limitCalls((a) => 'you called with: ' + a, true);
func(1); // you called with: 1;
func(2); // nothing

func.resetCalls();
func(3); // you called with: 3;
```

##
### entry
(***value*** : *Numeber*, ***from*** : *Number*, ***to*** : *Number*) => *Boolean*

Determines occurrence of the value in the interval, including borders.

- **value* - a value.
- **from* - lower border of the interval.
- **to* - upper border of the interval.

```js
entry(7, 5, 10); // true
entry(12, 5, 10); // false
```

##
### log
(***arg1, arg2, ...***) => *Void*

Wrapper of native console.log function. It's more short recording. Also it prints name of the source file where it was called.

```js
log('Hello');
/*
  "Hello"
  -----
  Source: http://localhost:3000/index.js:10:11
*/
```

##
### log.json
(***json*** : *JSON*, ***spaces*** : *Number*) => *Void*

Prints to the console parsed to string a json object. Works as JSON.stringify and console.log together.

- **json* - a json object.
- **spaces* [4] - number of spaces.

```js
log.json({ first: "1", second: "2" });
/* {
    first: "1",
    second: "2"
} */
```

##
### log.time, log.timeEnd
(***name*** : *String*) => *Void*

Wrapper of native console.time function. Prints time of execution code.

```js
log.time('speed test');
// ...code
log.timeEnd('speed test');
// speed test: 0.25ms
```