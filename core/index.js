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

@bind.observer
class B {
	// @bind.beforeChange(() => {}) // or afterChange
	y = 10;
	x = 10;
}

@bind.observer
class A {
	@bind.left(B) // b.x => a.x
	x = 10;
}

const a = new A();
const b = new B();

console.log(a, b)

object.define(window, { Dew })