import * as funcList from '../core/functions';
import {arrayExtends} from'../core/array';
import {objectExtends} from '../core/object';
import {bind} from '../core/binder';
import {http} from '../core/http';
import {url} from '../core/url';
import {$html} from '../core/html';
import MegaFunction from '../core/mega-function';
import Template from '../core/template';
import Timer from '../core/timer';
import Async from '../core/async';

const Dew = {
	fetchSettings : funcList.fetchSettings,
	browser   : funcList.browser,
	define    : funcList.define,
	isType    : funcList.isType,
	strParse  : funcList.strParse,
	jsonParse : funcList.jsonParse,
	random    : funcList.random,
	publish   : funcList.publish,
	printErr  : funcList.printErr,
	construct : funcList.construct,
	log       : funcList.log,
	$html     : $html,
	object    : objectExtends,
	array     : arrayExtends,
	bind      : bind,
	http      : http,
	url       : url,
	Template  : Template,
	Async     : Async,
	Timer     : Timer,
	MegaFunction : MegaFunction
}

export default Dew;