import './polyfill';
import './define';
import './object-define';
import './array-define';
import './functions';

import {Binder} from './binder';
import {Async} from './async';
import {Timer} from './timer';
import {HTTP} from './http';
import {URLmanager} from'./url';
import {StyleSheet} from './stylesheet';
import {DOC} from './doc';

window.$define({
	$Async : Async,
	$Timer : Timer,
	$StyleSheet : StyleSheet
});

window.$define({
	$bind  : new Binder,
	$http  : new HTTP,
	$url   : new URLmanager,
	DOC    : DOC, // ? need thing about symbol $ in begin
});

