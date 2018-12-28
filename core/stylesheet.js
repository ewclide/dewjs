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

		const strStyles = this._convertToString(styles);
		const index = this.element.cssRules.length;

		if ('insertRule' in this.element) {
			this.element.insertRule(`${rule} {${strStyles}}`, index)
		} else {
			this.element.addRule(rule, strStyles, index)
		}

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

	remove(index) {
		this.element.deleteRule(index);
	}

	_convertToString(styles) {
		let result = '';

		for (const name in styles) {
			result += `${name}:${styles[name]};`;
		}

		return result;
	}
}