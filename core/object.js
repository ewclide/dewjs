import {printErr} from './functions';
import ObjectIniter from './object-initer';

function _createClone(object, full) {
    function Clone() {
        for (let field in object) {
            if (object.hasOwnProperty(field)) {
                this[field] = full ? _createClone(object[field], true) : object[field];
            }
        }
    }

    if (Array.isArray(object)) {
        return object.slice();
    }

    else if (typeof object == 'object') {
        Clone.prototype = '__proto__' in object
        ? object.__proto__ : Object.getPrototypeOf(object);

        Clone.constructor = object.constructor;

        return new Clone();
    }

    else return object;
}

export function clone(target, full) {
    return target.constructor != Object
    ? Object.assign((new target.constructor()), target)
    : _createClone(target, full)
}

function _fetchProp(prop, objects) {
    for (const obj of objects) {
        if (prop in obj) return obj;
    }
}

export function innerAssign(target, source, copy) {
    const result = copy ? Object.assign({}, target) : target;
    
    if (Array.isArray(source)) {
        for (const prop in result) {
            const val = _fetchProp(prop, source);
            if (val !== undefined) result[prop] = val;
        }

        return result;
    }

    for (const prop in result) {
        if (prop in source) {
            result[prop] = source[prop];
        }
    }

    return result;
}

export function outerAssign(target, source, copy) {
    const result = copy ? Object.assign({}, target) : target;

    if (Array.isArray(source)) {
        source.forEach((src) => outerAssign(result, src));
        return result;
    }

    for (const prop in source) {
        if (!(prop in result)) {
            result[prop] = source[prop];
        }
    }

    return result;
}

function _defineProperties(target, source) {
    for (const prop in from) {
        const desc = Object.getOwnPropertyDescriptor(source, prop);
        if (desc) {
            Object.defineProperty(target, prop, desc);
        } else {
            target[prop] = source[prop];
        }
    }

    return target;
}

export function fullAssign(target, source, copy) {
    const result = copy ? _defineProperties({}, target) : target;

    if (Array.isArray(source)) {
        source.forEach((src) => _defineProperties(result, src));
        return result;
    }

    return _defineProperties(result, source);
}

export function init(target, values, settings, common = { errors : true }) {
    if (!values || !settings) {
        printErr('DEW object.init error - missing required arguments (values or settings)');
        return false;
    }

    const initer = new ObjectIniter(target);

    for (let field in settings) {
        if (typeof settings[field] !== 'object') {
            common.def = settings[field];
            initer.checkout(field, common, values[field]);
        } else {
            initer.checkout(field, settings[field], values[field]);
        }
    }

    return initer.errors.length ? (common.errors && printErr(initer.errors), false) : true;
}

export function define(obj, fields, options = {}) {
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