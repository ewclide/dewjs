import MegaFunction from "./mega-function";

const _eventList = {};
const _lockList = {};

const eventer = {
	listen: (type, handler) => {
		const event = _eventList[type];

		if (event && event.isMegaFunction) {
			event.push(handler);
		} else {
			_eventList[type] = new MegaFunction(handler);
		}
	},

	refuse: (handler) => {
		
	},

	detach: (type) => {
		_eventList[type] = null;
	},

	clear: (type) => {
		const event = _eventList[type];

		if (event && event.isMegaFunction) {
			event.clear();
		}
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

		if (typeof event == 'function') {
			if (!locked) event(data);
		} else {
			console.warn(`eventer error - event '${type}' is not defined`);
		}
	}
}

export default eventer;