# **EPSILON - javascript library for UI programming!**

# Defined Functions:

## Object.$define
### Description
    this.$define(fields [, options])
> wrapper of Object.defineProperty method
### Agruments
- **fields** - object of fields or string
- **options** - "conf", "write", "enumer" as "configurable", "writable", "enumerable" or get, set
### Example
```js
    var Rabbit = {},
        Snake = {};
        
    Rabbit.$define({
        run : function(direction) { log("runing to " + direction); },
        jump : function(place) { log("jumping on " + place); },
        eat : function(food) { log("eating " + food); }
    });

    Snake.$define("length", {
        get : function() { return this._length + " cm"; },
        set : function(value) { this._length = value; },
        conf : true,
        length : 50
    });
    
    Rabbit.jump("grass");
    log(Snake.length);
```
### Result
    jumping on grass
    50 cm

----------

## Object.$init
### Description
    this.$init(fields, data [, showErrors ])
> This function allows to automate the initialization of object fields.
> Used in constructor of class
### Arguments
- **fields** - fields settings (see below on example). Required
- **data** - options wich you pass when create new object. Required
- **showErrors** - show errors in console. Default is true
### Field settings
- **required** - defines field as reqired
- **type**  - epsilon provides types : number, string, boolean, array, function, dom, object
- **root**  - specifies where to write the value
- **def**   - default value
- **write** - sets option "writable" to the field descriptor
- **enumer**- sets option "enumerable" to the field descriptor
- **conf**  - sets option "configurable" to the field descriptor
-  **attr** - the value of the field will be take from the attribute of the element ( All values will be converted to correct type )
    - element - required element from will be getting attribute
    - prefix - prefix for attribute, for example "data-"
    - only - if is true, then attribute of the element be required
- **filter** - filtering the value once when be initialized
### Example
```js
    class Block
    {
        constructor (options)
        {
            var self = this;

            this.settings = {};

            this.$init({
                height : { type : "number", required : true,  root : self.settings },
                width : {
                    type : "number",
                    required : true,
                    def : 150,
                    attr : {
                        element : options.element,
                        prefix : "data-",
                        only : true
                    },
                    filter : function (value)
                    {
                        return value * 2;
                    }
                }
            }, options, true);
        }
    }

    var block = new Block({
        element : DOC.select("#block-1"),
        // height : 100
    });

    log(block)
```
### Result
    Object init error of "Block" class:
    - empty required option "height";
    
----------

## Object.$join
### Description
    this.$join(object)
> Allows to join current object with other object (objects)
### Example
```js
    var one = { a : "A", b : "B" },
        two = { b : "B two", c : "C" }

    one.$join(two);
    log(one)
```
### Result
    { a: "A", b: "B two", c: "C" }
    
----------

## Object.$clone
### Description
    this.$clone()
> Allows to clone current object. Link to the prototype is stored.
### Example
```js
    var one = { a : "A", b : "B" },
        two = one.$clone();

    log(two);
```
### Result
    { a: "A", b: "B" }
    
----------

## Array.$have
### Description
    array.$have(value)
> Allows to define the presence of value in the array.
> Return false if array not have value or object with index of value;
### Example
```js
    var arr = ["value-1", "value-2", "value-3"];

    log( arr.$have("value-1") );
    log( arr.$have("value-4") );
```
### Result
    { index: 0 }
    false

----------

## Array.$remove
### Description
    array.$remove(options)
> Allows to remove element from the array by index or by value;
> Return removed element or false
### Example
```js
    var arr = ["value-1", "value-2", "value-3"];

    arr.$remove({ index : 2 });
    arr.$remove({ value : "value-1" });

    log(arr);
```
### Result
    ["value-2"]

----------

## Array.$attach
### Description
    array.$attach(array)
> Allows to attach array to the array.
> Unlike concat this function not return new array but modify current
### Example
```js
    var arr = ["value-1", "value-2", "value-3"];
        arr.$attach([1, 2, 3]);
        
    log(arr);
```
### Result
    ["value-1", "value-2", "value-3", 1, 2, 3]

----------

# Global Functions:

## log
### Description
    log(arguments...)
    log.time()
    log.timeoff()
    log.err(array || string)
