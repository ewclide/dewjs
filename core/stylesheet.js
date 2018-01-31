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
				element = document.createElement("style");

			head.appendChild(element);

			this.styleSheet = document.styleSheets[document.styleSheets.length - 1];
		}
	}

	addRule(selector, styles)
	{
		var styles = this._stylesToString(styles);

		if (this.styleSheet.insertRule)
		{
			var rule = selector + " {" + styles + "}";
			this.styleSheet.insertRule(rule, this.styleSheet.cssRules.length);
		}
		else
		{
			this.styleSheet.addRule(selector, styles, this.styleSheet.cssRules.length);
		}
	}

	addRules(styles)
	{
		for (selector in styles)
			this._addRule(selector, styles[selector]);
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