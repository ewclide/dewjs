import StyleSheet from './stylesheet';
import html from './html';
import { printErr, idGetter } from './functions';

const _stylesheet = new StyleSheet();
const getAnimName = idGetter('__anim__');
const getKeyFramesName = idGetter('__keyframes__');

export class CSSAnimation
{
	constructor(selector, keyFrames, settings) {
		this._elements = html.select(selector);
		this._list = new Map();
		this._duration = 0;
		this._animStr = '';
	}

	play() {
		this._elements.style('animationPlayState', 'running');
	}

	pause() {
		this._elements.style('animationPlayState', 'paused');
	}

	finish() {
		this._elements.removeClass();
	}

	add(keyFrames, settings = {}) {
		const { duration, easing, steps, fillMode, counts, delay } = settings;

		const kfName = getKeyFramesName();
		const kfIndex = _stylesheet.keyFrames(kfName, keyFrames);

		this._animStr = kfName;

		const animIndex = _stylesheet.add(name, { animation });
		this._list.set(name, { anim: animIndex, keyFrames: kfIndex });
	}

	merge() {

	}

	_add() {

	}

	_convert() {

	}

	clear() {
		this._list.forEach((idx) => {
			_stylesheet.remove(idx.anim);
			_stylesheet.remove(idx.keyFrames);
		});
	}
}

