import * as funcList from './functions';
import {bind} from './binder';
import {http} from './http';
import {url} from './url';
import {$html} from './html';
import MegaFunction from './mega-function';
import Template from './template';
import Timer from './timer';
import Async from './async';

const DEW = {
	fetchSettings : funcList.fetchSettings,
	browser   : funcList.browser,
	define    : funcList.define,
	isType    : funcList.isType,
	strParse  : funcList.strParse,
	jsonParse : funcList.jsonParse,
	random    : funcList.random,
	construct : funcList.construct,
	publish   : funcList.publish,
	printErr  : funcList.printErr,
	log       : funcList.log,

	MegaFunction : MegaFunction,
	Template  : Template,
	Async     : Async,
	Timer     : Timer,

	bind      : bind,
	http      : http,
	url       : url,
	$html     : $html
}

export default DEW;