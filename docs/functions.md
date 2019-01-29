### Usage
just import the file before using.

```js
import { /* function */ } from 'dewjs/funcs';
```

### browser

Not a function. Contains the name of user browser as a string.  
It support the browsers - *Chrome, Firefox, Opera, Safari, IE*

##
### printErr 
(**error** : *Array*, **source** : *Boolean*) => *false*  

Allows to print errors in the console.  

- *error* - can be strig or array. If you want to print stack of the errors, that pass array. Array can contain title property.  
- *source* [true] - If it's true, that also be printed the file where was called this function.

```js
const err = [];
err.title = 'You cant do it!';

err.push('first error');
err.push('second error');

printErr(err);

/**
 * Error: You cant do it!
  --> first error
  --> second error
*/
```

##
### isType
(**value** : *Any*, **type** : *String*) => *Boolean* | *String*

Checks type of the value. Returns result of checking as true or false.  
Function wich called with one argument will return the type of the passed value as string.  
*HTMLTools* - is a special type of objects produced throught library html object.

- *value* - value itself.  
- *type* - type as a string. It supports types: *number, string, boolean, array, function, DOM, HTMLTools*.

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
strParse(value)  
intParse(str)  
floatParse(str)  
jsonParse(str)  
construct(Cls, args)  
publish(TheClass, fields, methods)  
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