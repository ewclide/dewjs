import './polyfill';
import * as funcList from './functions';
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

const Dew = {
	browser   : funcList.browser,
	define    : funcList.define,
	isType    : funcList.isType,
	strParse  : funcList.strParse,
	jsonParse : funcList.jsonParse,
	random    : funcList.random,
	publish   : funcList.publish,
	printErr  : funcList.printErr,
	construct : funcList.construct,
	fetchSettings : funcList.fetchSettings,

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

funcList.define(window, "log", {
	value  : funcList.log,
	config : false,
	write  : false
});

funcList.define(window, {
	Dew   : Dew,
	$html : $html
})