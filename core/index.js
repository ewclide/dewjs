import functions from './function';
import object from './object';
import array from './array';
import classes from './class';
import singleton from './singleton';

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