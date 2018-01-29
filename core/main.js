import './polyfill';
import './define';
import './object.define';
import './array.define';
import './functions';

import {Binder} from './binder';
import {Async} from './async';
import {Timer} from './timer';
import {HTTP} from './http';
import {URL} from'./url';
import {StyleSheet} from './stylesheet';
import {DOC} from './doc';

window.$define({
	bind    : new Binder,
	http    : new HTTP,
	url    	: new URL,
	DOC     : DOC
});

var Epsilon = {}

Epsilon.$define({
	Async   : Async,
	Timer   : Timer,
	StyleSheet : StyleSheet
});

window.Epsilon = Epsilon;
window.EPS = Epsilon;

