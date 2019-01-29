class Url {
	constructor() {
		const { pathname, search } = location;

		this._search = this._getSearch(search);
		this._path = this._getPath(pathname);
		this._strPath = pathname;
		this._strSearch = search;
	}

	_getSearch(search) {
		const result = new Map();

		if (search) {
			const pairs = search.replace('?', '').split('&');
			pairs.forEach( pair => {
				const p = pair.split('=');
				const name = p[0].replace('-', '_');
				result.set(name, p[1]);
			});
		}

		return result;
	}

	_getPath(path) {
		return path.replace(/^\/|\/$/g, '').split('/');
	}

	changeState() {
		history.replaceState(null, document.title, this._strPath + this._strSearch);
	}

	addState() {
		history.pushState(null, document.title, this._strPath + this._strSearch);
	}

	getPath() {
		return this._path;
	}

	setPath(path, changeState) {
		if (Array.isArray(path)) {
			path = `/${path.join('/')}/`;
		}

		this._strPath = path;

		if (changeState) this.changeState();

		return this;
	}

	getSearch(name) {
		if (name === undefined) {
			return this._search;

		} else if (this._search.has(name)) {
			return this._search.get(name);

		} else if (Array.isArray(name)) {
			const result = {};

			name.forEach((n) => {
				if (this._search.has(n)) {
					result[n] = this._search.get(n);
				}
			});

			return result;
		}
	}

	setSearch(params, changeState) {
		for (const key in params) {
			this._search.set(key, params[key]);
		}

		this._strSearch = this.serialize(this._search);

		if (changeState) this.changeState();

		return this;
	}

	removeSearch(name, changeState) {
		if (name === undefined) {
			this._search.clear();

		} else if (this._search.has(name)) {
			this._search.delete(name);

		} else if (Array.isArray(name)) {
			name.forEach((n) => {
				if (this._search.has(n)) this._search.delete(n)
			});
		}

		this._strSearch = this.serialize(this._search);

		if (changeState) this.changeState();

		return this;
	}

	setFullPath(path, search, changeState) {
		if (path) this.setPath(path);
		if (search) this.setSearch(search);
		if (changeState) this.changeState();
	}

	go(path) {
		if (!path) path = this._strPath;
		location.href = path + this._strSearch;
	}

	serialize(data) {
		let request = '?';

		for (let name in data) {
			const val = data[name];
			if (typeof val == 'number' || typeof val == 'string' || typeof val == 'boolean') {
				request += `${name}=${val}&`
			}
		}

		return request.slice(0, -1);
	}
}

const url = new Url();
export default url;
