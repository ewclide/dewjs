import * as funcs from '../../core/functions';
import * as array from'../../core/array';
import * as object from '../../core/object';
import * as clock from '../../core/clock';
import * as lerp from '../../core/lerp';

import constManager from '../../core/const';
import bind from '../../core/bind';
import http from '../../core/http';
import url from '../../core/url';
import html from '../../core/html';

import ProgressReducer from '../../core/progress-reducer';
import Callback from '../../core/callback';
import Eventer from '../../core/eventer';
import Template from '../../core/template';
import Async from '../../core/async';

const DEW = {
	funcs,
	array,
	object,
	clock,
	lerp,

	ProgressReducer,
	Callback,
	Eventer,
	Template,
	Async,

	constManager,
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