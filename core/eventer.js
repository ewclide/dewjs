import { log } from './functions';
import Callback from './callback';

export default class Eventer {
	constructor() {
		this._events = {};
		this._locks = {};
	}

	listen(type, handler) {
		const event = this._events[type];

		if (event) {
			event.push(handler);
		} else {
			this._events[type] = new Callback(handler);
		}
	}

	refuse(type, handler) {
		const event = this._events[type];
		if (event) event.remove(handler);
	}

	detach(type) {
		this._events[type] = null;
	}

	clear(type) {
		const event = this._events[type];
		if (event) event.clear();
	}

	lock(type) {
		const event = this._events[type];

		if (event) {
			this._locks[type] = event;
		}
	}

	unlock(type) {
		const locked = this._locks[type];

		if (locked) {
			this._events[type] = locked;
			this._locks[type] = null;
		}
	}

	dispatch(type, data) {
		const event = this._events[type];
		const locked = this._locks[type];

		if (event.isCallback) {
			if (!locked) event.call(data);
		} else {
			log.warn(`eventer error - event '${type}' is not defined`);
		}
	}
}