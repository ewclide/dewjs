### Usage
just import the file before using.

```js
import { /* methods */ } from 'dewjs/object';
```

##
### clone
( ***target*** : *Object*, ***deep*** : *Boolean* ) => *Object*

Creates copy of the object. It saves original prototype and constructor, and also supports cloning of arrays. Arrays, wich located at the first level of nesting in the object, will always clone.
This method not situable for creating a lot of clones, because works not enough quickly.

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
(***target*** : *Object*, ***source*** : *Object* | *Array*, ***copy*** : *Boolean*) => *Object*

Merges an objects by algorithm - all properties, wich are in the target and source object will got values from a source object.
Also you can pass an array of source objects, and the props, wich is not found in a previous object of the list will be searched in a next object and so on.
Last argument allows to create copy of the target object.

- **target* - a target object
- **source* - a donor object
- *copy* - creates copy of a target object

```js
const target = {
  color: 'red',
  size: 'small',
  speed: 25
};

const source = {
  color: 'blue',
  speed: 10,
  delay: 50
}

const result = innerAssign(target, source, true);
/* result { color: "blue", size: "small", speed: 10 } */
```

##
### outerAssign
(***target*** : *Object*, ***source*** : *Object* | *Array*, ***copy*** : *Boolean*) => *Object*

Merges an objects by algorithm - all properties of a source object, wich exists in the target object will be writen to the target object.
Also you can pass an array of source objects, and the props, will be fetched from each source object until the list ends.
Last argument allows to create copy of the target object.

- **target* - a target object
- **source* - a donor object
- *copy* - creates copy of a target object

```js
const target = {
  color: 'red',
  size: 'small',
  speed: 25
};

const source = {
  color: 'blue',
  speed: 10,
  delay: 50
}

const result = innerAssign(target, source, true);
/* result { color: "red", size: "small", speed: 25, delay: 50  } */
```

##
### fullAssign
(***target*** : *Object*, ***source*** : *Object*, ***copy*** : *Boolean*) => *Object*

- **target*
- **source*
- *copy* [false]

##
### init
(***target*** : *Object*, ***values*** : *Object*, ***settings*** : *Object*, ***common*** : *Object*) => *Boolean*

- **target*
- **values*
- **settings*
- *common*

##
### search
(***root*** : *Object*, ***key*** : *String*, ***value*** : *String*, ***settings*** : *Object*) => *Array*

- **root*
- **key*
- **value*
- *settings*

settings:
- *depth* [3]
- *all* [false]
- *children* ['children']

##
### define
(***object***, ***fields***, ***options***)