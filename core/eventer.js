import MegaFunction from "./mega-function";

const _eventList = {};

const eventer = {
	listen: (type, handler) => {
		if (!(type in _eventList)) {
			_eventList[type] = new MegaFunction(handler);
		} else {
			_eventList[type].push(handler)
		}
	},

	dispatch: (type, data) => {
		if (type in _eventList) {
			_eventList[type].apply(null, data);
		} else {
			console.warn(`eventer don't have ${type} event`);
		}
	}
}

export default eventer;