export class URLmanager
{
	constructor()
	{
		this._params = this._getParamsInSearch();
		this.search = location.search;
		this.path = location.pathname;
	}

	take(name)
	{
		if (name === undefined)
			return this._params;

		else if (typeof name == "string")
			return this._params[name];

		else if (Array.isArray(name))
		{
			var self = this,
				result = {};

			this.name.forEach(function(p){
				if (p in self._params)
					result[p] = self._params[p];
			});

			return result;
		}
	}

	_getParamsInSearch()
	{
		var params, search;

		params = {};
		search = location.search;

		if (!search) return false;

		search = search.replace("?", "");
		search = search.split("&");
		search.forEach(function(p){
			p = p.split("=");
			params[p[0]] = p[1];
		});

		return params;
	}

	put(params)
	{
		var self = this, search;

		this._params = params;
		search = this._build();

		history.pushState({ foo: "bar" }, "page", self.path + search);

		return {
			go : function(path)
			{
				if (!path) path = self.path;
				path += search;

				location.href = path;
			}
		}
	}

	add(params)
	{
		var self = this, search;

		this._params.$join.full(params);
		search = this._build();

		history.pushState({ foo: "bar" }, "page", self.path + search);

		return {
			go : function(path)
			{
				if (!path) path = self.path;
				path += search;

				location.href = path;
			}
		}
	}

	_build()
	{
		var request = "?";

		for (var i in this._params)
			request += i + "=" + this._params[i] + "&";

		return request.slice(0, -1);
	}
}