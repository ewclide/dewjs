class Url
{
	constructor()
	{
		this._search = this._getSearch(location.search);
		this._path = this._getPath(location.pathname);
		this._strPath = location.pathname;
		this._strSearch = location.search;
	}

	_getSearch(search)
	{
		var result = {};

		if (search)
		{
			search = search.replace("?", "").split("&");
			search.forEach( p => {
				var p = p.split("=");
				result[p[0].replace("-", "_")] = p[1];
			});
		}

		return result;
	}

	_getPath(path)
	{
		return path.replace(/^\/|\/$/g, "").split("/");
	}

	changeState()
	{
		history.replaceState(null, document.title, this._strPath + this._strSearch);
	}

	addState()
	{
		history.pushState(null, document.title, this._strPath + this._strSearch);
	}

	getPath()
	{
		return this._path;
	}

	setPath(path, changeState)
	{
		if (Array.isArray(path))
			path = "/" + path.join("/") + "/";

		this._strPath = path;

		if (changeState) this.changeState();

		return this;
	}

	getSearch(name)
	{
		if (name === undefined) return this._search;
		else if (typeof name == "string") return this._search[name];
		else if (Array.isArray(name))
		{
			var result = {};

			name.forEach( p => {
				if (p in this._search) result[p] = this._search[p];
			});

			return result;
		}
	}

	setSearch(params, changeState)
	{
		for (var i in params)
			this._search[i] = params[i];

		this._strSearch = this.serialize(this._search);

		if (changeState) this.changeState();

		return this;
	}

	removeSearch(name, changeState)
	{
		if (name === undefined) this._search = {};
		else if (typeof name == "string") delete this._search[name];
		else if (Array.isArray(name))
			name.forEach( p => {
				if (p in this._search) delete this._search[p];
			})

		this._strSearch = this.serialize(this._search);

		if (changeState) this.changeState();

		return this;
	}

	setFullPath(path, search, changeState)
	{
		if (path) this.setPath(path);
		if (search) this.setSearch(search);
		if (changeState) this.changeState();
	}

	go(path)
	{
		if (!path) path = this._strPath;
		location.href = path + this._strSearch;
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

export var url = new Url();