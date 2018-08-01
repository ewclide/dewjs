import './polyfill';
import * as func from './functions';
import {arrayExtends} from'./array';
import {objectExtends} from './object';
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
	isType    : func.isType,
	strParse  : func.strParse,
	jsonParse : func.jsonParse,
	random    : func.random,
	publish   : func.publish,
	construct : func.construct,
	configure : func.configure,

	get object(){
		return objectExtends;
	},
	get array(){
		return arrayExtends;
	},

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
