import log from '../function/log';

export default class Callback {
	constructor(...handlers) {
		this._handlers = new Map();

		if (handlers.length) {
			handlers.forEach((h) => this.push(h));
		}
	}

	get isCallback() {
		return true;
	}

	get size() {
		return this._handlers.size;
	}

	call(...args) {
		const all = [];

		this._handlers.forEach((handler) => {
			const res = handler(...args);
			all.push(res);
		});

		return all;
	}

	sequence(...args) {
		let data = args;

		this._handlers.forEach((handler) => {
			data = Array.isArray(data) ? handler(...data) : handler(data);
		});

		const { length } = data;
		return !length || length > 1 ? data : data[0];
	}

	filter(filter, ...args) {
		let index = 0;
		let data = args;

		for (const handler of this._handlers) {
			const product = Array.isArray(data)
				? handler[1](...data) : handler[1](data);

			const skip = Array.isArray(product)
				? filter(index, ...product) : filter(index, product);

			if (skip) {
				data = product;
				index++;
			} else {
				break;
			}
		}

		return data;
	}

	single(key, ...args) {
		const handler = this._handlers.get(key);

		if (handler) {
			return handler(...args);
		} else {
			log.error(`Callback error: undefined handler with key "${key}"`);
			return false;
		}
	}

	push(handler) {
		if (typeof handler == 'function') {
			const name = handler.name || handler;
			this._handlers.set(name, handler);
			this._lastKey = name;
		}
	}

	remove(key) {
		if (this._handlers.has(key)) {
			this._handlers.delete(key);
		}
	}

	clear() {
		this._handlers.clear();
	}

	pop() {
		this._handlers.delete(this._lastKey);
	}

	shift() {
		const first = this._handlers.keys().next().value;
		if (first) this._handlers.delete(first);
	}
}