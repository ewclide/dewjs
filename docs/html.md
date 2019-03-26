## html

Description...

### Usage

```js
import { html } from 'dewjs';
```
##
### Properties
- ***isHTMLTools***
- ***length***
- ***tag***
- ***sindex***
- ***size***
- ***ready***

##
### Methods
### native
() => *Element | [...Elements]*

##
### onResize
(***handler*** : *Function*, ***childFactor*** : *Boolean*) => *This*

- **handler*
- *childFactor* [false]

##
### clearOnResize
() => *This*

##
### mutate
(***handler*** : *Function*, ***options*** : *Object*, ***replace*** : *Boolean*) => *This*

- **handler*
- *options* [{ attributes }]
- *replace*

##
### mutateEnable
() => *This*

##
### mutateDisable
() => *This*

##
### removeMutation
(***handler*** : *Function*) => *This*

- **handler*

##
### clearMutations
() => *This*

##
### visible
(***maxDepth*** : *Number*) => *Boolean*

- *maxDepth* [3]

##
### display
(***element*** : *Element*) => *Boolean*

- *element*

##
### inScreen
(***element*** : *Element*) => *Boolean*

- *element*

##
### select
(***query*** : *String*) => *HTMLTools*

- *query*

##
### getById
(***id*** : *String*) => *HTMLTools*

- *id*

##
### before
(***element, ...elements*** : *HTMLTools*) => *This*

- *element*

##
### after
(***element, ...elements*** : *HTMLTools*) => *This*

- *element*

##
### append
(***element, ...elements*** : *HTMLTools*) => *This*

- *element*

##
### prepend
(***element, ...elements*** : *HTMLTools | [...HTMLTools]*) => *This*

- *element*

##
### appendTo
(***element*** : *HTMLTools*) => *This*

- *element*

##
### prependTo
(***element*** : *HTMLTools*) => *This*

- *element*

##
### move
(***element*** : *HTMLTools*, ***position*** : *String*, ***child*** : *Number*, ***reverse*** : *Boolean*) => *This*

- **element*
- *position* [end] before, after, begin, end
- *child* [0]
- *reverse* [false]

moveTo(target, position, child, reverse)

createFromJSON(json)

createJSON(htl)

tplAppend(tpl)

addClass(className)

removeClass(className)

html(str, clear)

text(str)

value(data)

active(flag)

checked(flag)

toogle()

choose(index)

width(value)

height(value)

resize(width, height)

offsetParent()

offsetWindow

offsetScroll

offsetPage

wrap

hide

show(displayProp)

parent

transform

matrix2d

matrix3d

scale

scaleX

scaleY

skew

rotate

translate

origin

getAttr

setAttr

unsetAttr ()

style (name, value)

styles (prefix, data)

addEvent

fireEvent

removeEvent

each

clone

join

clear

remove

delete



extend

script

create

convert

parseXML

createStyleSheet

body