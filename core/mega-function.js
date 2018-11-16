import {printErr} from "./functions";

export default class MegaFunction
{
	constructor(fn, name)
	{
		let self = this;

		this._handlers = [];
		this._names = Object.create(null);
		this._data;

		let mega = function(data, order, filter){
			return self._call(data, order, filter);
		}

		mega.__megaInstance = this;
		mega.isMegaFunction = true;
		mega.count = 0;

		mega.push = this.push;
		mega.remove = this.remove;
		mega.invoke = this.invoke;

		if (typeof fn == "function")
			mega.push(fn, name);

		return mega;
	}

	_call(data, order, filter)
	{
		this._data = data;

		if (order)
		{
			if (typeof filter == "function")
				for (let i = 0; i < this._handlers.length; i++)
				{
					let handler = this._handlers[i],
						skip = filter(this._data, i);

					if (skip) this._data = handler(this._data);
					else break;
				}

			else this._handlers.forEach(
				handler => this._data = handler(this._data)
			)
		}
		else
		{
			this._handlers.forEach( handler => handler(data) );
		}

		let result = this._data;
		this._data = null;

		return result;
	}

	push(fn, name)
	{
		let self = this.__megaInstance;

		if (typeof fn == "function")
		{
			if (name) self._names[name] = this.count;
			self._handlers.push(fn);
			this.count = self._handlers.length;
		}
	}

	remove(id)
	{
		let self = this.__megaInstance, index = id, handler;

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

	invoke(id, data)
	{
		let self = this.__megaInstance, index = id, handler;

		if (typeof id == "string") index = self._names[id];

		if (self._handlers[index]) return self._handlers[index](data);
		else printErr('Dew MegaFunction invoke error: undefined function with id "' + id + '"');
	}
}