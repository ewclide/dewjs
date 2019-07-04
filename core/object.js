import { log } from './functions';
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
        log.error('DEW object.init error - missing required arguments (values or settings)');
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

    return initer.errors.length ? (common.errors && log.error(initer.errors), false) : true;
}

function _searchInObject(root, key, value, chld, all, depth) {
    if (!depth) return;

    const result = [];
    const field = root[key];

    if (value === field) {
        result.push(root);
        if (!all) return result;
    }

    const children = root[chld];

    if (Array.isArray(children)) {
        depth--;
        for (const child of children) {
            const inside = _searchInObject(child, key, value, chld, all, depth);
            if (inside && inside.length) {
                result.push(...inside);
                if (!all) return result;
            }
        }
    } else if (typeof children == 'object') {
        depth--;
        const found = _searchInObject(children, key, value, chld, all, depth);
        result.push(...found);
    }

    return result;
}

export function search(root, key, value, settings = {}) {
    if (key === undefined || value === undefined) {
        log.error(`Object.search error: settings must have "key" and "value" props!`);
        return;
    }

    const {
        all = false,
        children = 'children',
        depth = 3
    } = settings;

    return _searchInObject(root, key, value, children, all, depth);
}

export function dispose(inst) {
    Object.keys(inst).forEach(prop => inst[prop] = null);
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