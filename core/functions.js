export function idGetter(prefix = 0) {
	return (() => {
		let id = 0;
		return () => prefix + id++;
	})();
}

export const BROWSERS = {
	UNKNOWN: 0,
	CHROME: 1,
	FIREFOX: 2,
	OPERA: 3,
	SAFARI: 4,
	IE: 5
}

function _getBrowser() {
    const agent = navigator.userAgent;

    if (agent.search(/Chrome/) > 0)  return BROWSERS.CHROME;
    if (agent.search(/Firefox/) > 0) return BROWSERS.FIREFOX;
    if (agent.search(/Opera/) > 0)   return BROWSERS.OPERA;
    if (agent.search(/Safari/) > 0)  return BROWSERS.SAFARI;
    if (agent.search(/MSIE|\.NET/) > 0) return BROWSERS.IE;

    return BROWSERS.UNKNOWN;
}

export const browser = _getBrowser();

export const LOG_IGNORE = [];

function _getSourceLog() {
	let stack = (new Error()).stack;

	if (stack) stack = stack.split('\n');
	else return '';

	let scripts = LOG_IGNORE.join('|');
	if (scripts) scripts += '|';
	const reg = new RegExp(`(${scripts}dew)(\.min|\.dev)?\.js|anonymous`, 'g');

	for (let i = 0; i < stack.length; i++) {
		if (stack[i].search(reg) == -1) {
			const src = stack[i].match(/https?:[^\)]+/g);
			if (src && src[0]) return src[0];
		}
	}

	return '';
}

export function log() {
	const args = Array.from(arguments);
	const source = _getSourceLog();

    if (source) {
		args.push(` (src: ${source})`);
	}

	console.log.apply(null, args);
}

log.json = (json, spaces = 4) => log(JSON.stringify(json, null, spaces));
log.time = (name) => console.time(name);
log.timeEnd = (name) => console.timeEnd(name);

log.error = function(errorList, source = true) {
	let error = 'Error: ';
	let src = '';

	if (source) src = _getSourceLog();

	if (Array.isArray(errorList) && errorList.length) {
		error += errorList.title || 'Error list';
		error += '\n';

		errorList.forEach((message) => error += `  --> ${message}\n` );

        if (source) error += `  -----\n  src: ${src}`;
	}

	else if (typeof errorList == 'string') {
		error += errorList;
		if (source) error += ` (src: ${src})`;
	}

	else return false;

	console.error(error);

	return false;
}

log.warn = function(text, source = true) {
	let warnText = 'Warning: ' + [...text].join(' ');

	if (source) {
		warnText += ` (src: ${_getSourceLog()})`;
	}

	console.warn(warnText);
}

export function isType(value, type) {
	if (Array.isArray(type)) {
		return type.some((t) => isType(value, t));
	}

	else if (type !== undefined) {
		switch (type) {
			case 'number'   : return typeof value == 'number';
			case 'string'   : return typeof value == 'string';
			case 'boolean'  : return typeof value == 'boolean';
			case 'array'    : return Array.isArray(value);
			case 'function' : return typeof value == 'function';
			case 'DOM'      : return value instanceof Element;
			case 'HTMLTools': return value.isHTMLTools ? true : false;
			default : log.error(`the type "${type}" is unknown!`); return false;
		}

	} else {
		if (typeof value == 'number') return 'number';
		else if (typeof value == 'string') return 'string';
		else if (typeof value == 'boolean') return 'boolean';
		else if (Array.isArray(value)) return 'array';
		else if (typeof value == 'function') return 'function';
		else if (value instanceof Element) return 'DOM';
		else if (value.isHTMLTools) return 'HTMLTools';
		else return 'object';
	}
}

export function strParse(value) {
	if (typeof value == 'string') {
		if (+value) return +value;
		if (value == 'true' || value == 'TRUE') return true;
		if (value == 'false' || value == 'FALSE') return false;
		if (value.search(/\[.+\]/g) != -1) {
			value = value.replace(/\[|\]/g, '').split(',');
			return value.map(val => strParse(val));
		}
		if (value.search(/\{.+\}/gm) != -1) return jsonParse(value);

		return trim(value);

	} else {
		log.error('strParse error - type of argument must be "string"');
	}
}

export function intParse(str) {
	return +str.replace(/[^\d]/g, '');
}

export function floatParse(str) {
	return parseFloat(str.replace(/,/, '.').replace(/[^\d.,]/g, ''));
}

export function jsonParse(str) {
	const devs = '{}[],:';
	const reg = /^[\s*"']+|['"\s*]+$/gm;

	let quot = '', word = '', isString = false, left = false;
	let result = '';

    for (let i = 0; i < str.length; i++) {

    	if (isString && str[i] == quot) {
			isString = false;
			i++
		}

    	if (str[i] == "'" || str[i] == '"') {
			isString = true;
			quot = str[i];
			i++
		}

    	left = str[i] == ":";

        if (devs.indexOf(str[i]) != -1 && !isString) {
        	word = word.replace(reg, '');

            if (word) {
				if (word == 'true') word = true;
            	else if (word == 'false') word = false;

            	result += typeof word == 'boolean' && !left || +word && !left
            	? word : '"' + word + '"';
            }

            result += str[i];
			word = '';

        } else {
			word += str[i];
		}

    }

    return JSON.parse(result);
}

