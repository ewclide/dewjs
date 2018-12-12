import {printErr} from "./functions";

export default class MegaFunction
{
	constructor(fn, name) {

		this._handlers = [];
		this._names = {};
		this._data;

		const mega = (data, order, filter) => this._call(data, order, filter);

		mega.__megaInstance = this;
		mega.isMegaFunction = true;
		mega.count = 0;

		mega.push = this.push;
		mega.remove = this.remove;
		mega.clear = this.clear;
		mega.pop = this.pop;
		mega.shift = this.shift;
		mega.invoke = this.invoke;

		if (typeof fn == "function") {
			mega.push(fn, name);
		}

		return mega;
	}

	_call(data, order, filter) {
		this._data = data;

		if (order) {
			if (typeof filter == "function") {
				for (let i = 0; i < this._handlers.length; i++) {
					let handler = this._handlers[i],
						skip = filter(this._data, i);

					if (skip) this._data = handler(this._data);
					else break;
				}
			} else {
				this._handlers.forEach(handler => this._data = handler(this._data))
			}

		} else {
			this._handlers.forEach( handler => handler(data) );
		}

		const result = this._data;
		this._data = null;

		return result;
	}

	push(fn, name) {
		const self = this.__megaInstance;

		if (typeof fn == "function") {
			if (name) {
				self._names[name] = this.count;
				fn.__megaName = name;
			}
			
			self._handlers.push(fn);
			this.count = self._handlers.length;
		}
	}

	remove(id) {
		let self = this.__megaInstance, index, name;

		if (typeof id == 'string') {
			index = self._names[id];
			name = id;
		} else if (typeof id == 'number') {
			index = id;
		}

		const fn = self._handlers[index];

		if (fn) {
			name = fn.__megaName;
			if (name) delete self._names[name];

			self._handlers.splice(index, 1);
			this.count = self._handlers.length;
		}
	}

	clear() {
		let self = this.__megaInstance;
		self._handlers = [];
		self._names = {};
		self._data = null;
	}

	pop() {
		const self = this.__megaInstance;
		const last = self._handlers.pop();
		const name = last.__megaName;

		if (name) self._names[name] = null;

		this.count = self._handlers.length;
	}

	shift() {
		const self = this.__megaInstance;
		const first = self._handlers.shift();
		const name = first.__megaName;

		if (name) delete self._names[name];

		this.count = self._handlers.length;
	}

	invoke(id, data) {
		const self = this.__megaInstance;
		let index = id;

		if (typeof id == "string") {
			index = self._names[id];
		}

		if (self._handlers[index]) {
			return self._handlers[index](data);
		} else {
			printErr('DEW MegaFunction invoke error: undefined function with id "' + id + '"');
		}
	}
}