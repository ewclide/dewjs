import CSSTransformer from '../common/css-transformer';
import log from '../helper/log';
import camelCaseToDash from '../helper/camel-case-to-dash';
import idGetter from '../helper/id-getter';

export default class StyleSheet {
	constructor() {
		this.element = this._createElement();
	}

	get isStyleSheet() {
		return true;
	}

	_createElement() {
		if (document.createStyleSheet) {
			return document.createStyleSheet();

		} else {
			const head = document.getElementsByTagName('head')[0];
			const style = document.createElement('style');

			head.appendChild(style);

			return document.styleSheets[document.styleSheets.length - 1];
		}
	}

	_getLastIndex() {
		return this.element.cssRules.length;
	}

	add() {
		if (arguments.length > 1) {
			const [ rule, styles ] = arguments;
			return this._add(rule, styles);

		} else if (Array.isArray(arguments[0])) {
			const indeces = [];
			arguments[0].forEach((styles) => {
				const { rule } = styles;
				indeces.push(this._add(rule, style));
			});
			return indeces;
		}
	}

	_add(rule, styles) {
		if (typeof rule !== 'string') {
			log.error(`rule "${rule}" argument must be a string`);
			return;

		} else if (typeof styles !== 'object') {
			log.error(`styles "${styles}" argument must be an object`);
			return;
		}

		const strRule = StyleSheet.serialize(rule, styles);
		const index = this._getLastIndex();

		this.element.insertRule(strRule, index);

		return index;
	}

	keyFrames(name, keyFrames) {
		if (!Array.isArray(keyFrames) || keyFrames.length < 2) {
			log.error('keyframes must be an array with more than 1 elements');
			return;
		}

		const index = this._getLastIndex();
		const keyCounts = keyFrames.length - 1;
		const rule = '@keyframes ' + name;

		let styles = '';
		keyFrames.forEach((keyFrame, i) => {
			const { offset = i / keyCounts } = keyFrame;
			styles += StyleSheet.serialize((offset * 100) + '%', keyFrame);
		});

		this.element.insertRule(`${rule} {${styles}}`, index);

		return index;
	}

	media(request, arrStyles) {
		if (typeof request !== 'object') {
			log.error('media request must be an object');
			return;
		}

		const mediaRule = this._buildMediaRule(request);
		const index = this._getLastIndex();

		this.element.insertRule(`${mediaRule} {}`, index);

		const media = new Media(this.element, index);

		if (Array.isArray(arrStyles)) {
			arrStyles.forEach((styles) => {
				const { rule } = styles;
				media.add(rule, styles);
			});
		}

		return media;
	}

	_buildMediaRule(request) {
		const { only } = request;

		let rule = '@media';
		let first = true;

		if (only) {
			rule += ' only';
			request.only = null;
		}

		for (let name in request) {
			const value = request[name];
			if (!value) continue;

			const option = camelCaseToDash(name);

			rule += first ? ' ' : ' and ';

			if (typeof value == 'boolean') {
				rule += option;
			} else if (typeof value == 'number') {
				rule += `(${option}:${value}px)`;
			} else {
				rule += `(${option}:${value})`;
			}

			first = false;
		}

		return rule;
	}

	animation(name) {
		return new Animation(this, name);
	}

	remove(rule) {
		if (rule.isSpecial) {
			rule.clear();
			this.elements.deleteRule(rule.index);
		} else {
			this.elements.deleteRule(rule);
		}
	}

	static serialize(rule, styles) {
		let str = rule + '{';

		for (let name in styles) {
			if (name === 'rule') continue;

			let value = styles[name];
			if (name === 'transform' && typeof value == 'object') {
				value = CSSTransformer.serialize(value);
			}

			str += `${camelCaseToDash(name)}:${value};`;
		}

		return str + '}';
	}
}

class Media {
	constructor(parent, index) {
		this._media = parent.cssRules[index];
		this._rules = this._media.cssRules;
		this.index = index;
	}

	get isSpecial() {
		return true;
	}

	get isMedia() {
		return true;
	}

	add(rule, styles) {
		const index = this._rules.length;
		const strRule = StyleSheet.serialize(rule, styles);

		this._media.insertRule(strRule, index);

		return index;
	}

	remove(index) {
		this._media.deleteRule(index);
	}

	clear() {
		for (let i = 0; i < this._rules.length; i++) {
			this._media.deleteRule(i)
		}
	}
}

const getNameKF = idGetter('__kf__');
const getNameAnim = idGetter('__anim__');

class Animation {
	constructor(parent, name) {
		this._parent = parent;
		this._offsetTime = 0;
		this._prevDuration = 0;
		this._strRule = '';
		this._keyFrames = new Map();

		this.className = name || getNameAnim();
		this.index = null;
	}

	get isSpecial() {
		return true;
	}

	get isAnimation() {
		return true;
	}

	init() {
		this.index = this._parent.add('.' + this.className, {
			animation: this._strRule
		});

		return this;
	}

	add(keyFrames, settings) {
		this._attach(true, keyFrames, settings);
		this._prevThen = true;
		return this;
	}

	and(keyFrames, settings) {
		this._attach(false, keyFrames, settings);
		this._prevThen = false;
		return this;
	}

	_attach(offset, keyFrames, settings = {}) {
		const {
			duration = 1000,
			easing = null,
			steps = null,
			stepType = 'end',
			fillMode = 'forwards',
			delay = 0
		} = settings;

		const time = offset ? this._offsetTime + delay : this._offsetTime - this._prevDuration;
		const nameKF = getNameKF();
		const index = this._parent.keyFrames(nameKF, keyFrames);
		this._keyFrames.set(nameKF, index);

		this._strRule += (this._strRule ? ',' : '') + nameKF;
		this._strRule += ` ${duration}ms`;
		this._strRule += ` ${time}ms`;
		if (steps) this._strRule += ` steps(${steps}, ${stepType})`;
		if (easing) this._strRule += ` ${easing}`;
		if (fillMode) this._strRule += ` ${fillMode}`;

		if (offset) {
			this._offsetTime += duration;
			this._prevDuration = duration;
		}
	}

	clear() {
		this._keyFrames.forEach((index) => this._parent.remove(index));
		this._keyFrames.clear();
	}
}