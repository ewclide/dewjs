import {printErr} from "./functions";

export default class Invoker
{
	constructor(handler) {
		this._handlers = new Map();
		this._data;

		if (typeof handler == "function") {
			this.push(handler);
		}
	}

	get length() {
		return this._handlers.size;
	}

	call(...args) {
		this._handlers.forEach((handler) => handler(...args));
		return args.length > 1 ? args : args[0];
	}

	orderCall(...args) {
		this._handlers.forEach((handler) => {
			args = Array.isArray(args) ? handler(...args) : handler(args);
		});
		return args.length > 1 ? args : args[0];
	}

	filterCall(filter, ...args) {
		let index = 0;

		for (let item of this._handlers) {
			const handler = item[1];
			const isArr = Array.isArray(args);
			const skip = isArr ? filter(index, ...args) : filter(index, args);

			if (skip) {
				args = isArr ? handler(...args) : handler(args);
				index++;
			} else {
				break;
			}
		}

		console.log(args)

		// return Array.isArray(args) && args.length ? args : args[0];
	}

	singleCall(key, ...args) {
		const handler = this._handlers.get(key);
		
		if (handler) {
			return handler(...args);
		} else {
			printErr(`Invoker error: undefined handler with key "${key}"`);
		}
	}

	push(handler) {
		if (typeof handler == "function") {
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
		if (first) {
			this._handlers.delete(first);
		}
	}
}