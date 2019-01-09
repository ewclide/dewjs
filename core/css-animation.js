import StyleSheet from './stylesheet';
import html from './html';
import { printErr, idGetter } from './functions';

const _stylesheet = new StyleSheet();
const getName = idGetter('__anim__');

export class CSSAnimation
{
	constructor(selector, keyFrames, settings) {
		this._elements = html.select(selector);
		this._list = new Map();
		this._duration = 0;
	}

	play() {
		this._elements.style('animationPlayState', 'running');
	}

	pause(){
		this._elements.style('animationPlayState', 'paused');
	}

	finish() {

	}

	reset() {

	}

	add(keyFrames, settings = {}) {
		const name = getName();
		let animation = name;

		_stylesheet.addKeyFrames(name, keyFrames);

		const { duration, easing, steps, fillMode, counts, delay } = settings;
	}

	attach() {

	}

	_convert() {

	}
}

