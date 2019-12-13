export default function define(obj, fields, options = {}) {
    const { enumer, config, write, get, set, value } = options;
	let desc = {
		enumerable  : typeof enumer == 'boolean' ? enumer : false,
		configurable: typeof config == 'boolean' ? config : true,
		writable    : typeof write  == 'boolean' ? write  : true
	};

	if (typeof fields == 'string') {

		if (value !== undefined) {
            desc.value = value;

		} else if (typeof get == 'function' && typeof set == 'function') {
			desc.get = get;
			desc.set = set;
			delete desc.writable;
		}

		Object.defineProperty(obj, fields, desc);

		if (typeof set == 'function' && value !== undefined) {
			obj[fields] = value;
		}

	} else {
		for (let key in fields) {
			desc.value = fields[key];
			Object.defineProperty(obj, String(key), desc);
		}
	}
}