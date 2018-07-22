import './polyfill';
import * as func from './functions';
import {array} from'./array';
import {object} from './object';
import {bind} from './binder';
import {MegaFunction} from './mega-function';
import {Template} from './template';
import {Async} from './async';
import {Timer} from './timer';
import {http} from './http';
import {url} from './url';
import {$html} from './html';

var Dew = {
	define    : func.define,
	istype    : func.istype,
	strconv   : func.strconv,
	jsonParse : func.jsonParse,
	random    : func.random,
	publish   : func.publish,
	construct : func.construct,

	object : object,
	array  : array,

	MegaFunction : MegaFunction,
	Template : Template,
	Async : Async,
	Timer : Timer,

	bind  : bind,
	http  : http,
	url   : url
}

func.define(window, "log", {
	value  : func.log,
	config : false,
	write  : false
});

func.define(window, {
	Dew   : Dew,
	$html : $html
})
