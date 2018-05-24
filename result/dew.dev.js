/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.printErrors = printErrors;
exports.define = define;
exports.istype = istype;
exports.strconv = strconv;
exports.random = random;
exports.megaFunction = megaFunction;
exports.log = log;
function printErrors(data) {
	var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	var error = "";

	if (Array.isArray(data) && data.length) {
		error += data.title || "Error list";
		if (source) error += " ( " + getSourceLog() + " )";
		error += ":\n";

		data.forEach(function (message) {
			return error += "   - " + message + "\n";
		});
	} else if (typeof data == "string") {
		error += data;
		if (source) error += " ( " + getSourceLog() + " )";
	} else return false;

	console.error(error);

	return false;
}

function getSourceLog() {
	var stack = new Error().stack.split("\n");

	for (var i = 0; i < stack.length; i++) {
		if (stack[i].search(/dew\.(min|dev)\.js|anonymous/g) == -1) {
			var src = stack[i].match(/https?:[^\)]+/g);
			if (src && src[0]) return src[0];
		}
	}return "";
}

function define(obj, fields) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var desc = {
		enumerable: options.enumer != undefined ? options.enumer : false,
		configurable: options.config != undefined ? options.config : true,
		writable: options.write != undefined ? options.write : true
	};

	if (typeof fields == "string") {
		if (options.value) desc.value = options.value;else if (options.get && options.set) {
			desc.get = options.get;
			desc.set = options.set;
			delete desc.writable;
		}

		Object.defineProperty(obj, fields, desc);

		if (options.set && options.value != undefined) obj[fields] = options.value;
	} else for (var key in fields) {
		desc.value = fields[key];
		Object.defineProperty(obj, String(key), desc);
	}
};

function istype(value, type) {
	if (Array.isArray(type)) return type.some(function (t) {
		return istype(value, t) ? true : false;
	});else if (type !== undefined) switch (type) {
		case "number":
			return typeof value == "number" ? true : false;
		case "string":
			return typeof value == "string" ? true : false;
		case "boolean":
			return typeof value == "boolean" ? true : false;
		case "array":
			return Array.isArray(value) ? true : false;
		case "function":
			return typeof value == "function" ? true : false;
		case "DOM":
			return value !== undefined && value.nodeType == 1 ? true : false;
		case "HTMLTools":
			return value.isHTMLTools ? true : false;
		default:
			printErrors('the type "' + type + '" is unknown!');return false;
	} else {
		if (typeof value == "number") return "number";else if (typeof value == "string") return "string";else if (typeof value == "boolean") return "boolean";else if (Array.isArray(value)) return "array";else if (typeof value == "function") return "function";else if (value.nodeType == 1) return "DOM";else if (value.isHTMLTools) return "HTMLTools";else return "object";
	}
}

function strconv(value) {
	if (typeof value == "string") {
		if (+value) return +value;
		if (value == "true" || value == "TRUE") return true;
		if (value == "false" || value == "FALSE") return false;
		if (value.search(/\[.+\]/g) != -1) {
			value = value.replace(/\[|\]/g, "").split(",");
			return value.map(function (val) {
				return strconv(val);
			});
		}
		if (value.search(/\{.+\}/g) != -1) return JSON.parse(value);

		return value.replace(/^\s+|\s+$/g, "");
	} else printErrors('strconv function error : type of argument must be "string"');
}

function random() {
	var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9999999;

	return Math.floor(Math.random() * (max - min)) + min;
}
random.key = function () {
	var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 15;
	var types = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["all"];

	var lower = 'abcdefghijklmnopqrstuvwxyz',
	    upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	    numbers = '1234567890',
	    specials = "!?@#$%^&*()*-_+=[]{}<>.,;:/'\"\\",
	    chars = "";

	if (types.indexOf("all") != -1) chars = lower + upper + numbers + specials;else {
		if (types.indexOf("lower") != -1) chars += lower;
		if (types.indexOf("upper") != -1) chars += upper;
		if (types.indexOf("numbers") != -1) chars += numbers;
		if (types.indexOf("specials") != -1) chars += specials;
	}

	var limit = chars.length - 1,
	    result = "";

	for (var i = 1; i < length; i++) {
		var char = chars[random(0, limit)];
		if (char != result[i - 1]) result += char;
	}

	return result;
};

function megaFunction(fn, name) {
	var shell = function shell(data, order) {
		shell._data = data;

		order ? shell._handlers.forEach(function (handler) {
			return shell._data = handler(shell._data);
		}) : shell._handlers.forEach(function (handler) {
			return handler(data);
		});

		return shell._data;
	};

	shell._handlers = [];
	shell._names = Object.create(null);
	shell._data;
	shell.count = 0;

	shell.push = function (fn, name) {
		if (typeof fn == "function") {
			if (name) shell._names[name] = shell.count;
			shell._handlers.push(fn);
			shell.count++;
		}
	};

	shell.remove = function (id) {
		var index = id,
		    handler;

		if (typeof id == "string") {
			index = shell._names[id];
			delete shell._names[id];
		}

		if (shell._handlers[index]) {
			shell._handlers.splice(index, 1);
			shell.count--;
		}
	};

	shell.evoke = function (id, data) {
		var index = id,
		    handler;

		if (typeof id == "string") index = shell._names[id];

		if (shell._handlers[index]) return shell._handlers[index](data);else printErrors('Dew megaFunction evoke error: undefined function with id "' + id + '"');
	};

	if (fn) shell.push(fn, name);

	return shell;
}

function log() {
	console.log.apply(window, arguments);
}

define(log, "time", {
	get: console.time,
	set: function set() {}
});

