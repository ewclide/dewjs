import common from './common';
import helper from './helper';
import object from './object';
import array from './array';
import type from './type';

const Dew = {
	common,
	helper,
	object,
	array,
	type,
};

object.define(window, 'log', {
	value : helper.log,
	config: false,
	write : false
});

object.define(window, { Dew })