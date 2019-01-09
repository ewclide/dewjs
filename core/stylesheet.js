import { printErr, camelCaseToDash } from './functions';

export default class StyleSheet
{
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

	_add(rule, styles) {
		if (typeof rule !== 'string') {
			printErr(`rule "${rule}" argument must be a string`);
			return;

		} else if (typeof styles !== 'object') {
			printErr(`styles "${styles}" argument must be an object`);
			return;
		}

		const strRule = this._serialize(rule, styles);
		const index = this._getLastIndex();

		this.element.insertRule(strRule, index);

		return index;
	}

	add() {
		if (arguments.length > 1) {
			const [ rule, styles ] = arguments;
			this._add(rule, styles);

		} else if (Array.isArray(arguments[0])) {
			arguments[0].forEach((styles) => {
				const { rule } = styles;
				this._add(rule, style);
			});
		}
	}

	addKeyFrames(name, keyFrames) {
		if (!Array.isArray(keyFrames) || keyFrames.length < 2) {
			printErr('KeyFrames must be an array with more than 2 elements');
			return;
		}

		const index = this._getLastIndex();
		const keyCounts = keyFrames.length;
		const rule = '@keyframes ' + name;
		let styles = '';

		keyFrames.forEach((keyFrame, i) => {
			const { offset = i / keyCounts } = keyFrame;
			styles += this._serialize((offset * 100) + '%', keyFrame);
		});

		this.element.insertRule(`${rule} {${styles}}`, index);

		return index;
	}

	media(request, arrStyles) {
		if (typeof request !== 'object') {
			printErr('media request must be an object');
			return;
		}

		const { only } = request;

		let media = '@media';
		let first = true;

		if (only) {
			media += ' only';
			request.only = null;
		}

		for (let name in request) {
			const value = request[name];
			if (!value) continue;

			const option = camelCaseToDash(name);

			media += first ? ' ' : ' and ';

			if (typeof value == 'boolean') {
				media += option;
			} else if (typeof value == 'number') {
				media += `(${option}:${value}px)`;
			} else {
				media += `(${option}:${value})`;
			}

			first = false;
		}

		const index = this._getLastIndex();
		let strRule = '';

		if (Array.isArray(arrStyles)) {
			arrStyles.forEach((styles) => {
				const { rule } = styles;
				strRule += this._serialize(rule, styles);
			});
		}

		this.element.insertRule(`${media} {${strRule}}`, index);

		return index;
	}

	remove(index) {
		this.element.deleteRule(index);
	}

	_serialize(rule, styles) {
		let str = rule + '{';

		for (const name in styles) {
			if (name === 'rule') continue;
			str += `${name}:${styles[name]};`;
		}

		return str + '}';
	}
}