define(log, "timeEnd", {
	get: console.timeEnd,
	set: function set() {}
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Async = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functions = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Async = exports.Async = function () {
	function Async() {
		_classCallCheck(this, Async);

		this._async_waiters = [];
		this._async_status = 0;
		this._async_calls = (0, _functions.megaFunction)();
		this._async_fails = (0, _functions.megaFunction)();
		this._async_progress = (0, _functions.megaFunction)();
		this._async_refresh = (0, _functions.megaFunction)();
		this._async_ready = 0;
		this._async_subReady = false;
		this._async_strict = true;
		this._async_data = null;
		this._async_error = null;
	}

	_createClass(Async, [{
		key: "resolve",
		value: function resolve(data) {
			var saveData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (this._canStart) {
				this._async_status = 1;

				if (this._async_ready != 1) this.shift({ ready: 1 });
				if (saveData) this._async_data = data;

				this._async_calls(data);
			}
		}
	}, {
		key: "reject",
		value: function reject(error) {
			if (this._canStart) {
				this._async_status = -1;
				this._async_error = error;
				this._async_fails(error);
			}
		}
	}, {
		key: "then",
		value: function then(fn) {
			this._async_calls.push(fn);

			if (this._async_status == 1) fn(this._async_data);
		}
	}, {
		key: "except",
		value: function except(fn) {
			this._async_fails.push(fn);

			if (this._async_status == -1) fn(this._async_error);
		}
	}, {
		key: "progress",
		value: function progress(fn) {
			this._async_progress.push(fn);
		}
	}, {
		key: "shift",
		value: function shift(data) {
			if (typeof data.ready == "number" || data.ready >= 0 || data.ready <= 1) {
				this._async_ready = data.ready;
				this._async_progress(data);
			}
		}
	}, {
		key: "wait",
		value: function wait(list) {
			var _this = this;

			var progress = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var self = this,
			    count = 0;

			if (Array.isArray(list)) list.forEach(function (item) {
				if (item.isAsync) _this._async_waiters.push(item);
			});else if (list.isAsync) this._async_waiters.push(list);

			if (this._async_waiters.length) this._async_waiters.forEach(function (waiter) {

				waiter.then(function () {
					count++;
					if (count == self._async_waiters.length) {
						self._async_subReady = true;
						self.resolve();
					}
				});

				waiter.except(function () {
					self.reject();
				});

				if (progress) waiter.progress(function () {
					self.shift({ ready: self._calcProgress() });
				});
			});else this.resolve();

			return this;
		}
	}, {
		key: "_calcProgress",
		value: function _calcProgress() {
			var part = 1 / this._async_waiters.length,
			    ready = 0;

			this._async_waiters.forEach(function (waiter) {
				ready += waiter._async_ready * part;
			});

			return ready;
		}
	}, {
		key: "reset",
		value: function reset() {
			this._async_status = 0;
			this._async_ready = 0;
			this._async_subReady = false;
			this._async_data = null;
			this._async_error = null;
		}
	}, {
		key: "onRefresh",
		value: function onRefresh(fn) {
			this._async_refresh.push(fn);
		}
	}, {
		key: "refresh",
		value: function refresh() {
			if (this._async_refresh.count) {
				this.reset();
				this._async_refresh();
			}

			this._async_waiters.forEach(function (waiter) {
				if (waiter.failed) waiter.refresh();
			});
		}
	}, {
		key: "_canStart",
		get: function get() {
			var waited = true;

			if (this._async_strict && this._async_waiters.length && !this._async_subReady) waited = false;

			return this._async_status == 0 && waited ? true : false;
		}
	}, {
		key: "strict",
		set: function set(value) {
			if (typeof value == "bolean") this._async_strict = value;
		},
		get: function get() {
			return this._async_strict;
		}
	}, {
		key: "completed",
		get: function get() {
			return this._async_status == 1 ? true : false;
		}
	}, {
		key: "failed",
		get: function get() {
			return this._async_status == -1 ? true : false;
		}
	}, {
		key: "isAsync",
		get: function get() {
			return true;
		}
	}]);

	return Async;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.array = array;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Methods = function () {
	function Methods(arr) {
		_classCallCheck(this, Methods);

		this.arr = arr;
	}

	_createClass(Methods, [{
		key: "have",
		value: function have(value) {
			var index = this.arr.indexOf(value);
			return index == -1 ? false : { index: index };
		}
	}, {
		key: "copy",
		value: function copy() {
			return this.arr.slice().sort();
		}
	}, {
		key: "subtract",
		value: function subtract(arr) {
			return this.arr.filter(function (item) {
				return arr.indexOf(item) < 0;
			});
		}
	}, {
		key: "difference",
		value: function difference(arr) {
			var _this = this;

			return this.arr.filter(function (item) {
				return arr.indexOf(item) < 0;
			}).concat(arr.filter(function (item) {
				return _this.arr.indexOf(item) < 0;
			}));
		}
	}, {
		key: "compare",
		value: function compare(arr) {
			return this.arr.length == arr.length && this.arr.every(function (item, index) {
				return item === arr[index];
			});
		}
	}, {
		key: "smartSort",
		value: function smartSort() {
			return this.arr.sort(function (prev, next) {

				var result = 0,
				    regClear = /[^\d+\-,\.]/gm;

				prev = prev.replace(",", ".").replace(regClear, "").split("-").map(function (item) {
					return +item;
				});
				next = next.replace(",", ".").replace(regClear, "").split("-").map(function (item) {
					return +item;
				});

				if (prev[0] > next[0]) result = 1;else if (prev[0] < next[0]) result = -1;else if (prev[0] == next[0]) {
					prev = prev.length > 1 ? prev[1] : prev[0];
					next = next.length > 1 ? next[1] : next[0];
					result = prev > next ? 1 : -1;
				}

				return result;
			});
		}
	}, {
		key: "removeValue",
		value: function removeValue(value) {
			var _this2 = this;

			var list = [].concat(value);

			list.forEach(function (item, i) {
				var index = _this2.arr.indexOf(item);
				index != -1 ? _this2.arr.splice(index, 1) : list.splice(i, 1);
			});

			return list;
		}
	}, {
		key: "removeIndex",
		value: function removeIndex(index) {
			var _this3 = this;

			var list = [].concat(index),
			    saved = list.map(function (i) {
				return _this3.arr[i];
			});

			return this.removeValue(saved);
		}
	}]);

	return Methods;
}();

function array(arr) {
	return new Methods(arr);
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.object = object;

var _initObject = __webpack_require__(8);

var _functions = __webpack_require__(0);

var _array = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function join(list, target, method) {
    Array.isArray(list) ? list.forEach(function (item) {
        return method(item, target);
    }) : method(list, target);
}

function defineProperties(from, to) {
    for (var i in from) {
        var desc = Object.getOwnPropertyDescriptor(from, i);
        desc ? Object.defineProperty(to, i, desc) : to[i] = from[i];
    }

    return to;
}

function _clone(object, full) {
    function Copy() {
        for (var field in object) {
            if (object.hasOwnProperty(field)) this[field] = full ? _clone(object[field], true) : object[field];
        }
    }

    if (Array.isArray(object)) return (0, _array.array)(object).copy();else if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) == "object") {
        if ("__proto__" in object) Copy.prototype = object.__proto__;

        return new Copy();
    } else return object;
}

var Methods = function () {
    function Methods(target) {
        _classCallCheck(this, Methods);

        this.target = target;
    }

    _createClass(Methods, [{
        key: 'clone',
        value: function clone(full) {
            return this.target.constructor != Object ? Object.assign(new this.target.constructor(), this.target) : _clone(this.target, full);
        }
    }, {
        key: 'joinLeft',
        value: function joinLeft(list, copy) {
            var target = copy ? Object.assign({}, this.target) : this.target;

            join(list, target, function (item, target) {
                for (var i in item) {
                    i in target && (target[i] = item[i]);
                }
            });

            return target;
        }
    }, {
        key: 'joinRight',
        value: function joinRight(list, copy) {
            var target = copy ? Object.assign({}, this.target) : this.target;

            join(list, target, function (item, target) {
                for (var i in item) {
                    !(i in target) && (target[i] = item[i]);
                }
            });

            return target;
        }
    }, {
        key: 'joinFull',
        value: function joinFull(list, copy) {
            var target = copy ? defineProperties(this.target, {}) : this.target;
            join(list, target, function (item) {
                return defineProperties(item, target);
            });
            return target;
        }
    }, {
        key: 'init',
        value: function init(values, settings) {
            var common = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { errors: true };

            if (!values || !settings) {
                (0, _functions.printErrors)("Dew object.init error: missing required arguments (values or settings)");
                return false;
            }

            var init = new _initObject.InitObject(this.target);

            for (var field in settings) {
                if (_typeof(settings[field]) !== "object") {
                    common.def = settings[field];
                    init.checkout(field, common, values[field]);
                } else init.checkout(field, settings[field], values[field]);
            }

            return init.errors.length ? (common.errors && (0, _functions.printErrors)(init.errors), false) : true;
        }
    }]);

    return Methods;
}();

function object(obj) {
    return new Methods(obj);
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.bind = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functions = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Binder = function () {
	function Binder() {
		_classCallCheck(this, Binder);
	}

	_createClass(Binder, [{
		key: "change",
		value: function change(object, field, trigger) {
			var hidden = "_" + field;
			// object[hidden] = object[field];

			(0, _functions.define)(object, hidden, { value: object[field] });

			(0, _functions.define)(object, field, {
				get: function get() {
					return object[hidden];
				},
				set: function set(value) {
					object[hidden] = value;
					trigger(value);
				},
				config: true,
				enumer: true
			});
		}
	}, {
		key: "context",
		value: function context(fn, _context) {
			return function () {
				return fn.apply(_context, arguments);
			};
		}
	}, {
		key: "fields",
		value: function fields(data) {
			var left = data.left,
			    right = data.right,
			    modifier = data.modifier,
			    trigger = data.trigger;

			switch (data.type) {
				case "left":
					this._attach(left, right, modifier, trigger);break;
				case "right":
					this._attach(right, left, modifier, trigger);break;
				case "cross":
					this._attach(left, right, right.modifier, left.trigger);
					this._attach(right, left, left.modifier, right.trigger);
					break;
			}
		}
	}, {
		key: "unset",
		value: function unset() {}
	}, {
		key: "_attach",
		value: function _attach(current, target, modifier, trigger) {
			this._genGetSet(current.object, current.field, trigger);

			this._addJoint(current.object, current.field, {
				object: target.object,
				field: target.field,
				modifier: modifier
			});
		}
	}, {
		key: "_genGetSet",
		value: function _genGetSet(object, field, trigger) {
			var self = this,
			    hidden = "_" + field;

			if (!(hidden in object)) {
				object[hidden] = {
					joints: [],
					value: object[field],
					trigger: trigger
				};

				(0, _functions.define)(object, field, {
					get: function get() {
						return object[hidden].value;
					},
					set: function set(value) {
						self._setData(object, field, value);
					},
					config: true,
					enumer: true
				});
			}
		}
	}, {
		key: "_addJoint",
		value: function _addJoint(object, field, joint) {
			object["_" + field].joints.push(joint);
			this._applyValue(joint.object, joint.field, object["_" + field].value, joint.modifier);
		}
	}, {
		key: "_removeJoint",
		value: function _removeJoint() {}
	}, {
		key: "_applyValue",
		value: function _applyValue(object, field, value, modifier) {
			var hidden = "_" + field;

			if (modifier) value = modifier(value);

			if (hidden in object) object[hidden].value = value;else object[field] = value;
		}
	}, {
		key: "_setData",
		value: function _setData(object, field, data) {
			var sourseValue = data.value || data,
			    binded = object["_" + field];
			binded.value = sourseValue;

			if (!data.value && binded.trigger) binded.trigger(sourseValue, field);

			binded.joints.forEach(function (joint) {

				var value = joint.modifier ? joint.modifier(sourseValue) : sourseValue;

				if (joint.object == data.object && joint.field == data.field) return;else if ("_" + joint.field in joint.object) joint.object[joint.field] = {
					value: value,
					object: object,
					field: field
				};else joint.object[joint.field] = value;
			});
		}
	}]);

	return Binder;
}();

var bind = new Binder();

exports.bind = bind;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HTMLTools = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonConverter = __webpack_require__(14);

var _transform = __webpack_require__(15);

var _async = __webpack_require__(1);

var _functions = __webpack_require__(0);

var _array = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import {Animation}     from './animation';

var jsonConverter = new _jsonConverter.JsonConverter(),
    insertMethods = {
    before: function before(element, current) {
        if (current.parentNode) current.parentNode.insertBefore(element, current);
    },
    after: function after(element, current) {
        if (current.parentNode) current.parentNode.insertBefore(element, current.nextSibling);
    },
    append: function append(element, current) {
        current.appendChild(element, current);
    },
    prepend: function prepend(element, current) {
        current.insertBefore(element, current.childNodes[0]);
    }
};

var HTMLTools = exports.HTMLTools = function (_Async) {
    _inherits(HTMLTools, _Async);

    function HTMLTools(elements) {
        _classCallCheck(this, HTMLTools);

        var _this = _possibleConstructorReturn(this, (HTMLTools.__proto__ || Object.getPrototypeOf(HTMLTools)).call(this));

        _this.elements = [];
        _this.length = 0;
        _this._id = (0, _functions.random)();
        _this._query = '';

        _this.addElements(elements);
        return _this;
    }

    _createClass(HTMLTools, [{
        key: 'addElements',
        value: function addElements(elements) {
            if (!Array.isArray(elements) && elements.length) for (var i = 0; i < elements.length; i++) {
                this.elements.push(elements[i]);
            } else this.elements = this.elements.concat(elements);

            this.length = this.elements.length;
        }
    }, {
        key: 'ready',
        value: function ready() {
            var fn,
                sub,
                list = this.elements;

            arguments.length == 1 ? fn = arguments[0] : (sub = arguments[0], fn = arguments[1]);

            if (sub) {
                sub = this.select("img, link, script, iframe");
                list = list.concat(sub.elements);
            }

            this.then(fn);
            this._observReady(list);

            return this;
        }
    }, {
        key: '_observReady',
        value: function _observReady(list) {
            var self = this,
                checkout = function checkout() {
                list._countReady++;
                if (list._countReady == list.length) self.resolve();
            };

            list._countReady = 0;

            list.forEach(function (element) {

                var tag = element.tagName.toLowerCase(),
                    complete = true;

                if (tag == "img") complete = element.complete;else if (tag == "link" || tag == "iframe") complete = false;

                complete ? checkout() : element.addEventListener("load", checkout);
            });
        }
    }, {
        key: 'mutation',
        value: function mutation(fn, options) {
            var _this2 = this;

            if ("MutationObserver" in window && !element._observer) {
                this.mutations = [];
                this.elements.forEach(function (element) {
                    return _this2._observMutation(element, fn, options);
                });
            }
        }
    }, {
        key: '_observMutation',
        value: function _observMutation(element, fn, options) {
            var mutation = new MutationObserver(function (mutations) {
                fn(mutations);
            });

            mutation.observe(element, options);

            this.mutations.push(mutation);
        }
    }, {
        key: 'visible',
        value: function visible() {
            var maxDepth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

            var found = this._findHidden(this.elements[0], maxDepth, 0);
            return found ? { element: found } : {};
        }
    }, {
        key: '_findHidden',
        value: function _findHidden(element, maxDepth, depth) {
            if (depth >= maxDepth) return false;

            var result = false,
                parent = element.parentElement || element.parentNode || null;

            if (parent && parent != document) result = !this.display(parent) ? parent : this._findHidden(parent, maxDepth, ++depth);

            return result;
        }
    }, {
        key: 'display',
        value: function display(element) {
            var display;

            if (!element) element = this.elements[0];

            element.style.display ? display = element.style.display : display = getComputedStyle(element).display;

            return display == "none" ? false : true;
        }
    }, {
        key: 'select',
        value: function select(query) {
            var elements = [],
                result;

            this.elements.forEach(function (element) {
                var search = element.querySelectorAll(query);
                elements = elements.concat(Array.from(search));
            });

            result = new HTMLTools(elements);
            result._query = query;

            return result;
        }
    }, {
        key: 'before',
        value: function before(htl) {
            var rm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            return this._insert(htl, rm, insertMethods["before"]);
        }
    }, {
        key: 'after',
        value: function after(htl) {
            var rm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            return this._insert(htl, rm, insertMethods["after"]);
        }
    }, {
        key: 'append',
        value: function append(htl) {
            var rm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            return this._insert(htl, rm, insertMethods["append"]);
        }
    }, {
        key: 'appendTo',
        value: function appendTo(target) {
            var rm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            target.append(this, rm);
            return this;
        }
    }, {
        key: 'prepend',
        value: function prepend(htl) {
            var rm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            return this._insert(htl, rm, insertMethods["prepend"]);
        }
    }, {
        key: '_insert',
        value: function _insert(htl, rm, method) {
            var self = this,
                result = [];

            htl = $html.convert(htl);

            if (htl) {
                this.elements.forEach(function (element) {
                    var clones = [];
                    htl.elements.forEach(function (insertElement) {
                        var clone = insertElement.cloneNode(true);
                        clones.push(clone);
                        method(clone, element);
                    });
                    result = result.concat(clones);
                });

                if (rm) htl.remove();

                htl.addElements(result);

                return htl;
            } else return false;
        }
    }, {
        key: 'jsonBefore',
        value: function jsonBefore(json) {
            return this._insertJson(json, insertMethods["before"]);
        }
    }, {
        key: 'jsonAfter',
        value: function jsonAfter(json) {
            return this._insertJson(json, insertMethods["after"]);
        }
    }, {
        key: 'jsonPrepend',
        value: function jsonPrepend(json) {
            return this._insertJson(json, insertMethods["prepend"]);
        }
    }, {
        key: 'jsonAppend',
        value: function jsonAppend(json) {
            return this._insertJson(json, insertMethods["append"]);
        }
    }, {
        key: 'jsonGet',
        value: function jsonGet(element) {
            var result = [];

            if (element) result = jsonConverter.getFromHTML(element);else if (this.elements.length) this.elements.length == 1 ? result = jsonConverter.getFromHTML(this.elements[0]) : this.elements.forEach(function (element) {
                return result.push(jsonConverter.getFromHTML(element));
            });else result = false;

            return result;
        }
    }, {
        key: '_insertJson',
        value: function _insertJson(json, method) {
            var clones = [];

            jsonConverter.toHTML(json);

            this.elements.forEach(function (current) {
                var element = jsonConverter.build(json);
                clones.push(element);
                method(element, current);
            });

            return new HTMLTools(clones);
        }
    }, {
        key: 'tplAppend',
        value: function tplAppend(tpl) {
            return tpl.isTemplate ? tpl.appendTo(this) : false;
        }
    }, {
        key: 'addClass',
        value: function addClass(name) {
            this.elements.forEach(function (element) {
                return element.classList.add(name);
            });
            return this;
        }
    }, {
        key: 'removeClass',
        value: function removeClass(name) {
            this.elements.forEach(function (element) {
                return element.classList.remove(name);
            });
            return this;
        }
    }, {
        key: 'html',
        value: function html(str) {
            var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (str !== undefined) this.elements.forEach(function (element) {
                clear ? element.innerHTML = str : element.innerHTML += str;
            });else return this.elements[0].innerHTML;

            return this;
        }
    }, {
        key: 'text',
        value: function text(str) {
            if (str !== undefined) this.elements.forEach(function (element) {
                return element.innerText = str;
            });else return this.elements[0].innerText;

            return this;
        }
    }, {
        key: 'value',
        value: function value(data) {
            if (data !== undefined) this.elements.forEach(function (element) {
                return element.value = data;
            });else return this.elements[0].value;

            return this;
        }
    }, {
        key: 'active',
        value: function active(yes) {
            yes ? this.addClass("active") : this.removeClass("active");

            return this;
        }
    }, {
        key: 'checked',
        value: function checked(yes) {
            if (typeof yes == "boolean") this.elements.forEach(function (element) {
                if ("checked" in element) element.checked = yes;
            });else if (yes == undefined) return this.elements[0].checked;

            return this;
        }
    }, {
        key: 'toogle',
        value: function toogle() {
            this.elements.forEach(function (element) {
                if ("checked" in element) element.checked = element.checked ? false : true;
            });

            return this;
        }
    }, {
        key: 'choose',
        value: function choose(index) {
            this.elements.forEach(function (element) {
                if ("selectedIndex" in element) element.selectedIndex = index;
            });

            return this;
        }
    }, {
        key: 'width',
        value: function width(value) {
            var units = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "px";

            if (typeof value == "number") this.elements.forEach(function (element) {
                return element.style.width = value + units;
            });else return this.elements[0].offsetWidth;

            return this;
        }
    }, {
        key: 'height',
        value: function height(value) {
            var units = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "px";

            if (typeof value == "number") this.elements.forEach(function (element) {
                return element.style.height = value + units;
            });else return this.elements[0].offsetHeight;

            return this;
        }
    }, {
        key: 'offsetParent',
        value: function offsetParent() {
            var element = this.elements[0];
            return {
                top: element.offsetTop,
                left: element.offsetLeft
            };
        }
    }, {
        key: 'offsetWindow',
        value: function offsetWindow() {
            var offset = this.elements[0].getBoundingClientRect();

            return {
                top: offset.top,
                left: offset.left,
                right: offset.right,
                bottom: offset.bottom
            };
        }
    }, {
        key: 'offsetScroll',
        value: function offsetScroll() {
            var element = this.elements[0];
            return {
                top: element.scrollTop,
                left: element.scrollLeft
            };
        }
    }, {
        key: 'scroll',
        value: function scroll() {}
    }, {
        key: 'wrap',
        value: function wrap(classList) {
            if (typeof classList == "string") {
                var wrapper = $html.create("div", classList);

                this.after(wrapper);
                wrapper.append(this);

                return wrapper;
            } else if (Array.isArray(classList)) {
                var wrapper = $html.create("div", classList[0]),
                    inside = "";

                for (var i = 1; i < classList.length; i++) {
                    inside += '<div class="' + classList[i] + '">';
                }for (var i = 1; i < classList.length; i++) {
                    inside += '</div>';
                }wrapper.html(inside);
                this.after(wrapper);
                wrapper.select("." + classList[classList.length - 1]).append(this);

                return wrapper;
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.css({ display: "none" });
            return this;
        }
    }, {
        key: 'show',
        value: function show() {
            this.css({ display: "block" });
            return this;
        }
    }, {
        key: 'parent',
        value: function parent() {
            var _this3 = this;

            var parents = [];
            this.elements.forEach(function (element) {
                return parents.push(_this3._getParent(element));
            });
            return new HTMLTools(parents);
        }
    }, {
        key: '_getParent',
        value: function _getParent(element) {
            var parent = element.parentElement || element.parentNode || null;
            return parent;
        }
    }, {
        key: 'transform',
        value: function transform(data) {
            var transform = new _transform.Transform(this);
            transform.apply(data);

            return transform;
        }
    }, {
        key: 'getAttr',
        value: function getAttr(name) {
            var element = this.elements[0],
                result;

            if (element !== undefined && element.nodeType == 1 && element.attributes.length) {
                result = {};

                if (name) {
                    if (Array.isArray(name)) name.forEach(function (item) {
                        var value = element.getAttribute(item);
                        if (value) result[item] = value;
                    });else if (typeof name == "string") result = element.getAttribute(name);
                } else [].forEach.call(element.attributes, function (attr) {
                    return result[attr.name] = attr.value;
                });
            }

            return result;
        }
    }, {
        key: 'setAttr',
        value: function setAttr(attrs, value) {
            typeof attrs == "string" && value !== undefined ? this.elements.forEach(function (element) {
                return element.setAttribute(attrs, value);
            }) : this.elements.forEach(function (element) {
                for (var i in attrs) {
                    element.setAttribute(i, attrs[i]);
                }
            });

            return this;
        }
    }, {
        key: 'unsetAttr',
        value: function unsetAttr(name) {
            if (typeof name == "string") this.elements.forEach(function (element) {
                return element.removeAttribute(name);
            });else if (Array.isArray(name)) this.elements.forEach(function (element) {
                return name.forEach(function (attr) {
                    return element.removeAttribute(attr);
                });
            });else if (name == undefined) {
                var list = this.getAttr();
                if (list) this.elements.forEach(function (element) {
                    for (var i in list) {
                        element.removeAttribute(i);
                    }
                });
            }

            return this;
        }
    }, {
        key: 'css',
        value: function css(styles) {
            if (typeof styles == "string") return this.elements[0].style[styles];else this.elements.forEach(function (element) {
                for (var name in styles) {
                    element.style[name] = styles[name];
                }
            });

            return this;
        }
    }, {
        key: 'eventAttach',
        value: function eventAttach(data, fn) {
            if (!$html._eventList[this._id]) $html._eventList[this._id] = {};

            var list = $html._eventList[this._id];

            if (typeof data == "string" && fn !== undefined) this._eventAttach(list, data, fn);else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) == "object") for (var event in data) {
                this._eventAttach(list, event, data[event]);
            }return this;
        }
    }, {
        key: 'eventDispatch',
        value: function eventDispatch(type) {
            var event = new Event(type);
            this.elements.forEach(function (element) {
                return element.dispatchEvent(event);
            });

            return this;
        }
    }, {
        key: 'eventStart',
        value: function eventStart(type) {
            $html._eventFunction(this._id, type);
            return this;
        }
    }, {
        key: 'eventDetach',
        value: function eventDetach(name) {
            var list = $html._eventList[this._id];

            if (name) for (var event in list) {
                this.elements.unsetAttr(event.substr(0, 2));
            } else $html._eventList[this._id][name] = undefined;

            return this;
        }
    }, {
        key: '_eventAttach',
        value: function _eventAttach(list, name, fn) {
            var evAttr = {};

            list[name] ? list[name].push(fn) : list[name] = (0, _functions.megaFunction)(fn);

            evAttr["on" + name] = "$html._eventFunction(" + this._id + ", '" + name + "', event)";

            this.setAttr(evAttr);
        }
    }, {
        key: 'each',
        value: function each(fn) {
            this.elements.forEach(function (element, index, array) {
                return fn($html.convert(element), index, array);
            });

            return this;
        }
    }, {
        key: 'clone',
        value: function clone() {
            var clones = [];

            this.elements.forEach(function (element) {
                return clones.push(element.cloneNode(true));
            });

            return new HTMLTools(clones);
        }
    }, {
        key: 'merge',
        value: function merge(htl) {
            this.elements = this.elements.concat(htl.elements);
            return this;
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.html("");
        }
    }, {
        key: 'remove',
        value: function remove() {
            var _this4 = this;

            this.elements.forEach(function (element, index) {
                if (element.parentNode) element.parentNode.removeChild(element);

                (0, _array.array)(_this4.elements).removeIndex(index);
            });
        }
    }, {
        key: 'tag',
        get: function get() {
            return this.elements[0].tagName.toLowerCase();
        }
    }, {
        key: 'isHTMLTools',
        get: function get() {
            return true;
        }
    }, {
        key: 'index',
        get: function get() {
            return this.elements[0].selectedIndex;
        }
    }]);

    return HTMLTools;
}(_async.Async);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(7);

var _functions = __webpack_require__(0);

var func = _interopRequireWildcard(_functions);

var _array = __webpack_require__(2);

var _object = __webpack_require__(3);

var _template = __webpack_require__(9);

var _binder = __webpack_require__(4);

var _async = __webpack_require__(1);

var _timer = __webpack_require__(10);

var _http = __webpack_require__(11);

var _url = __webpack_require__(12);

var _html = __webpack_require__(13);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Dew = {
	megaFunction: func.megaFunction,
	define: func.define,
	istype: func.istype,
	strconv: func.strconv,
	random: func.random,

	object: _object.object,
	array: _array.array,

	Template: _template.Template,
	Async: _async.Async,
	Timer: _timer.Timer,

	bind: _binder.bind,
	http: new _http.HTTP(),
	url: new _url.URLmanager()
};

func.define(window, "log", {
	value: func.log,
	config: false,
	write: false
});

func.define(window, {
	Dew: Dew,
	$html: _html.$html
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!("assign" in Object)) Object.defineProperty(Object, "assign", {

	enumerable: false,
	configurable: true,
	writable: true,

	value: function value(target /*, ...sources */) {
		if (target === undefined || target === null) throw new TypeError('Object.assign: cannot convert undefined or null to object');

		for (var arg = 1; arg < arguments.length; arg++) {
			var source = arguments[arg];

			if (source === undefined || source === null) continue;else source = Object(source);

			for (var key in source) {
				target[key] = source[key];
			}
		}

		return target;
	}
});

if (!("from" in Array)) Object.defineProperty(Array, "from", {

	enumerable: false,
	configurable: true,
	writable: true,

	value: function () {

		function getLength(obj) {
			var length = 0;

			if ("length" in obj) {
				length = parseInt(obj.length);
				if (isNaN(length) || length < 0) length = 0;
			}

			return length;
		}

		function getValue(mapFn, target, key) {
			if (mapFn) {
				if (thisArg !== undefined) return mapFn.call(thisArg, target[key], key);else return mapFn(target[key], key);
			} else return target[key];
		}

		return function (target /*, mapFn, thisArg */) {
			if (target === null || target === undefined) throw new TypeError("Array.from: cannot convert first argument to object");

			target = Object(target);

			var result = [],
			    length = getLength(target),
			    mapFn = arguments[1],
			    thisArg = arguments[2];

			if (!Array.isArray(target)) for (var key = 0; key < length; key++) {
				var desc = Object.getOwnPropertyDescriptor(target, key);

				if (desc !== undefined && desc.enumerable) result.push(getValue(mapFn, target, key));else result.push(undefined);
			} else result = target;

			return result;
		};
	}()
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.InitObject = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functions = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InitObject = exports.InitObject = function () {
	function InitObject(object) {
		_classCallCheck(this, InitObject);

		this._object = object;
		this.errors = [];
		this.errors.title = 'Dew object init error at "' + object.constructor.name + '" constructor';
	}

	_createClass(InitObject, [{
		key: 'checkout',
		value: function checkout(field, settings, value) {
			var result = this._validate(field, settings, value);

			if (result !== undefined) this._setValue(field, settings, result);
		}
	}, {
		key: '_setValue',
		value: function _setValue(field, settings, value) {
			var object = settings.root ? settings.root : this._object;

			if (settings.desc) Object.defineProperty(object, String(field), {
				writable: settings.desc.write !== undefined ? settings.desc.write : true,
				enumerable: settings.desc.enumer !== undefined ? settings.desc.enumer : true,
				configurable: settings.desc.config !== undefined ? settings.desc.config : true,
				value: value
			});else object[field] = value;
		}
	}, {
		key: '_validate',
		value: function _validate(field, settings, value) {
			if (settings.attr) value = this._getAttrValue(field, settings.attr, value);

			if (value === undefined) {
				if (settings.required) this.errors.push('empty required option "' + field + '"');else if (settings.def) value = settings.def;
			} else {
				if (settings.type && !(0, _functions.istype)(value, settings.type)) {
					this.errors.push('value of "' + field + '" option must be a "' + settings.type + '" type');
					value = undefined;
				}

				if (settings.filter) value = settings.filter(value);
			}

			return value;
		}
	}, {
		key: '_getAttrValue',
		value: function _getAttrValue(field, settings, value) {
			if (settings.element) {
				if (!settings.prefix) settings.prefix = "data-";

				var attr = $html.convert(settings.element).getAttr(settings.prefix + field);

				if (settings.only) !attr ? (value = undefined, this.errors.push('empty required attribute of option "' + field + '"')) : value = (0, _functions.strconv)(attr);else if (value == undefined && attr) value = (0, _functions.strconv)(attr);
			} else this.errors.push('setting "attr" of option "' + field + '" must have element');

			return value;
		}
	}]);

	return InitObject;
}();

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Template = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functions = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Template = exports.Template = function () {
    function Template(str, name) {
        _classCallCheck(this, Template);

        this._htl = null;
        this._render = function () {};
        this._create(str, name);
    }

    _createClass(Template, [{
        key: 'appendTo',
        value: function appendTo(htl) {
            this._htl = $html.convert(htl);
            return this;
        }
    }, {
        key: 'draw',
        value: function draw(data) {
            try {
                this._htl ? this._htl.html(this._render(data)) : (0, _functions.printErrors)('Dew template error: "it must be append to DOM before drawing"');
            } catch (e) {
                (0, _functions.printErrors)('Dew template error: "' + e.message + '"');
            }
        }
    }, {
        key: '_create',
        value: function _create(str, args) {
            var fn = "var ",
                tokens = str.replace(/\<&/g, "<&#").split(/\<&|&\>/gi);

            if (Array.isArray(args)) args.forEach(function (arg) {
                return fn += arg + "=data." + arg + ",";
            });

            fn += "echo=function(s){_r+=s},_r='';", tokens.forEach(function (token) {
                token[0] == "#" ? fn += token.slice(1).replace(/:=/g, "_r+=") + ";\n" : fn += "_r+=`" + token + "`;";
            });
            fn += " return _r";

            try {
                this._render = new Function("data", fn);
            } catch (e) {
                (0, _functions.printErrors)('Dew template error: "' + e.message + '"');
                this._render = function () {};
            }
        }
    }, {
        key: 'isTemplate',
        get: function get() {
            return true;
        }
    }]);

    return Template;
}();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Timer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functions = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Timer = exports.Timer = function () {
	function Timer(options) {
		_classCallCheck(this, Timer);

		this._stop = true;

		if (!options) options = {};

		this.count = options.count || 0;
		this.duration = options.duration || 0;
		this.delay = options.delay || 0;
		this.step = options.step || 0;

		this.onTick = (0, _functions.megaFunction)(options.onTick);
		this.onStart = (0, _functions.megaFunction)(options.onStart);
		this.onStop = (0, _functions.megaFunction)(options.onStop);

		this._state = {
			timePassed: 0,
			startTime: 0,
			iteration: 0
		};

		this._init();
	}

	_createClass(Timer, [{
		key: '_init',
		value: function _init() {
			if (this.step) {
				if (!this.count) this.count = Math.round(this.duration / this.step);

				this.duration = null;
			}

			if (this.count) this.count--;

			this._tick = $bind.context(this._tick, this);
			this._stepTick = $bind.context(this._stepTick, this);
		}
	}, {
		key: '_common',
		value: function _common(time) {
			this._state.timePassed = time - this._state.startTime;

			if (this.count && this._state.iteration++ >= this.count) this._stop = true;
		}
	}, {
		key: '_stepTick',
		value: function _stepTick(time) {
			var self = this;

			this._common(time);

			this.onTick(this._state.timePassed);

			if (!this._stop) setTimeout(function () {
				self._stepTick(performance.now());
			}, this.step);else this.stop();
		}
	}, {
		key: '_tick',
		value: function _tick(time) {
			var state = this._state;

			this._common(time);

			if (this.duration && state.timePassed >= this.duration) this._stop = true;

			this.onTick(state.timePassed);

			if (!this._stop) requestAnimationFrame(this._tick);else this.stop();
		}
	}, {
		key: 'start',
		value: function start() {
			var self = this;

			this._stop = false;

			if (self.delay) setTimeout(function () {
				self._startTimer();
			}, self.delay);else self._startTimer();
		}
	}, {
		key: '_startTimer',
		value: function _startTimer() {
			var tick,
			    state = this._state;

			state.startTime = performance.now();
			state.timePassed = 0;

			if (this.onStart.count) this.onStart();

			if (this.step) tick = this._stepTick;else tick = this._tick;

			tick(state.startTime);
		}
	}, {
		key: 'reset',
		value: function reset() {
			this._state = {
				timePassed: 0,
				startTime: 0,
				iteration: 0
			};
		}
	}, {
		key: 'stop',
		value: function stop() {
			if (this.onStop.count) this.onStop();
			this._stop = true;
		}
	}, {
		key: 'state',
		get: function get() {
			return this._state;
		}
	}, {
		key: 'on',
		get: function get() {
			var self = this;
			return {
				tick: function tick(fn) {
					self.onTick.push(fn);
				},
				start: function start(fn) {
					self.onStart.push(fn);
				},
				stop: function stop(fn) {
					self.onStop.push(fn);
				}
			};
		}
	}]);

	return Timer;
}();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HTTP = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _async = __webpack_require__(1);

var _functions = __webpack_require__(0);

var _object = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HTTP = exports.HTTP = function () {
	function HTTP() {
		_classCallCheck(this, HTTP);

		this.XHR = "onload" in new XMLHttpRequest() ? XMLHttpRequest : XDomainRequest;
	}

	_createClass(HTTP, [{
		key: 'get',
		value: function get(path) {
			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var self = this,
			    data = options.data,
			    result = new _async.Async(),
			    request = new this.XHR();

			(0, _object.object)(options).joinRight({
				uncache: true,
				progress: false,
				saveData: false
			});

			if (options.uncache) !data ? data = { с: Math.random() } : data.с = Math.random();

			request.open("GET", path + this.serialize(data), true);
			request.send();

			request.onload = function () {
				result.resolve(this.responseText, options.saveData);
			};

			request.onerror = function () {
				result.reject(this.statusText);
				(0, _functions.printErrors)("http.send ajax error (" + this.status + "): " + this.statusText);
			};

			if (options.progress) request.onprogress = function (e) {
				result.shift({
					loaded: e.loaded,
					total: e.total,
					ready: e.loaded / e.total
				});
			};

			return result;
		}
	}, {
		key: 'serialize',
		value: function serialize(data) {
			var request = "?";

			for (var i in data) {
				if (typeof data[i] == "number" || typeof data[i] == "string" || typeof data[i] == "boolean") request += i + "=" + data[i] + "&";
			}return request.slice(0, -1);
		}
	}, {
		key: 'post',
		value: function post(data) {
			var self = this,
			    formData;

			if (data) {
				formData = new FormData();
				for (var key in data) {
					formData.append(key, data[key]);
				}
			} else (0, _functions.printErrors)("http.post must have some data!");

			return {
				to: function to(path, options) {
					if (path) {
						var async = new _async.Async(),
						    request = new self.XHR();
						request.open("POST", path, true);
						request.send(formData);

						request.onload = function () {
							async.resolve(this.responseText);
						};

						request.onerror = function () {
							async.reject(this.statusText);
							(0, _functions.printErrors)("$http.send ajax error (" + this.status + "): " + this.statusText);
						};

						if (options.progress) request.onprogress = function (e) {
							async.shift({
								loaded: e.loaded,
								total: e.total,
								ready: e.loaded / e.total
							});
						};

						return async;
					} else (0, _functions.printErrors)("http.post must have some path!");
				}
			};
		}
	}]);

	return HTTP;
}();

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URLmanager = exports.URLmanager = function () {
	function URLmanager() {
		_classCallCheck(this, URLmanager);

		this.params = this._getSearchParams();
		this.search = location.search;
		this.path = location.pathname;
	}

	_createClass(URLmanager, [{
		key: "getParams",
		value: function getParams(name) {
			var _this = this;

			if (name === undefined) return this.params;else if (typeof name == "string") return this.params[name];else if (Array.isArray(name)) {
				var result = {};

				this.name.forEach(function (p) {
					if (p in _this.params) result[p] = _this.params[p];
				});

				return result;
			}
		}
	}, {
		key: "setParams",
		value: function setParams(params) {
			var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (clear) this.clear();

			for (var i in params) {
				this.params[i] = params[i];
			}history.pushState({ foo: "bar" }, "page", this.path + this.serialize(this.params));

			return this;
		}
	}, {
		key: "clear",
		value: function clear() {
			this.params = {};
			return this;
		}
	}, {
		key: "go",
		value: function go(path) {
			if (!path) path = location.pathname;
			location.href = path + this.serialize(this.params);
		}
	}, {
		key: "_getSearchParams",
		value: function _getSearchParams() {
			var request = location.search,
			    result = {};

			if (request) {
				request = request.replace("?", "").split("&");
				request.forEach(function (p) {
					var p = p.split("=");
					result[p[0].replace("-", "_")] = p[1];
				});
			}

			return result;
		}
	}, {
		key: "serialize",
		value: function serialize(data) {
			var request = "?";

			for (var i in data) {
				if (typeof data[i] == "number" || typeof data[i] == "string" || typeof data[i] == "boolean") request += i + "=" + data[i] + "&";
			}

			return request.slice(0, -1);
		}
	}]);

	return URLmanager;
}();

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.$html = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _htmlTools = __webpack_require__(5);

var _stylesheet = __webpack_require__(16);

var _async = __webpack_require__(1);

var _functions = __webpack_require__(0);

var proto = _htmlTools.HTMLTools.prototype,
    $html = new _htmlTools.HTMLTools(document);

$html._eventList = {};

$html._eventFunction = function (id, type, e) {
    this._eventList[id][type](e);
};

$html.extend = function (name, method) {
    proto[name] = method;
    return $html;
};

$html.ready = function (fn) {
    this.then(fn);
    return $html;
};

$html.script = function (source) {
    var add = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var script = document.createElement("script"),
        $script = new _htmlTools.HTMLTools(script);
    $script.ready = function (fn) {
        $script.then(fn);
        return $script;
    };

    script.src = source;
    script.onload = function () {
        $script.resolve();
    };

    if (add) document.body.appendChild(script);else $script.eventAttach("load", function () {
        $script.resolve();
    });

    return $script;
};

$html.create = function (tag, attr, css) {
    var htls = new _htmlTools.HTMLTools(document.createElement(tag));

    if (typeof attr == "string") htls.addClass(attr);else if ((typeof attr === 'undefined' ? 'undefined' : _typeof(attr)) == "object") htls.setAttr(attr);

    if (css) htls.css(css);

    return htls;
};

$html.convert = function (elements) {
    if (elements.nodeType == 1 || elements.nodeType == 9) return new _htmlTools.HTMLTools(elements);else if (typeof elements == "string") return $html.select(elements);else if (elements.isHTMLTools) return elements;else return false;
};

$html.parseXML = function (data) {
    var parse,
        errors = '';

    if (typeof window.DOMParser != "undefined") parse = function parse(str) {
        return new window.DOMParser().parseFromString(str, "text/xml");
    };else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) parse = function parse(str) {
        var xml = new window.ActiveXObject("Microsoft.XMLDOM");
        xml.async = "false";
        xml.loadXML(str);
        return xml;
    };else errors += 'Error in parseXML: not supported by this browser!';

    return !errors ? parse(data) : (0, _functions.printErrors)(errors);
};

$html.cascad = function () {
    return new _stylesheet.StyleSheet();
};

document.addEventListener("DOMContentLoaded", function (e) {
    $html.body = new _htmlTools.HTMLTools(document.body);
    $html.resolve();
    // $html.wait($html._scripts).then($html.resolve);
});

exports.$html = $html;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.JsonConverter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _htmlTools = __webpack_require__(5);

var _binder = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JsonConverter = exports.JsonConverter = function () {
    function JsonConverter() {
        _classCallCheck(this, JsonConverter);
    }

    _createClass(JsonConverter, [{
        key: 'toHTML',
        value: function toHTML(json) {
            var _this = this;

            if (!json._htl) {
                var element, htl;

                if (!json.tag) json.tag = "div";

                element = document.createElement(json.tag);
                htl = new _htmlTools.HTMLTools(element);

                json._defaults = {};

                for (var item in json) {
                    switch (item) {
                        case "text":
                            htl.text(json.text);break;
                        case "html":
                            htl.html(json.html);break;
                        case "value":
                            htl.value(json.value);break;
                        case "checked":
                            htl.checked(json.checked);break;
                        case "attrs":
                            htl.setAttr(json.attrs);break;
                        case "css":
                            htl.css(json.css);break;
                        case "transform":
                            htl.transform(json.transform);break;
                        case "nodes":
                            if (!Array.isArray(json.nodes)) json.nodes = [json.nodes];
                            json.nodes.forEach(function (node) {
                                return _this.toHTML(node);
                            });
                            break;
                    }
                }

                if (json.content && json.template) {
                    json._defaults.content = JSON.parse(JSON.stringify(json.content));
                    htl.html(this._getTemplate(json));
                }

                json._element = element;
                json._htl = htl;

                this._bind(json);

                if (json.events) htl.eventAttach(json.events);

                json._htl.elements = [];
            }
        }
    }, {
        key: 'build',
        value: function build(json) {
            var _this2 = this;

            var current = json._element.cloneNode(true);

            if (json.nodes && !json.template) {
                if (Array.isArray(json.nodes)) json.nodes.forEach(function (node) {
                    return current.appendChild(_this2.build(node));
                });else current.appendChild(this.build(json.nodes));
            }

            json._htl.addElements(current);

            return current;
        }
    }, {
        key: '_getTemplate',
        value: function _getTemplate(json) {
            var template = json.template,
                defaults = json._defaults.content,
                tokens = this._splitTokens(template);

            for (var field in json.content) {
                if (json.content[field] == "") json.content[field] = defaults[field];
            }tokens.forEach(function (token) {
                if (token in json.content) template = template.replace("{" + token + "}", json.content[token]);else if (token.search(/node\[\d+\]/g) != -1) {
                    token = token.replace(/[^0-9]/g, "");
                    template = token in json.nodes ? template.replace("{node[" + token + "]}", json.nodes[token]._element.outerHTML) : template.replace("{node[" + token + "]}", '<span style="color:red">{undefined node index: "' + token + '"}</span>');
                } else template = template.replace("{" + token + "}", '<span style="color:red">{unknown token: "' + token + '"}</span>');
            });

            return template;
        }
    }, {
        key: '_splitTokens',
        value: function _splitTokens(str) {
            var tokens = [],
                list = str.replace(/\{/g, "{#").split(/\{|\}/gi);
            list.forEach(function (token) {
                if (token[0] == "#") tokens.push(token.slice(1));
            });

            return tokens;
        }
    }, {
        key: '_bind',
        value: function _bind(json) {
            var self = this;

            if (json.content && json.template) for (var field in json.content) {
                _binder.bind.change(json.content, field, function (value) {
                    json._htl.html(self._getTemplate(json));
                });
            }if (json.tag == "input" && json.attrs.type == "text") json.value = "";

            if (json.bind) for (var i = 0; i < json.bind.length; i++) {
                var item = json.bind[i];

                switch (item) {
                    case "text":
                        _binder.bind.change(json, "text", function (value) {
                            json._htl.text(value);
                        });
                        break;

                    case "html":
                        _binder.bind.change(json, "html", function (value) {
                            json._htl.html(value);
                        });
                        break;

                    case "value":
                        _binder.bind.change(json, "value", function (value) {
                            json._htl.value(value);
                        });

                        if (json.tag == "input" && json.attrs.type == "text" || json.tag == "textarea") json._htl.eventAttach({
                            input: function input(e) {
                                json._value = e.srcElement.value;
                                json._htl.value(e.srcElement.value);
                            }
                        });
                        break;

                    case "checked":
                        _binder.bind.change(json, "checked", function (value) {
                            json._htl.checked(value);
                        });

                        if (json.tag == "input" && (json.attrs.type == "checkbox" || json.attrs.type == "radio")) json._htl.eventAttach({
                            change: function change(e) {
                                json._checked = e.srcElement.checked;
                                json._htl.checked(e.srcElement.checked);
                            }
                        });
                        break;

                    case "attrs":
                        var _loop = function _loop(name) {
                            _binder.bind.change(json.attrs, name, function (value) {
                                var attr = {};
                                attr[name] = value;
                                json._htl.setAttr(attr);
                            });
                        };

                        for (var name in json.attrs) {
                            _loop(name);
                        }break;

                    case "css":
                        var _loop2 = function _loop2(name) {
                            _binder.bind.change(json.css, name, function (value) {
                                var style = {};
                                style[name] = value;
                                json._htl.css(style);
                            });
                        };

                        for (var name in json.css) {
                            _loop2(name);
                        }break;

                    case "transform":
                        var _loop3 = function _loop3(name) {
                            _binder.bind.change(json.transform, name, function (value) {
                                var action = {};
                                action[name] = value;
                                json._htl.transform(action);
                            });
                        };

                        for (var name in json.transform) {
                            _loop3(name);
                        }break;
                }
            }
        }
    }, {
        key: 'getFromHTML',
        value: function getFromHTML(element) {
            if (element.nodeType == 1) {
                var result, attributes, elements;

                result = {};
                result.tag = element.tagName;
                attributes = element.attributes;
                elements = element.childNodes;

                if (attributes.length) {
                    result.attrs = {};

                    for (var i = 0; i < attributes.length; i++) {
                        if (attributes[i] != "tag" && attributes[i] != "nodes" && attributes[i] != "text") result.attrs[attributes[i].name.replace("-", "_")] = attributes[i].value;
                    }
                }

                if (elements.length) {
                    result.nodes = [];

                    for (var i = 0; i < elements.length; i++) {
                        if (elements[i].nodeType == 1) result.nodes.push(this.getFromHTML(elements[i]));else if (elements[i].nodeType == 3) result.text = elements[i].textContent;
                    }
                }

                return result;
            } else return false;
        }
    }]);

    return JsonConverter;
}();

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Transform = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _object = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = {
	units: {
		perspective: "px",
		translate: "px",
		rotate: "deg",
		skew: "deg",
		origin: "%"
	},
	actions: {
		matrix2d: [],
		matrix3d: [],
		translate: [0, 0, 0],
		rotate: [0, 0, 0],
		scale: [1, 1],
		skew: [0, 0]
	},
	settings: {
		origin: false,
		perspective: 0,
		style: false,
		backface: true
	}
};

var Transform = exports.Transform = function () {
	function Transform(element) {
		_classCallCheck(this, Transform);

		var self = this;

		this.element = element;
		this._actions = (0, _object.object)(defaults.actions).clone(true);
		this._units = (0, _object.object)(defaults.units).clone();
		this._settings = (0, _object.object)(defaults.settings).clone();
	}

	_createClass(Transform, [{
		key: "apply",
		value: function apply(data) {
			if (data) {
				this.actions(data);
				if (data.settings) this.settings(data.settings);
				if (data.units) this.units(data.units);
			}

			var units = this._units,
			    actions = this._actions,
			    settings = this._settings,
			    transform = "";

			if (settings.origin) this.element.css({
				"transform-origin": settings.origin[0] + units.origin + " " + settings.origin[1] + units.origin
			});

			if (!settings.backface) this.element.css({ "backface-visibility": "hidden" });

			if (settings.style) {
				if (settings.style == "3d") this.element.css({ "transform-style": "preserve-3d" });else if (settings.style == "flat") this.element.css({ "transform-style": "flat" });
			}

			if (settings.perspective) transform += "perspective(" + settings.perspective + units.perspective + ") ";

			this.completed = false;
			this.element.css({ "transform": transform + this._build(actions, units) });

			return this;
		}
	}, {
		key: "actions",
		value: function actions(data) {
			var actions = this._actions;

			if (data.reset) this.reset.actions();

			if (data.translate) actions.translate = this._join(actions.translate, data.translate);
			if (data.rotate) actions.rotate = this._join(actions.rotate, data.rotate);
			if (data.scale) actions.scale = this._join(actions.scale, data.scale, true);
			if (data.skew) actions.skew = this._join(actions.skew, data.skew);
			if (data.matrix2d) actions.matrix2d = data.matrix2d;
			if (data.matrix3d) actions.matrix3d = data.matrix3d;
		}
	}, {
		key: "units",
		value: function units(data) {
			if (data.reset) this.reset.units();
			if (data) (0, _object.object)(this._units).joinLeft(data);
		}
	}, {
		key: "settings",
		value: function settings(data) {
			var settings = this._settings;

			if (data.origin && data.origin.length == 2) settings.origin = data.origin;

			if (data.backface !== undefined) settings.backface = data.backface;

			if (data.style) settings.style = data.style;

			if (data.perspective && typeof data.perspective == "number") settings.perspective = data.perspective;
		}
	}, {
		key: "_join",
		value: function _join(left, right) {
			var mul = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			var arr = [];

			right = arr.concat(right);

			return left.map(function (item, index) {
				var add = +right[index];
				if (add) return mul ? item * add : item + add;else return item;
			});
		}
	}, {
		key: "reset",
		value: function reset() {
			this._actions = (0, _object.object)(defaults.actions).clone(true);
			this._units = (0, _object.object)(defaults.units).clone();
			this._settings = (0, _object.object)(defaults.settings).clone();
		}
	}, {
		key: "resetUnits",
		value: function resetUnits() {
			this._units = (0, _object.object)(defaults.units).clone();
		}
	}, {
		key: "resetActions",
		value: function resetActions() {
			this._actions = (0, _object.object)(defaults.actions).clone(true);
		}
	}, {
		key: "resetSettings",
		value: function resetSettings() {
			this._settings = (0, _object.object)(defaults.settings).clone();
		}
	}, {
		key: "_build",
		value: function _build(actions, units) {
			var result = "";

			if (actions.matrix2d.length || actions.matrix3d.length) {
				if (actions.matrix2d.length) result += "matrix2d(" + actions.matrix2d.join(",") + ") ";else if (actions.matrix3d.length) result += "matrix3d(" + actions.matrix3d.join(",") + ") ";
			} else {
				for (var name in actions) {
					var action = actions[name],
					    unit = units[name] || "";

					switch (name) {
						case "translate":
							if (!this._empty(action)) result += "translate3d(" + action.join(unit + ",") + unit + ") ";
							break;
						case "rotate":
							if (action[0]) result += "rotateX(" + action[0] + unit + ") ";
							if (action[1]) result += "rotateY(" + action[1] + unit + ") ";
							if (action[2]) result += "rotateZ(" + action[2] + unit + ") ";
							break;
						case "scale":
							if (!this._empty(action, 1)) result += "scale(" + action.join() + ") ";
							break;
						case "skew":
							if (!this._empty(action)) result += "skew(" + action.join(unit + ",") + unit + ") ";
							break;
					}
				}
			}

			return result;
		}
	}, {
		key: "_empty",
		value: function _empty(array) {
			var char = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			var result = array.filter(function (item) {
				return item === char ? false : true;
			});

			return !result.length ? true : false;
		}
	}]);

	return Transform;
}();

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StyleSheet = exports.StyleSheet = function () {
	function StyleSheet() {
		_classCallCheck(this, StyleSheet);

		this.styleSheet;
		this._create();
	}

	_createClass(StyleSheet, [{
		key: "_create",
		value: function _create() {
			if (document.createStyleSheet) this.styleSheet = document.createStyleSheet();else {
				var head = document.getElementsByTagName("head")[0],
				    style = document.createElement("style");

				head.appendChild(style);

				this.styleSheet = document.styleSheets[document.styleSheets.length - 1];
			}
		}
	}, {
		key: "addRule",
		value: function addRule(selector, styles) {
			var styles = this._stylesToString(styles);

			this.styleSheet.insertRule ? this.styleSheet.insertRule(selector + " {" + styles + "}", this.styleSheet.cssRules.length) : this.styleSheet.addRule(selector, styles, this.styleSheet.cssRules.length);
		}
	}, {
		key: "addRules",
		value: function addRules(styles) {
			for (selector in styles) {
				this.addRule(selector, styles[selector]);
			}
		}
	}, {
		key: "deleteRule",
		value: function deleteRule(index) {
			this.styleSheet.deleteRule(index);
		}
	}, {
		key: "_stylesToString",
		value: function _stylesToString(styles) {
			var result = "";

			for (var i in styles) {
				result += i + ":" + styles[i] + ";";
			}return result;
		}
	}]);

	return StyleSheet;
}();

/***/ })
/******/ ]);