import CallBacker from "./callbacker";

const _eventList = {};
const _lockList = {};

const eventer = {
	listen: (type, handler) => {
		const event = _eventList[type];

		if (event) {
			event.push(handler);
		} else {
			_eventList[type] = new CallBacker(handler);
		}
	},

	refuse: (type, handler) => {
		const event = _eventList[type];
		if (event) event.remove(handler);
	},

	detach: (type) => {
		_eventList[type] = null;
	},

	clear: (type) => {
		const event = _eventList[type];
		if (event) event.clear();
	},

	lock: (type) => {
		const event = _eventList[type];

		if (event) {
			_lockList[type] = event;
		}
	},

	unLock: (type) => {
		const locked = _lockList[type];

		if (locked) {
			_eventList[type] = locked;
			_lockList[type] = null;
		}
	},

	dispatch: (type, data) => {
		const event = _eventList[type];
		const locked = _lockList[type];

		if (event.isCallBacker) {
			if (!locked) event.call(data);
		} else {
			console.warn(`eventer error - event '${type}' is not defined`);
		}
	}
}

export default eventer;