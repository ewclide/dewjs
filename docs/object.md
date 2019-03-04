### Usage
just import the file before using.

```js
import { /* methods */ } from 'dewjs/object';
```

##
### clone
( ***target*** : *Object*, ***deep*** : *Boolean* ) => *Object*

Creates copy of the object. It saves original prototype and constructor, and also supports cloning of arrays. Arrays, wich located at the first level of nesting in the object, will always clone. This method not situable for creating a lot of clones, because works not enough quickly.

- **target* - a target object
- *deep* [false] - if it's true, then will created copies of all sub-objects.

```js
const user_1 = {
  name: "john",
  age: 25,
  friends: [
    {
      name: "max",
      age: 27
    }, {
      name: "alex",
      age: 24
    }
  ]
}

const user_2 = clone(user_1);
user_2.age = 23;
user_2.friends.push({ name: "david", age: 25 });
// will added only to the clone, but objects inside the array are common.
```

##
### innerAssign
(***target*** : *Object*, ***list*** : *Object* | *Array*, ***copy*** : *Boolean*) => *Object*

Merges two object by algorithm - all properties, wich are in the target object will got values from second object.

##
### outerAssign
(target, list, copy)

##
### fullAssign
(target, list, copy)

##
### init
(target, values, settings, common = { errors : true })

##
### define
(obj, fields, options = {})