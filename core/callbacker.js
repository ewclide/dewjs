import {printErr} from "./functions";

export default class CallBacker
{
	constructor(handler) {
		this._handlers = new Map();

		if (typeof handler == "function") {
			this.push(handler);
		}
	}

	get isCallBacker() {
		return true;
	}

	get length() {
		return this._handlers.size;
	}

	async(...args) {
		// this._handlers.forEach((handler) => {
		// 	handler(args)
		// 	args = Array.isArray(args) ? handler(...args) : handler(args);
		// });

		return args.length > 1 ? args : args[0];
	}

	call(...args) {
		this._handlers.forEach( handler => handler(...args));
		return args.length > 1 ? args : args[0];
	}

	sequence(...args) {
		this._handlers.forEach( handler => {
			args = Array.isArray(args) ? handler(...args) : handler(args);
		});

		return args;
	}

	filter(filter, ...args) {
		let index = 0;

		for (let handler of this._handlers) {
			const product = Array.isArray(args)
			? handler[1](...args) : handler[1](args);

			const skip = Array.isArray(product)
			? filter(index, ...product) : filter(index, product);

			if (skip) {
				args = product;
				index++;
			} else {
				break;
			}
		}

		return args;
	}

	single(key, ...args) {
		const handler = this._handlers.get(key);

		if (handler) {
			return handler(...args);
		} else {
			printErr(`CallBacker error: undefined handler with key "${key}"`);
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