> Convenient wrapper of console.
> This function will save your time to debug code.
> You can see more infomation about objects, print time execution or show errors in console.
### Example
```js  
    var user = { name : "Max" },
        errors = [];
        errors.title = "Undefined fields";

    log.time()

    log(user);
    if (!user.surname) errors.push("surname");
    if (!user.age) errors.push("age");
    log.err(errors);

    log.timeoff()
```
### Result
    {name: "Max"}
    Undefined fields:
       - surname;
       - age;
    default: 3.2802734375ms

----------

## random
### Description
    random([min][, max])
    random.key([length][, types])
> This function allow to generate number or characters keys;
> Default values of min is "0" and max is "9999999"
### Provides types or character key:
- all
- upper
- lower
- number
- specials
> Default type is "all" and default length is "15"
### Examples
```js
    log( random(0, 100) )
    log( random.key(8, ["numbers", "lower", "upper"]) )
```
### Result
    37
    sDFTP8v

----------

## istype
### Description
    istype(value [, type]);
> Allows to check or get type of value.
### Provides types:
- number
- string
- boolean
- array
- function
- dom
- object

### Examples
```js
    var num = 10,
        str = "string",
        bool = true,
        arr = [],
        fn = function(){},
        elem = document.createElement("div"),
        obj = {};

    log( istype(num), istype(str), istype(bool), istype(arr),
         istype(fn), istype(elem), istype(obj) );

    log( istype(num, "string") );
```
### Result
    number string boolean array function dom object
    false

----------

## strconv
### Description
    strconv(value);
> This function transform string to other types
### Types:
- number
- boolean
- array
- json
### Examples
```js
    var arr = "[1, 2, 'some']",
        num = "100",
        dl = "true",
        json = '{ "value" : 100 }';

    log(strconv(arr));
    log(strconv(num));
    log(strconv(dl));
    log(strconv(json));
```
### Result
    [1, 2, "'some'"]
    100
    true
    { value: 100 }

----------

## bind
### Description
    bind.context(function, context);
    bind.change(object, field, trigger);
    bind.fields(options)
> This function allow to bind conext, onchange function and two fields of the two objects.
> **Modifier** - function wich transform value before writing to binded field
> **Trigger** - function wich called always when value of field changes. Don't called when be initializing
### Options
- **type** - "left", "right", "cross"
- **left** 
    - object - link to the object
    - field  - name of the field
    - modifier - transform the left value to the right. Uses only on cross binding
    - trigger - callback function. Uses only on cross binding
- **right**
    - object - link to the object
    - field  - name of the field
    - modifier - transform the right value to the left. Uses only on cross binding
    - trigger - callback function. uses only on cross binding
- **modifier** - transform value before writing to binded field
- **trigger** - callback function
### Provides types or binding:
- **left** - Changes of the left field will be writing this to the right field
- **right** - Changes of the right field will be writing this to the left field
- **cross** - Changes of any field will be writing his value to binded field
> This function provide also multi binding.
> For example, you can bind field of first object with field of second object and,
> then you bind field of second (first) object with field of third object.
> This manipulation will not broke the cross bind
### Example 1
```js
    var left =  { field : 100 },
        right = { field : 100 };
        
    bind.fields({
        type   : "left",
        left   : {
            object : left,
            field : "field"
        },
        right  : {
            object : right,
            field : "field"
        },
        modifier : function(value)
        {
            // transform right value after binding (see below)
            return value * 2;
        }, 
        trigger : function()
        {
            //some actions
        }
    });

    log("before changing:")
    log("left - " + left.field, "right - " + right.field);
    
    left.field = 500;
    
    log("after changing (left = 500):")
    log("left - " + left.field, "right - " + right.field);
```
### Result
    before changing:
    left - 100 right - 200
    after changing (left = 500):
    left - 500 right - 1000
### Example 2
```js
    var some = { value : 100 },
        change = function(value)
        {
            log("value was changed to " + value)
        };

    bind.change(some, "value", change);

    some.value = 200;
```
### Result
    value was changed to 200

----------

## superFunction
### Description
### Examples
### Result

----------

# Classes:

## Async
### Description
### Methods
### Examples
### Result

----------

## Timer
### Description
### Methods
### Examples
### Result

----------

## StyleSheet
### Description
### Methods
### Examples
### Result

----------

# Objects:

----------

## http
### Description
### Methods
### Examples
### Result

----------

## http.url
### Description
### Methods
### Examples
### Result

----------

## DOC
### Description
### Methods
### Examples
### Result

----------