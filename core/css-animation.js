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
		this._className = '';
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
		const {
			duration = 1000,
			easing = null,
			steps = null,
			stepType = 'end',
			fillMode = null,
			delay
		} = settings;

		const kfName = getKeyFramesName();
		const kfClass = _stylesheet.keyFrames(kfName, keyFrames);

		let animation = this._animStr;
		animation += (this._animStr ? '' : ',') + kfName;

		if (delay) animation += ` ${delay}ms`;
		animation += ` ${duration}ms`;

		if (steps) animation += ` steps(${steps}, ${stepType})`;
		if (easing) animation += ` ${easing}`;
		if (fillMode) animation += ` ${fillMode}`;

		const anName = getAnimName();
		const anClass = _stylesheet.add(anName, { animation });

		this._list.set(name, { anClass, kfClass });
	}

	merge(keyFrames, settings) {
		if (!settings.delay) {
			settings.delay = 0;
		}

		settings.delay += this._duration;

		this.add(keyFrames, settings);
	}

	clear() {
		this._list.forEach((idx) => {
			_stylesheet.remove(idx.anClass);
			_stylesheet.remove(idx.kfClass);
		});
	}
}

