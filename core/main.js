import './polyfill';
import * as funcs from './functions';
import * as array from'./array';
import * as object from './object';
import * as clock from './clock';
import * as lerp from './lerp';
import http from './http';
import url from './url';
import html from './html';
import bind from './bind';
import ProgressReducer from './progress-reducer';
import ConstManager from './const';
import Callback from './callback';
import Eventer from './eventer';
import Template from './template';
import Async from './async';

const DEW = {
	funcs,
	array,
	object,
	clock,
	lerp,
	ProgressReducer,
	ConstManager,
	Callback,
	Eventer,
	Template,
	Async,
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