import './polyfill';
import * as funcList from './functions';
import * as arrayExt from'./array';
import * as objectExt from './object';
import {bind} from './binder';
import {http} from './http';
import {url} from './url';
import {$html} from './html';
import MegaFunction from './mega-function';
import Template from './template';
import Timer from './timer';
import Async from './async';

const Dew = {
	browser   : funcList.browser,
	define    : funcList.define,
	isType    : funcList.isType,
	strParse  : funcList.strParse,
	jsonParse : funcList.jsonParse,
	random    : funcList.random,
	randomKey : funcList.randomKey,
	construct : funcList.construct,
	publish   : funcList.publish,
	printErr  : funcList.printErr,
	fetchSettings : funcList.fetchSettings,

	array  : arrayExt,
	object : objectExt,

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