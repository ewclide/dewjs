import {printErr} from './functions';

export default class StyleSheet
{
	constructor() {
		this.element = this._createElement();
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

	_add(rule, styles) {
		if (typeof rule !== 'string') {
			printErr(`rule "${rule}" argument must be a string`);
			return;

		} else if (typeof styles !== 'object') {
			printErr(`styles "${styles}" argument must be an object`);
			return;
		}

		const strStyles = this._stylesToString(styles);
		const index = this.element.cssRules.length;

		this._insert(rule, strStyles, index);

		return index;
	}

	add() {
		if (arguments.length > 1) {
			const [ rule, styles ] = arguments;
			this._add(rule, styles);

		} else if (typeof arguments[0] == 'object') {
			const styles = arguments[0];

			for (rule in styles) {
				this._add(rule, styles[rule]);
			}
		}
	}

	_insert(rule, styles, index) {
		if ('insertRule' in this.element) {
			this.element.insertRule(`${rule} {${styles}}`, index);
		} else {
			this.element.addRule(rule, styles, index);
		}
	}

	addKeyFrames(name, keyFrames) {
		if (!Array.isArray(keyFrames) || keyFrames.length < 2) {
			printErr('KeyFrames must be an array with more than 2 elements');
			return;
		}

		const index = this.element.cssRules.length;
		const keyCounts = keyFrames.length;
		const rule = '@keyframes ' + name;
		let styles = '';

		keyFrames.forEach((keyFrame, i) => {
			const { offset = i / keyCounts } = keyFrame;
			const keyStyles = this._stylesToString(keyFrame);
			styles += `${offset * 100}% {${keyStyles}}`;
		});

		this._insert(rule, styles, index);

		return index;
	}

	remove(index) {
		this.element.deleteRule(index);
	}

	_stylesToString(styles) {
		let result = '';

		for (const name in styles) {
			result += `${name}:${styles[name]};`;
		}

		return result;
	}
}