export function construct(Cls, args) {
	args = Array.from(args);
    args.unshift(0);
	return new (Function.bind.apply(Cls, args))();
}

export function publish(Input, methods, fields) {
	const list = {};
	const getInstId = idGetter(Input.name + '__');

    function Output() {
        const id = getInstId();
        list[id] = new Input(...arguments);
        this.id = id;
    }

    if (methods && methods.length) {
		methods.forEach((method) => {
			if (!(method in Input.prototype)) {
				console.error(`${Input.name} class have not the "${method}" method!`);
				return;
			}

			Output.prototype[method] = function() {
				const obj = list[this.id];
				return obj[method].apply(obj, arguments);
			}
		});

	} else {
		throw new Error(`The class "${Input.name}" must have at least one public method`);
	}

	if (fields) {
		fields.forEach((field) => {
			Object.defineProperty(Output.prototype, field, {
				configurable: false,
				get: function() {
					return list[this.id][field]
				},
				set: function(value) {
					list[this.id][field] = value;
				}
			});
		});
	}

    return Output;
}

export function getElementData(settings, defaults, element, attributes) {
	const result = {};

    for (const name in defaults) {
        if (settings[name] === undefined) {
            let attr = 'data-' + (attributes[name] || camelCaseToDash(name)), num;

            attr = element ? element.getAttribute(attr) : null;
            num = +attr;

            if (attr === '' || attr === 'true') {
				attr = true;

			} else if (attr === 'false') {
				attr = false;

			} else if (attr !== null && !isNaN(num)) {
				attr = num;
			}

			result[name] = attr !== null ? attr : defaults[name];

		} else {
			result[name] = settings[name];
		}
    }

    return result;
}

export function fetchSettings(settings, restrictions = {}) {
    const { defaults, required, filter = 0, types = 0, rates = 0 } = restrictions;
	const propList = Object.assign({}, required, defaults);
	const result = {};

    for (const propName in propList) {
		const haveProp = settings[propName] !== undefined;

        if (required && propName in required && !haveProp) {
            log.error(`Settings must contain "${propName}" property`);
            return;
        }

        const propValue = haveProp ? settings[propName] : propList[propName];

        if (propValue === null) {
            result[propName] = propValue;
            continue;
        }

        const propFilter = filter[propName];

        if (typeof propFilter == 'function' && !propFilter(propValue)) {
            log.error(`Property "${propName}" is invalid`);
            return;
        }

		const propType = types[propName];

        if (propType !== undefined) {
			const isInstanceOf = propType.prototype ? propValue instanceof propType : false;

			if (!(typeof propValue == propType || isInstanceOf)) {
				log.error(`Property "${propName}" must be of type "${propType.name || propType}"`);
            	return;
			}
        }

        const propRates = rates[propName];

        if (Array.isArray(propRates) && !propRates.includes(propValue)) {
            log.error(`Invalid value "${propValue}" of property "${propName}"`);
            return;
        }

        result[propName] = propValue;
    }

	return result;
}

export function randi(min = 0, max = 9) {
	return Math.floor(min + Math.random() * (max + 1 - min));
}

export function randf(min = 0, max = 1, accuracy) {
    const num = Math.random() * (max - min) + min;
    return accuracy ? parseFloat(num.toFixed(accuracy)) : num;
}

export function randKey(length = 15, types = ['all']) {
	const lower = 'abcdefghijklmnopqrstuvwxyz';
	const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const numbers = '1234567890';
	const specials = "!?@#$%^&*()*-_+=[]{}<>.,;:/'\"\\";

	let chars = '';

	if (types.indexOf('all') != -1 ) {
		chars = lower + upper + numbers + specials;
	} else {
		if (types.indexOf('lower') != -1 ) chars += lower;
		if (types.indexOf('upper') != -1 ) chars += upper;
		if (types.indexOf('numbers') != -1 ) chars += numbers;
		if (types.indexOf('specials') != -1 ) chars += specials;
	}

	const limit = chars.length - 1;
	let result = '';

	for (let i = 1; i < length; i++) {
		let char = chars[random(0, limit)];
		if (char != result[i - 1]) result += char;
	}

	return result;
}

export function camelCaseToDash(str) {
	return str.replace(/[A-Z]/g, s => '-' + s.toLowerCase());
}

export function dashToCamelCase(str) {
	return str.replace(/-\w/g, s => s.toUpperCase().slice(1));
}

export function camelCaseMerge(...list) {
	return list.reduce((res, cur, index) => {
		return res + (index ? cur.charAt(0).toUpperCase() + cur.slice(1) : cur)
	}, '');
}

export function camelCaseToLine(str, up = false) {
	const res = str.replace(/[A-Z]/g, s => '_' + s.toLowerCase());
	return up ? res.toUpperCase() : res;
}

