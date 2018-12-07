import './polyfill';
import * as fn from './functions';
import * as array from'./array';
import * as object from './object';
import {bind} from './binder';
import {http} from './http';
import {url} from './url';
import html from './html';
import MegaFunction from './mega-function';
import Template from './template';
import Timer from './timer';
import Timer2 from './timer2';
import Async from './async';
import Lerp from './lerp';

const DEW = {
	browser: fn.browser,
	define: fn.define,
	isType: fn.isType,
	strParse: fn.strParse,
	jsonParse: fn.jsonParse,
	random: fn.random,
	randomKey: fn.randomKey,
	construct: fn.construct,
	publish: fn.publish,
	printErr: fn.printErr,
	fetchSettings: fn.fetchSettings,
	getElementData: fn.getElementData,

	array,
	object,

	MegaFunction,
	Template,
	Async,
	Timer,
	Timer2,
	Lerp,

	bind,
	http,
	url,
	html
}

fn.define(window, "log", {
	value  : fn.log,
	config : false,
	write  : false
});

fn.define(window, { DEW })