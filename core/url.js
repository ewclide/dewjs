export class URLmanager
{
	constructor()
	{
		this.params = this._getSearchParams();
		this.search = location.search;
		this.path = location.pathname;
	}

	getParams(name)
	{
		if (name === undefined)
			return this.params;

		else if (typeof name == "string")
			return this.params[name];

		else if (Array.isArray(name))
		{
			var result = {};

			this.name.forEach( p => {
				if (p in this.params)
					result[p] = this.params[p];
			});

			return result;
		}
	}

	setParams(params, clear = false)
	{
		if (clear) this.clear();

		for (var i in params)
			this.params[i] = params[i];

		history.pushState({ foo: "bar" }, "page", this.path + this.serialize(this.params));

		return this;
	}

	clear()
	{
		this.params = {}
		return this;
	}

	go(path)
	{
		if (!path) path = location.pathname;
		location.href = path + this.serialize(this.params);
	}

	_getSearchParams()
	{
		var request = location.search,
			result = {};

		if (request)
		{
			request = request.replace("?", "").split("&");
			request.forEach( p => {
				var p = p.split("=");
				result[p[0].replace("-", "_")] = p[1];
			});
		}

		return result;
	}

	serialize(data)
	{
		var request = "?";

		for (var i in data)
		{
			if (typeof data[i] == "number" || typeof data[i] == "string" || typeof data[i] == "boolean")
				request += i + "=" + data[i] + "&";
		}

		return request.slice(0, -1);
	}
}