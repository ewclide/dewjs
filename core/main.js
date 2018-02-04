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
import {DOC} from './doc';

window.$define({
	$Async : Async,
	$Timer : Timer
});

window.$define({
	$bind  : new Binder,
	$http  : new HTTP,
	$url   : new URLmanager,
	DOC    : DOC
});

