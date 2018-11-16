export default class StyleSheet
{
	constructor()
	{
		this.styleSheet;
		this._create();
	}

	_create()
	{
		if (document.createStyleSheet)
			this.styleSheet = document.createStyleSheet();

		else
		{
			let head = document.getElementsByTagName("head")[0],
				style = document.createElement("style");

			head.appendChild(style);

			this.styleSheet = document.styleSheets[document.styleSheets.length - 1];
		}
	}

	addRule(selector, styles)
	{
		let strStyles = this._stylesToString(styles);

		this.styleSheet.insertRule
		? this.styleSheet.insertRule(`${selector} {${strStyles}}`, this.styleSheet.cssRules.length)
		: this.styleSheet.addRule(selector, strStyles, this.styleSheet.cssRules.length)
	}

	addRules(styles)
	{
		for (selector in styles)
			this.addRule(selector, styles[selector]);
	}

	deleteRule(index)
	{
		this.styleSheet.deleteRule(index) 
	}

	_stylesToString(styles)
	{
		let result = "";

		for (let name in styles)
			result += `${name}:${styles[name]};`;

		return result;
	}
}