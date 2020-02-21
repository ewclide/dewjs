import decorator from './decorator';
import common from './common';
import helper from './helper';
import object from './object';
import array from './array';
import type from './type';

const Dew = {
	decorator,
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

const { bind } = decorator;

class B {
	@bind.beforeChange(() => {}) // or afterChange
	y = 10;

	@bind.with(A, 'x', v => v * 2) // a.x * 2 => b.x
	x = 10
}

class A {
	@bind.with(B) // b.x => a.x
	x = 10;
}

object.define(window, { Dew })