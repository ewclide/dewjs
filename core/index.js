import * as functions from './function';
import * as object from './object';
import * as array from './array';
import * as classes from './class';
import * as singleton from './singleton';

const Dew = {
	functions,
	array,
	object,
	classes,
	singleton
};

object.define(window, 'log', {
	value : functions.log,
	config: false,
	write : false
});

object.define(window, { Dew })