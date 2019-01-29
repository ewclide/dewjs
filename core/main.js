import './polyfill';
import * as funcs from './functions';
import * as array from'./array';
import * as object from './object';
import http from './http';
import url from './url';
import html from './html';
import bind from './bind';
import CallBacker from './callbacker';
import Eventer from './eventer';
import Template from './template';
import Timer from './timer';
import Async from './async';
import Lerp from './lerp';

const DEW = {
	funcs,
	array,
	object,
	CallBacker,
	Eventer,
	Template,
	Async,
	Timer,
	Lerp,
	bind,
	http,
	url,
	html
};

object.define(window, 'log', {
	value : funcs.log,
	config: false,
	write : false
});

object.define(window, { DEW })