export function trim(str, all) {
	return all ? str.trim().replace(/\s+/g, ' ') : str.trim();
}

export function capitalize(str, each) {
	if (each) {
		return trim(str, true).replace().split(' ').map((w) => capitalize(w)).join(' ');
	}

	let res = trim(str);
	return res.charAt(0).toUpperCase() + res.slice(1);
}

export function zeroPad(num, size) {
	let result = num + '';

    while (result.length < size) {
        result = '0' + result;
	}

    return result;
}

export function formatNumber(value, space = ' ') {
    return String(Math.floor(value)).split('').reverse()
        .reduce((a, c, i, { length }) => {
            const n = i + 1;
            return (n > 1 && n < length && !(n % 3) ? space : '') + c + a;
        }, '');
}

export function accuracy(num) {
    return num.toString().split('.')[1].length;
}

export function vmin(value) {
	const side = Math.min(window.innerWidth, window.innerHeight);
	return value / 100 * side;
}

export function vmax(value) {
	const side = Math.max(window.innerWidth, window.innerHeight);
	return value / 100 * side;
}

export function vw(value) {
	return value / 100 * window.innerWidth;
}

export function vh(value) {
	return value / 100 * window.innerHeight;
}

export function clamp(val, from, to) {
    if (val < from) return from;
	else if (val > to) return to;
	else return val;
}

export function clampOut(val, from, to) {
    let res = val;
    if (Number.isFinite(from) || Number.isFinite(to)) {
        const half = from + ((to - from) / 2);
        if (val >= half && val < to) res = to;
        else if (val < half && val > from) res = from;
    }
    return res;
}

export function clampSide(value, border, flip) {
    const f = flip ? -1 : 1;
    return (f * value) > (f * border) ? border : value;
}

export function clampAngle(val, deg) {
    if (!Number.isFinite(val)) return val;
    const max = deg ? 360 : Math.PI * 2;
    const mod = val % max;
    return mod < 0 ? max + mod : mod;
}

export function mirrAngle(val, deg) {
    if (!Number.isFinite(val)) return val;
    const max = deg ? 360 : Math.PI * 2;
    const mod = val % max;
    const ang = mod < 0 ? max + mod : mod;
    return ang > max / 2 ? ang - max : ang;
}

export function roundBetween(value, begin, end) {
    const mid = begin + (end - begin) / 2;
    return value > mid ? end : begin;
}

export function clampBySteps(value, steps) {
    if (steps.length < 2) return value;

    const last = steps[steps.length - 1];
	const first = steps[0];
	let prev = steps[0];

    for (let i = 1; i < steps.length; i++) {
        const step = steps[i];
        if (step < prev) continue;

        if (value >= prev && value <= step) {
            return roundBetween(value, prev, step);
        }

        prev = steps[i];
    }

    return roundBetween(value, first, last);
}

export function limitCalls(fn, count = 1) {
	let used = 0;
	const res = (...arg) => {
		if (used < count) {
			fn(...arg);
			used++;
		}
	}
	res.resetCalls = () => { used = 0; }
	res.getSource = () => fn;
	return res;
}

export function aggregateCalls(handler, timeInterval = 0) {
	if (handler.isAggregator) return handler;

	const argsList = [];
	let timer = null;

	const aggregator = (...args) => {
		clearTimeout(timer);

		argsList.push(args.length > 1 ? args : args[0]);

		timer = setTimeout(() => {
			handler(argsList.slice());
			argsList.length = 0;
		}, timeInterval);
	};

	aggregator.isAggregator = true;

	return aggregator;
}

export function sleep(time) {
	if (!time) return Promise.resolve();
	return new Promise((resolve) => setTimeout(resolve, time));
}

export function entry(val, from, to) {
    return val >= from && val <= to;
}

export function getProbability(prob) {
	return Math.random() <= prob;
}

export function getProbFromMap(probs) {
    const prob = Math.random();
    let prev = 0;

    for (const [key, value] of probs) {
        const cur = prev + value;

        if (prob >= prev && prob <= cur) {
            return key;
        }

        prev += value;
    }
}

export function makeIterable(context, handler) {
    if (typeof context !== 'object' && typeof handler !== 'function') {
        log.error(`makeIterable must recieve context ${context} of object and handler ${handler} as function`);
        return;
    }

    const product = { value: null, done: false };
    const iterator = {
        next() {
            handler(product, context);
            return product;
        }
    };

    context[Symbol.iterator] = () => iterator;
}

export function getPropByPath(obj, path) {
    if (!Array.isArray(path)) return;

    return path.reduce((a, c) => a[c], obj);
}

export function setPropByPath(obj, srcPath, val) {
    if (!Array.isArray(srcPath)) {
		log.error(`setPropByPath - path ${srcPath} must be an array`);
		return;
	}

    const path = srcPath.slice();
    const propName = path.pop();

    const target = path.reduce((a, c) => a[c], obj);
    if (!target || !target[propName]) return;

    if (typeof val === 'function') {
        target[propName] = val(target[propName]);
    } else {
        target[propName] = val;
    }
}