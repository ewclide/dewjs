import { printErr } from "./functions";

export class MegaFunction
{
	constructor(fn, name)
	{
		var self = this;

		this._handlers = [];
		this._names = Object.create(null);
		this._data;

		var mega = function(data, order){
			return self._call(data, order);
		}

		mega._self = this;
		mega.push = this.push;
		mega.remove = this.remove;
		mega.evoke = this.evoke;
		mega.count = 0;

		if (typeof fn == "function")
			mega.push(fn, name);

		return mega;
	}

	_call(data, order)
	{
		this._data = data;

		order
		? this._handlers.forEach( handler => this._data = handler(this._data) )
		: this._handlers.forEach( handler => handler(data) );

		var result = this._data;
		this._data = null;

		return result;
	}

	push(fn, name)
	{
		var self = this._self;

		if (typeof fn == "function")
		{
			if (name) self._names[name] = this.count;
			self._handlers.push(fn);
			this.count = self._handlers.length;
		}
	}

	remove(id)
	{
		var self = this._self, index = id, handler;

		if (typeof id == "string")
		{
			index = self._names[id];
			delete self._names[id];
		}

		if (self._handlers[index])
		{
			self._handlers.splice(index, 1);
			this.count = self._handlers.length;
		}
	}

	evoke(id, data)
	{
		var self = this._self, index = id, handler;

		if (typeof id == "string") index = self._names[id];

		if (self._handlers[index]) return self._handlers[index](data);
		else printErr('Dew MegaFunction evoke error: undefined function with id "' + id + '"');
	}
}