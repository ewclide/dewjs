export class URL
{
	constructor()
	{
		this.params = {}
	}

	get(params)
	{
		var all, search;

		all = {};
		search = location.search;

		if (!search) return false;

		search = search.replace("?", "");
		search = search.split("&");
		search.forEach(function(pair){
			pair = pair.split("=");
			all[pair[0]] = pair[1];
		});

		if (params === undefined) return all;
		else if (istype(params, "string")) return all[params];
		else if (istype(params, "array"))
		{
			var arr = {}
			params.forEach(function(param, name){
				if (param in all) arr[param] = all[param];
			});
			return arr;
		}
	}

	set(options)
	{
		var params = this._build(options);

		history.pushState({ foo: "bar" }, "page", location.pathname + params);

		return {
			go : function(path)
			{
				if (!path) path = location.pathname;
				if (params) path += params;

				location.href = path;
			}
		}
	}

	add(options)
	{
		var params = self.get();

		if (params)
		{
			for (var i in options)
				params[i] = options[i];
		}
		else params = options;

		params = this._build(params);

		history.pushState({ foo: "bar" }, "page", location.pathname + params);

		return {
			go : function(path)
			{
				if (!path) path = location.pathname;
				if (params) path += params;

				location.href = path;
			}
		}
	}

	_build(options)
	{
		if (options)
		{
			var request = "?";

			for (var i in options)
				request += i + "=" + options[i] + "&";

			return request.slice(0, -1);
		}
		else return "";
	}
}