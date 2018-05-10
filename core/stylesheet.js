export class StyleSheet
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
			var head = document.getElementsByTagName("head")[0],
				style = document.createElement("style");

			head.appendChild(style);

			this.styleSheet = document.styleSheets[document.styleSheets.length - 1];
		}
	}

	addRule(selector, styles)
	{
		var styles = this._stylesToString(styles);

		this.styleSheet.insertRule
		? this.styleSheet.insertRule(selector + " {" + styles + "}", this.styleSheet.cssRules.length)
		: this.styleSheet.addRule(selector, styles, this.styleSheet.cssRules.length)
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
		var result = "";

		for (var i in styles)
			result += i + ":" + styles[i] + ";";

		return result;
	}
}