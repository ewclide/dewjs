# Async
### constructor

Description...

### Usage

```js
import { Async } from 'dewjs';
```

## fields

- **isAsync** : *Boolean* -
- **promise** : *Promise* -
- **ready** : *Boolean* -
- **pending** : *Boolean* -
- **fulfilled** : *Boolean* -
- **rejected** : *Boolean* -

## Methods

### then
(***handler*** : *Function*) => *This*

- **handler*

##
### catch
(***handler*** : *Function*) => *This*

- **handler*

##
### resolve
(***data*** : *Any*) => *This*

- *data*

##
### reject
(***data*** : *Any*) => *This*

- *data*

##
### wait
(***list*** : *Array of Async (Promises)*, ***progress*** : *Boolean*) => *This*

- **list*
- *progress* [false]

##
### reset
() => *This*

##
### refresh
(***handler*** : *Function*) => *This*

- **handler*

##
### again
() => *This*

##
### progress
(***handler*** : *Function*) => *This*

- **handler*

##
### shift
(***loaded*** : *Number*, ***total***  : *Number*) => *This*

- **loaded*
- *total* [1]