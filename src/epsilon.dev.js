;(function(){
    
    Object.prototype.$define = function(fields, options)
    {
        var options, settings;

        options = options || false;
        settings = {
            enumerable: options.enumer || false,
            configurable: options.conf || false,
            writable: options.write ||false
        };

        if (typeof fields == "string")
        {
            if (options.get && options.set)
                delete settings.writable;

            if (options.get) settings.get = options.get;
            if (options.set) settings.set = options.set;
            
            Object.defineProperty(this, fields, settings);

            if (options.value != undefined)
                settings.value = options.value;
        }
        else
        {
            for (var key in fields)
            {
                settings.value = fields[key];
                Object.defineProperty(this, String(key), settings);
            }
        }
    };

    Object.defineProperty(
        Object.prototype,
        "$define",
        { 
            enumerable: false,
            configurable: false,
            writable: false
        }
    );

    Array.prototype.$define({
        $have : function(value)
        {
            var index = this.indexOf(value);
            if (index == -1) return false;
            else return { index : index }
        },
        $remove : function(options)
        {
            var index = options.index;

            if (options.value != undefined)
                index = this.indexOf(options.value);

            if (index != -1)
                return this.splice(index, 1);

            else return false;
        },
        $attach : function(arr)
        {
            if (Array.isArray(arr))
            {
                var self = this;
                arr.forEach(function(item){
                    self.push(item);
                });
            }
            else
            {
                this.push(arr);
            }
        }
    });

    Object.prototype.$define({
        $join : function(objects)
        {
            var self = this;

            if (Array.isArray(objects))
                objects.forEach(function(object){
                    Object.assign(self, object);
                });

            else Object.assign(self, objects);
        },
        $clone : function()
        {
            if (this.constructor != Object)
            {
                var result = new this.constructor();
                return Object.assign(result, this);
            }
            else
            {
                return Object.assign({}, this);
            }
        },
        $init : function(fields, data, showErrors = true)
        {
            var init = new Initializer(this);
            init.start(fields, data);

            if (showErrors) init.showErrors();
        }
    });

    class Initializer
    {
        constructor(object)
        {
            this._object = object;
            this._errors = [];
            this._errors.title = 'Object.$init error in "' + object.constructor.name + '" constructor';
        }

        start(fields, data)
        {
            if (fields && data)
            {
                for (var name in fields)
                {
                    var fieldOptions, value, result;

                    fieldOptions = fields[name];
                    value  = data[name];
                    result = this._validate(fieldOptions, value, name);

                    this._setValue(name, fieldOptions, result);
                }
            }
            else
            {
                this._errors.push("missing two required arguments (fields, data)");
            }
        }

        showErrors()
        {
            if (this._errors.length)
                log.err(this._errors);
        }

        _setValue(name, options, value)
        {
            if (!this._errors.length)
            {
                var object, descriptor = {}, have = 0;

                options.write !== undefined ? ( have++, descriptor.write = options.write) : descriptor.write = true;
                options.enumer  !== undefined ? ( have++, descriptor.enumer  = options.enumer)  : descriptor.enumer = true;
                options.conf  !== undefined ? ( have++, descriptor.conf  = options.conf)  : descriptor.conf = true;

                if (options.root) object = options.root;
                else object = this._object;

                if (!have) object[name] = value;
                else object.$define(name, descriptor);
            }
        }

        _validate(options, value, name)
        {
            if (options.attr)
                value = this._getAttrValue(options.attr, name, value);

            if (value === undefined)
            {
                if (options.required)
                    this._errors.push('empty required option "' + name + '"');

                else if (options.def)
                    value = options.def;
            }
            else
            {
                if (options.type && !istype(value, options.type))
                    this._errors.push('value of "' + name + '" option must be a "' + options.type + '" type');

                if (options.filter)
                    value = options.filter(value);
            }

            return value;
        }

        _getAttrValue(options, name, value)
        {
            var attr;

            if (options.element)
            {
                if (!options.prefix) options.prefix = "";
                if (!options.name) options.name = name;

                attr = DOC.convert(options.element).attr.get(options.prefix + options.name);

                if (options.only)
                    !attr ? ( value = undefined, this._errors.push('empty required attribute of option "' + name + '"') )
                    : value = strconv(attr);

                else if (value == undefined && attr)
                    value = strconv(attr);
            }
            else
            {
                this._errors.push('parameter "attr" of option "' + name + '" must have element');
            }

            return value;
        } 
    }

    function istype(value, type)
    {
        if (Array.isArray(type))
        {
            return type.some(function(t){
                if (istype(value, t)) return true;
            });
        }
        else if (type !== undefined)
        {
            switch (type)
            {
                case "number":
                    if (typeof value == "number") return true;
                    else return false;
                    break;
                case "string":
                    if (typeof value == "string") return true;
                    else return false;
                    break;
                case "boolean":
                    if (typeof value == "boolean") return true;
                    else return false;
                    break;
                case "array":
                    if (Array.isArray(value)) return true;
                    else return false;
                    break;
                case "function":
                    if (typeof value == "function") return true;
                    else return false;
                    break;
                case "dom":
                    if (value !== undefined && value.nodeType == 1) return true;
                    else return false;
                    break;
                default :
                    log.err('the type "' + type + '" is unknown!');
                    return false;
            }
        }
        else
        {
            if (typeof value == "number") return "number";
            else if (typeof value == "string") return "string";
            else if (typeof value == "boolean") return "boolean";
            else if (Array.isArray(value)) return "array";
            else if (typeof value == "function") return "function";
            else if (value.nodeType == 1) return "dom";
            else return "object";
        }
    }

    function strconv(value)
    {
        if (typeof value == "string")
        {
            if (+value) return +value;
            if (value == "true" || value == "TRUE") return true;
            if (value == "false" || value == "FALSE") return false;
            if (value.search(/\[.+\]/g) != -1)
            {
                value = value.replace(/\[|\]/g, "");
                value = value.split(",");

                return value.map(function(val){
                    return strconv(val);
                });
            }
            if (value.search(/\{.+\}/g) != -1) return JSON.parse(value);

            return value.replace(/^\s+|\s+$/g, "");
        }
        else
        {
            log.err('strconv function error : type of argument must be "string"')
        }
    }

    function log()
    {
        var args = "";

        for (var i = 0; i < arguments.length; i++)
            args += "arguments[" + i + "]" + ",";

        args = args.slice(0, args.length - 1);

        eval("console.log(" + args + ")");
    }

    log.time = function()
    {
        console.time();
    }

    log.timeoff = function()
    {
        console.timeEnd();
    }

    log.err = function(data)
    {
        var error = "";

        if (Array.isArray(data))
        {
            var tab = "";

            if ("title" in data)
            {
                error = data.title + ":\n\r";
                tab = "   - ";
            }

            data.forEach(function(message){
                error += tab + message + ";\n\r";
            });

            error = error.slice(0, error.length - 2);
        }
        else error = data;

        console.error(error);
    };

    function random(min = 0, max = 9999999)
    {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    random.key = function(length = 15, types = ["all"])
    {
        var lower = 'abcdefghijklmnopqrstuvwxyz',
            upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers = '1234567890',
            specials = "!?@#$%^&*()*-_+=[]{}<>.,;:/'\"\\",
            chars = "";

        if (types.$have("all"))
            chars = lower + upper + numbers + specials;
        else
        {
            if (types.$have("lower")) chars += lower;
            if (types.$have("upper")) chars += upper;
            if (types.$have("numbers")) chars += numbers;
            if (types.$have("specials")) chars += specials;
        }

        var limit = chars.length - 1,
            result = "";

        for (var i = 1; i < length; i++)
        {
            var char = chars[random(0, limit)];
            if (char != result[i - 1]) result += char;
        }

        return result;
    }

    class Binder
    {
        constructor(){}

        change(object, field, trigger)
        {
            var hidden = "_" + field;
            object[hidden] = object[field];

            object.$define(field, {
                get : function()
                {
                    return object[hidden];
                },
                set : function(value)
                {
                    object[hidden] = value;
                    trigger(value);
                },
                conf : true,
                enumer : true
            });
        }

        context(fn, context)
        {
            return function(){
                return fn.apply(context, arguments);
            };
        }

        fields(data)
        {
            var left = data.left,
                right = data.right,
                modifier = data.modifier,
                trigger = data.trigger;

            switch (data.type)
            {
                case "left" : this._attach(left, right, modifier, trigger); break;
                case "right" : this._attach(right, left, modifier, trigger); break;
                case "cross" :
                    this._attach(left, right, right.modifier, left.trigger);
                    this._attach(right, left, left.modifier, right.trigger);
                    break;
            }
        }

        unset()
        {

        }

        _attach(current, target, modifier, trigger)
        {
            this._genGetSet(current.object, current.field, trigger);

            this._addJoint(
                current.object, current.field,
                {
                    object : target.object,
                    field : target.field,
                    modifier : modifier
                }
            );
        }

        _genGetSet(object, field, trigger)
        {
            var self = this,
                hidden = "_" + field;

            if (!(hidden in object))
            {
                object[hidden] = {
                    joints : [],
                    value : object[field],
                    trigger : trigger
                }

                object.$define( field, {
                    get : function(){
                        return object[hidden].value;
                    },
                    set : function(value){
                        self._setData(object, field, value);
                    },
                    conf : true,
                    enumer : true
                });
            }
        }

        _addJoint(object, field, joint)
        {
            object["_" + field].joints.push(joint);
            this._applyValue(joint.object, joint.field, object["_" + field].value, joint.modifier);
        }

        _removeJoint()
        {

        }

        _applyValue(object, field, value, modifier)
        {
            var hidden = "_" + field;

            if (modifier) value = modifier(value);

            if (hidden in object) object[hidden].value = value;
            else object[field] = value;
        }

        _setData(object, field, data)
        {
            var sourseValue = data.value || data,
                binded = object["_" + field];
                binded.value = sourseValue;

            if (!data.value && binded.trigger)
                binded.trigger(sourseValue, field);
            
            binded.joints.forEach(function(joint){

                var value = joint.modifier ? joint.modifier(sourseValue) : sourseValue;

                if (joint.object == data.object && joint.field == data.field) return;
                else if (("_" + joint.field) in joint.object)
                    joint.object[joint.field] = {
                        value : value,
                        object : object,
                        field : field
                    };
                else joint.object[joint.field] = value;

            });
        }
    }

    var bind = new Binder();

    function superFunction(fn)
    {
        var shell = function(data, order)
        {
            shell._data = data;

            if (!order)
                shell._handlers.forEach(function(handler){
                    handler(data);
                });
            else
                shell._handlers.forEach(function(handler){
                    shell._data = handler(shell.data);
                });   
        }

        shell._handlers = [];
        shell._data;
        shell.count = 0;

        shell.push = function(fn)
        {
            if (typeof fn == "function")
            {
                shell._handlers.push(fn);
                shell.count = shell._handlers.length;
            }
        }

        shell.remove = function(fn)
        {
            shell._handlers.$remove({ value : fn });
            shell.count = shell._handlers.length;
        }

        if (fn) shell.push(fn);

        return shell;
    }

    class Timer
    {
        constructor(options)
        {
            this._stop = true;

            if (!options) options = {}

            this.count = options.count || 0;
            this.duration = options.duration || 0;
            this.delay = options.delay || 0;
            this.step = options.step || 0;

            this.onTick   = superFunction(options.onTick);
            this.onStart  = superFunction(options.onStart);
            this.onStop   = superFunction(options.onStop);

            this._state = {
                timePassed : 0,
                startTime  : 0,
                iteration  : 0
            }

            this._init();
        }

        get state()
        {
            return this._state;
        }

        _init()
        {
            if (this.step)
            {
                if (!this.count)
                    this.count = Math.round(this.duration / this.step);

                this.duration = null;
            }

            if (this.count) this.count--;

            this._tick = bind.context(this._tick, this);
            this._stepTick = bind.context(this._stepTick, this);
        }

        get on()
        {
            var self = this;
            return {
                tick : function(fn)
                {
                    self.onTick.push(fn);
                },
                start : function(fn)
                {
                    self.onStart.push(fn);
                },
                stop : function(fn)
                {
                    self.onStop.push(fn);
                }
            }
        }

        _common(time)
        {
            this._state.timePassed = time - this._state.startTime;

            if (this.count && this._state.iteration++ >= this.count)
                this._stop = true;
        }

        _stepTick(time)
        {
            var self = this;

            this._common(time);

            this.onTick(this._state.timePassed);

            if (!this._stop)
                setTimeout(function(){
                    self._stepTick(performance.now());
                }, this.step);

            else this.stop();
        }

        _tick(time)
        {
            var state = this._state;

            this._common(time);

            if (this.duration && state.timePassed >= this.duration)
                this._stop = true;

            this.onTick(state.timePassed);

            if (!this._stop) requestAnimationFrame(this._tick);
            else this.stop();
        }

        start()
        {
            var self = this;

            this._stop = false;

            if (self.delay)
                setTimeout(function(){
                    self._startTimer();
                }, self.delay);

            else self._startTimer();
        }

        _startTimer()
        {
            var tick, state = this._state;

            state.startTime = performance.now();
            state.timePassed = 0;

            if (this.onStart.count) this.onStart();

            if (this.step) tick = this._stepTick;
            else tick = this._tick;

            tick(state.startTime);
        }

        reset()
        {
            this._state = {
                timePassed : 0,
                startTime : 0,
                iteration : 0
            }
        }

        stop()
        {
            if (this.onStop.count) this.onStop();
            this._stop = true;
        }
    }

    class StyleSheet
    {
        constructor()
        {
            this.styleSheet;
            this._create();
        }

        _create()
        {
            if (document.createStyleSheet)
            {
                this.styleSheet = document.createStyleSheet();
            }
            else
            {
                var head = document.getElementsByTagName("head")[0],
                    element = document.createElement("style");

                head.appendChild(element);

                this.styleSheet = document.styleSheets[document.styleSheets.length - 1];
            }
        }

        addRule(selector, styles)
        {
            var styles = this._stylesToString(styles);

            if (this.styleSheet.insertRule)
            {
                var rule = selector + " {" + styles + "}";
                this.styleSheet.insertRule(rule, this.styleSheet.cssRules.length);
            }
            else
            {
                this.styleSheet.addRule(selector, styles, this.styleSheet.cssRules.length);
            }
        }

        addRules(styles)
        {
            for (selector in styles)
                this._addRule(selector, styles[selector]);
        }

        _stylesToString(styles)
        {
            var result = "";

            for (var i in styles)
                result += i + ":" + styles[i] + ";";

            return result;
        }
    }

    class Async
    {
        constructor()
        {
            this.$define({
                _async_waiters : [],
                _async_status  : 0,
                _async_calls   : superFunction(),
                _async_fails   : superFunction(),
                _async_data    : null,
                _async_error   : null
            },
            { write : true });
        }

        get on()
        {
            var self = this;

            return {
                success : function(fn)
                {
                    self._async_calls.push(fn);
                    if (self._async_status == 1) fn(self._async_data);
                },
                fail : function(fn)
                {
                    self._async_fails.push(fn);
                    if (self._async_status == -1) fn(self._async_error);
                }
            }
        }

        get run()
        {
            var self = this;

            return {
                success : function(data)
                {
                    if (self._async_status != 1)
                    {
                        self._async_status = 1;
                        if (data) self._async_data = data;
                        self._async_calls(data);
                    }
                },
                fail : function(error)
                {
                    if (self._async_status != -1)
                    {
                        self._async_status = -1;
                        if (error) self._async_error = error;
                        self._async_fails(error);
                    }
                }
            }
        }

        get switch()
        {
            var self = this;

            return {
                success : function()
                {
                    self._async_status = 1;
                },
                fail : function()
                {
                    self._async_status = -1;
                }
            }
        }

        get completed()
        {
            if (this._async_status == 1) return true;
            else return false;
        }

        get failed()
        {
            if (this._async_status == -1) return true;
            else return false;
        }

        wait(objects)
        {
            var self = this,
                handler = {};

            if (Array.isArray(objects))
            {
                objects.forEach(function(current){
                    self._async_waiters.push(current);
                });
            }
            else
            {
                this._async_waiters.push(objects);
            }

            this._async_waiters.forEach(function(waiter){
                waiter.on.success(function(){
                    var check = self._checkWaiters();
                    if (check.success) self.run.success();
                    else if (check.fail) self.run.fail();
                });
            });

            handler.then = function(action)
            {
                if (typeof action == "function")
                    self.on.success(action);

                return handler;
            }

            handler.except = function(action)
            {
                if (typeof action == "function")
                    self.on.fail(action);

                return handler;
            }

            return handler;
        }

        _checkWaiters()
        {
            for (var i = 0; i < this._async_waiters.length; i++)
            {
                if (this._async_waiters[i].failed)
                    return { fail : true };

                if (!this._async_waiters[i].completed)
                    return { success : false };
            }

            return { success : true };
        }
    }

    var url = {}

    url.$define({
        get : function(params)
        {
            var all, search;

            all = {};
            search = location.search;

            if (!search) return false;

            search = search.replace("?", "");
            search = search.split("&");
            search.forEach(function(pair){
                pair = pair.split("=");
                all[pair[0]] = pair[1];
            });

            if (params === undefined) return all;
            else if (istype(params, "string")) return all[params];
            else if (istype(params, "array"))
            {
                var arr = {}
                params.forEach(function(param, name){
                    if (param in all) arr[param] = all[param];
                });
                return arr;
            }
        },
        set : function(options)
        {
            var params = this._build(options);

            history.pushState({ foo: "bar" }, "page", location.pathname + params);

            return {
                go : function(path)
                {
                    if (!path) path = location.pathname;
                    if (params) path += params;

                    location.href = path;
                }
            }
        },
        add : function(options)
        {
            var params = self.get();

            if (params)
            {
                for (var i in options)
                    params[i] = options[i];
            }
            else params = options;

            params = this._build(params);

            history.pushState({ foo: "bar" }, "page", location.pathname + params);

            return {
                go : function(path)
                {
                    if (!path) path = location.pathname;
                    if (params) path += params;

                    location.href = path;
                }
            }
        },
        _build : function(options)
        {
            if (options)
            {
                var request = "?";

                for (var i in options)
                    request += i + "=" + options[i] + "&";

                return request.slice(0, -1);
            }
            else return "";
        }
    });

    var HTTP = {};

    HTTP.$define({
        url : url,
        get : function(path)
        {
            var self = this,
                async = new Async(),
                request = new XMLHttpRequest();

                request.open("GET", path, true);
                request.send();
                request.onreadystatechange = function()
                {
                    if (request.readyState == 4)
                    {
                        if (request.status == 200) async.run.success(request.responseText);
                        else log.err(this.status ? this.statusText : 'ajax send error');
                    }
                }

            return async;
        },
        post : function(data)
        {
            var self = this,
                request,
                formData;

            if (data)
            {
                formData = new FormData();

                for (var key in data)
                    formData.append(key, data[key]);
            }
            else log.err("http.post must have some data!");

            return {
                to : function(path)
                {
                    if (path)
                    {
                        request = new XMLHttpRequest();
                        request.open("POST", path, true);
                        request.send(formData);

                        var async = new Async();

                        request.onreadystatechange = function()
                        {
                            if (request.readyState == 4)
                            {
                                if (request.status == 200) async.run.success(request.responseText);
                                else
                                {
                                    async.run.fail(request.statusText);
                                    log.err("http.send ajax error (" + request.status + "): " + request.statusText);
                                }
                            }
                        }

                        return async;
                    }
                    else log.err("http.post must have some path!");
                }
            }
        }
    });

    class DocumentTools
    {
        constructor(elements)
        {
            this.elements = [];
            this.length = 0;
            this._id = random();
            this._query = '';
            this._readyActions = new Async();

            this.addElements(elements);
        }

        addElements(elements)
        {
            if (!Array.isArray(elements) && elements.length)
            {
                for (var i = 0; i < elements.length; i++)
                    this.elements.push(elements[i]);
            }
            else this.elements.$attach(elements);

            this.length = this.elements.length;
        }

        get tag()
        {
            return this.elements[0].tagName.toLowerCase();
        }

        get isDocTool()
        {
            return true;
        }

        ready(fn)
        {
            var self = this;

            this._readyActions.on.success(fn);

            if (this.elements[0] == document)
            {
                document.addEventListener("DOMContentLoaded", function(e){
                    self._readyActions.run.success();
                });
            }
            else
            {
                var sub = this.select("img, link, script, frame"),
                    async = new Async(),
                    waitList = [];

                if (sub.length)
                    sub.elements.forEach(function(element){
                        waitList.push(self._wrapAsync(element));
                    });
                else
                    this.elements.forEach(function(element){
                        waitList.push(self._wrapAsync(element));
                    });

                async.wait(waitList).then(function(){
                    self._readyActions.run.success();
                });
            }
        }

        _wrapAsync(element)
        {
            var async = new Async(),
                tag = element.tagName.toLowerCase();

            if (tag == "img" && element.complete)
                async.run.success();

            else if (tag == "img" || tag == "link" || tag == "script" || tag == "frame")
                element.addEventListener("load", function(){
                    async.run.success();
                });

            else async.run.success();

            return async;
        }

        select(query)
        {
            var elements = [], result;

            this.elements.forEach(function(element){
                var search = element.querySelectorAll(query);
                elements.$attach(Array.from(search));
            });
            
            result = new DocumentTools(elements);
            result._query = query;

            return result;
        }

        _getInsertMethod(name)
        {
            var methods = {
                before : function(element, current)
                {
                    if (current.parentNode)
                        current.parentNode.insertBefore(element, current);
                },
                after : function(element, current)
                {
                    if (current.parentNode)
                        current.parentNode.insertBefore(element, current.nextSibling);
                },
                append : function(element, current)
                {
                    current.appendChild(element, current);
                },
                prepend : function(element, current)
                {
                    current.insertBefore(element, current.childNodes[0]);
                }
            }

            return methods[name];
        }

        before(doc, del = true)
        {
            return this._insert(doc, del, this._getInsertMethod("before"));
        }

        after(doc, del = true)
        {
            return this._insert(doc, del, this._getInsertMethod("after"));
        }

        append(doc, del = true)
        {
            return this._insert(doc, del, this._getInsertMethod("append"));
        }    

        prepend(doc, del = true)
        {
            return this._insert(doc, del, this._getInsertMethod("prepend"));
        }

        _insert(doc, del, method)
        {
            var self = this, result = [];

            doc = this.convert(doc);

            if (doc)
            {
                this.elements.forEach(function(element){

                    var clones = [];

                    doc.elements.forEach(function(insertElement){
                        var clone = insertElement.cloneNode(true);
                        clones.push(clone);
                        method(clone, element);
                    });

                    result = result.concat(clones);
                });

                if (del) doc.remove();

                doc.addElements(result);

                return doc;
            }
            else return false;
        }

        addClass(name)
        {
            this.elements.forEach(function(element){
                var attr = element.getAttribute("class");
                if (attr) attr += " " + name;
                else attr = name;
                element.setAttribute("class", attr);
            });
        }

        removeClass(name)
        {
            this.elements.forEach(function(element){
                var attr = element.getAttribute("class");
                attr = attr.split(" ");
                attr = attr.filter(function(value){
                    return value != name;
                });
                attr = attr.join(" ");
                element.setAttribute(attr);
            });
        }

        html(str, clear = true)
        {
            if (str !== undefined)
            {
                this.elements.forEach(function(element){
                    if (clear) element.innerHTML = str;
                    else element.innerHTML += str;
                });

                return this;
            }
            else return this.elements[0].innerHTML;
        }

        text(str)
        {
            if (str !== undefined)
            {
                this.elements.forEach(function(element){
                    element.innerText = str;
                });

                return this;
            }
            else return this.elements[0].innerText;
        }

        value(data)
        {
            if (data !== undefined)
            {
                this.elements.forEach(function(element){
                    element.value = data;
                });

                return this;
            }
            else return this.elements[0].value;
        }

        active(flag)
        {
            if (flag) this.addClass("active");
            else this.removeClass("active");
        }

        checked(flag)
        {
            if (typeof flag == "boolean")
                this.elements.forEach(function(element){
                    element.checked = flag;
                });
            else if (flag == undefined)
                return this.elements[0].checked;
        }

        toogle()
        {
            this.elements.forEach(function(element){
                if (element.checked) element.checked = false;
                else element.checked = true;
            });
        }

        width(value)
        {
            if (value)
            {
                if (typeof value == "number") value += "px";
                this.elements.forEach(function(element){
                    element.style.width = value;
                });
            }
            else return this.elements[0].offsetWidth;
        }

        height(value)
        {
            if (value)
            {
                if (typeof value == "number") value += "px";
                this.elements.forEach(function(element){
                    element.style.height = value;
                });
            } 
            else return this.elements[0].offsetHeight;
        }

        wrap(classList)
        {
            if (typeof classList == "string")
            {
                var wrapper = DOC.create("div", classList);
                this.after(wrapper);
                wrapper.append(this);
                return wrapper;
            }
            else if (Array.isArray(classList))
            {
                var wrapper = DOC.create("div", classList[0]), inside = "";

                for (var i = 1; i < classList.length; i++)
                    inside += '<div class="' + classList[i] + '">';

                for (var i = 1; i < classList.length; i++)
                    inside += '</div>';

                wrapper.html(inside);
                this.after(wrapper);
                wrapper.select("." + classList[classList.length - 1]).append(this);

                return wrapper;
            }
        }

        hide()
        {
            this.css({ display : "none" });
            return this;
        }

        show()
        {
            this.css({ display : "block" });
            return this;
        }

        transform(actions, units)
        {
            this.css({ "transform" : this._buildTransform(actions, units) });
            return this;
        }

        _buildTransform(actions, units)
        {
            var result = "";

            for (var name in actions)
            {
                if (!units)
                    units = {
                        translate : "px",
                        rotate : "deg",
                        skew : "deg"
                    };

                var action = actions[name],
                unit = units[name] || "";

                switch (name)
                {
                    case "translate" :
                        if (action.length == 2)
                            result += "translate(" + action[0] + unit + "," + action[1] + unit +  ") ";
                        else if (action.length == 3)
                            result += "translate3d(" + action[0] + unit + "," + action[1] + unit + "," + action[2] + unit + ") ";
                        break;
                    case "rotate" :
                        if (typeof action == "number")
                            result += "rotate(" + action + unit + ") ";
                        else if (Array.isArray(action))
                        {
                            result += "rotateX(" + action[0] + unit + ") ";
                            result += "rotateY(" + action[1] + unit + ") ";
                            result += "rotateZ(" + action[2] + unit + ") ";
                        }
                        break;
                    case "scale" :
                        if (typeof action == "number")
                            result += "scale(" + action + ") ";
                        else if (Array.isArray(action))
                            result += "scale(" + action[0] + "," + action[1] +  ") ";
                        break;
                    case "skew" :
                        if (typeof action == "number")
                            result += "skew(" + action + unit + ") ";
                        else if (Array.isArray(action))
                            result += "skew(" + action[0] + unit + "," + action[1] + unit +  ") ";
                    break;
                }

                if (result) result += " ";
            }

            return result;
        }

        get attr()
        {
            var self = this;

            return {
                get : function(name)
                {
                    var result;

                    if (self.elements.length == 1)
                        result = self._getAttributes(self.elements[0], name);

                    return result;
                },
                set : function(attrs)
                {
                    if (typeof attrs == "string")
                    {
                        self.elements.forEach(function(element){
                            element.setAttribute(attrs, "");
                        });
                    }
                    else
                    {
                        var result = [];

                        self.elements.forEach(function(element){
                            for (var i in attrs)
                                element.setAttribute(i, attrs[i]);
                        });
                    }

                    return self;
                },
                unset : function(attrs)
                {
                    if (typeof attrs == "string")
                    {
                        self.elements.forEach(function(element){
                            element.removeAttribute(attrs);
                        });
                    }
                    else if (Array.isArray(attrs))
                    {
                        var result = [];

                        self.elements.forEach(function(element){
                            attrs.forEach(function(attr){
                                element.removeAttribute(attr);
                            });
                        });
                    }
                    else if (attrs == undefined)
                    {
                        attrs = self.attr.get();
                        
                        if (attrs)
                        {
                            self.elements.forEach(function(element){
                                for (var i in attrs)
                                    element.removeAttribute(i);
                            });
                        }
                    }

                    return self;
                }
            };
        }

        _getAttributes(element, list)
        {
            if (element !== undefined && element.nodeType == 1 && element.attributes.length)
            {
                var attributes = Object.create(null);

                if (list)
                {
                    if (Array.isArray(list))
                    {
                        list.forEach(function(name){
                            var attribute = element.getAttribute(name);
                            if (attribute) attributes[name] = attribute;
                        });
                    } 
                    else if (typeof list == "string")
                    {
                        attributes = element.getAttribute(list);
                    }
                    else return;
                }
                else
                {
                    [].forEach.call(element.attributes, function (attribute) {
                        attributes[attribute.name] = attribute.value;
                    }); 
                }

                if (attributes) return attributes;
                else return false;
            }
            else return false;
        }

        css(styles)
        {
            if (typeof styles == "string")
            {
                return this.elements[0].style[styles];
            }
            else
            {
                this.elements.forEach(function(element){
                    for (var name in styles)
                        element.style[name] = styles[name];
                });

                return this;
            }
        }

        get event()
        {

            var self = this;

            return {
                attach : function(list)
                {
                    var eventList;

                    if (!DOC._eventList[self._id])
                        DOC._eventList[self._id] = {};

                    eventList = DOC._eventList[self._id];

                    for (var event in list)
                    {
                        if (!eventList[event]) eventList[event] = superFunction(list[event]);
                        else eventList[event].push(list[event]);

                        var evAttr = {}
                        evAttr["on" + event] = "DOC._runEvFunc(" + self._id + ", '" + event + "', event)";
                        self.attr.set(evAttr);
                    }
                    
                    return self;
                },
                dispatch(type)
                {
                    var event = new Event(type);

                    self.elements.forEach(function(element){
                        element.dispatchEvent(event);
                    });
                },
                run : function(type)
                {
                    DOC._runEvFunc(self._id, type);
                },
                detach : function()
                {

                }
            }
        }

        get json()
        {
            var self = this;

            return {
                before : function(json)
                {
                    return self._insertJson(json, self._getInsertMethod("before"));
                },
                after : function(json)
                {
                    return self._insertJson(json, self._getInsertMethod("after"));
                },
                prepend : function(json)
                {
                    return self._insertJson(json, self._getInsertMethod("prepend"));
                },
                append : function(json)
                {
                    return self._insertJson(json, self._getInsertMethod("append"));
                },
                get : function(element)
                {
                    if (element)
                    {
                        return self._convertToJson(element);
                    }
                    else if (self.elements.length)
                    {
                        var result;

                        if (self.elements.length == 1)
                        {
                            result = self._convertToJson(self.elements[0]);
                        }
                        else
                        {
                            result = [];
                            self.elements.forEach(function(element){
                                result.push(self._convertToJson(element));
                            });
                        }   

                        return result;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
        }

        _insertJson(json, method)
        {
            var self = this, clones = [];

            this._initJson(json);

            this.elements.forEach(function(current){
                var element = self._buildJson(json);
                clones.push(element);
                method(element, current);
            });

            return new DocumentTools(clones);
        }

        _buildJson(json)
        {
            var self = this, current = json._element.cloneNode(true);

            if (json.nodes && !json.template)
            {
                if (Array.isArray(json.nodes))
                    json.nodes.forEach(function(node){
                        current.appendChild(self._buildJson(node));
                    })
                else current.appendChild(self._buildJson(json.nodes));
            }

            json._doc.addElements(current);

            return current;
        }

        _initJson(json)
        {
            if (!json._doc)
            {
                var element, doc, self = this;

                if (!json.tag) json.tag = "div";

                element = document.createElement(json.tag);
                doc = new DocumentTools(element);

                json._defaults = {};

                for (var item in json)
                {
                    switch (item)
                    {
                        case "text"  : doc.text(json.text); break;
                        case "html"  : doc.html(json.html); break;
                        case "value" : doc.value(json.value); break;
                        case "checked" : doc.checked(json.checked); break;
                        case "attrs" : doc.attr.set(json.attrs); break;
                        case "css"   : doc.css(json.css); break;
                        case "transform" : doc.transform(json.transform, json.transform.units); break;
                        case "nodes" :
                            if (Array.isArray(json.nodes))
                                json.nodes.forEach(function(node){
                                    self._initJson(node)
                                });
                            else self._initJson(json.nodes);
                        break;
                    }
                }

                if (json.content && json.template)
                {
                    json._defaults.content = JSON.parse(JSON.stringify(json.content));
                    doc.html(self._getJsonContent(json));
                }

                json._element = element;
                json._doc = doc;

                this._bindJson(json);

                if (json.events)
                    doc.event.attach(json.events);

                json._doc.elements = [];
            }
        }

        _getJsonContent(json)
        {
            var content = json.content,
                template = json.template,
                defaults = json._defaults.content;

            for (var field in content)
            {
                if (content[field] == "")
                    content[field] = defaults[field];

                template = template.replace("{" + field + "}", content[field]);
            }

            if (json.nodes)
            {
                if (Array.isArray(json.nodes))
                    json.nodes.forEach(function(node, index){
                        template = template.replace("{node[" + index + "]}", node._element.outerHTML);
                    });
                else template = template.replace("{node}", json.nodes._element.outerHTML);
            }

            var tokens = this._splitTokens(template);

            tokens.forEach(function(token){
                template = template.replace("{" + token + "}", '<span style="color : red">unknown token: '+ token +'</span>');
            });

            return template;
        }

        _splitTokens(str)
        {
            var token = "", start = false, tokens = [];

            for (var i = 0; i < str.length; i++)
            {
                if (str[i] == "{")
                {
                    start = true;
                    continue;
                }
                else if (str[i] == "}")
                {
                    start = false;
                    continue;
                }
                
                if (start) token += str[i];
                else if (token)
                {
                    tokens.push(token);
                    token = "";
                }
            }

            return tokens;
        }

        _bindJson(json)
        {
            var self = this;

            if (json.content && json.template)
            {
                for (var field in json.content)
                    bind.change( json.content, field, function(value){ json._doc.html(self._getJsonContent(json)); });
            }

            if (json.bind)
            {
                for (var item in json.bind)
                switch (item)
                {
                    case "text":
                        if (json.bind.text)
                            bind.change( json, "text", function(value){ json._doc.text(value); });
                        break;
                    case "html":
                        if (json.bind.html)
                            bind.change( json, "html", function(value){ json._doc.html(value); });
                        break;
                    case "value":
                        if (json.bind.value)
                        {
                            bind.change( json, "value", function(value){ json._doc.value(value); });

                            if ((json.tag == "input" && json.attrs.type == "text") || json.tag == "textarea")
                                json._doc.event.attach({
                                    input : function(e)
                                    {
                                        json._value = e.srcElement.value;
                                        json._doc.value(e.srcElement.value);
                                    }
                                });
                        }
                        break;
                    case "checked" : 
                        if (json.bind.checked)
                        {
                            bind.change( json, "checked", function(value){ json._doc.checked(value); });

                            if (json.tag == "input" && (json.attrs.type == "checkbox" || json.attrs.type == "radio"))
                                json._doc.event.attach({
                                    change : function(e)
                                    {
                                        json._checked = e.srcElement.checked;
                                        json._doc.checked(e.srcElement.checked);
                                    }
                                });
                        }
                        break;
                    case "attrs":
                        if (json.bind.attrs)
                            for (var name in json.attrs)
                                (function(){
                                    var let_name = name;
                                    bind.change( json.attrs, name, function(value){ var attr = {}; attr[let_name] = value; json._doc.attr.set(attr); });
                                })();
                        break;
                    case "css":
                        if (json.bind.css)
                            for (var name in json.css)
                                (function(){
                                    var let_name = name;
                                    bind.change( json.css, name, function(value){ var style = {}; style[let_name] = value; json._doc.css(style); });
                                })();
                        break;
                }
            }
        }

        _convertToJson(element)
        {
            if (element.nodeType == 1)
            {
                var result, attributes, elements;

                result = {};
                result.tag = element.tagName;
                attributes = element.attributes;
                elements = element.childNodes;

                if (attributes.length)
                {
                    result.attrs = {};

                    for (var i = 0; i < attributes.length; i++)
                    {
                        if (attributes[i] != "tag" && attributes[i] != "nodes" && attributes[i] != "text")
                            result.attrs[attributes[i].name.replace("-","_")] = attributes[i].value;
                    }
                }

                if (elements.length)
                {
                    result.nodes = [];

                    for (var i = 0; i < elements.length; i++)
                    {
                        if (elements[i].nodeType == 1)
                            result.nodes.push(this._convertToJson(elements[i]));

                        else if (elements[i].nodeType == 3)
                            result.text = elements[i].textContent;
                    }
                }

                return result;
            }
            else return false;
        }

        each(fn)
        {
            this.elements.forEach(function(element, index, array){
                fn(DOC.convert(element), index, array);
            });

            return this;
        }

        clone()
        {
            var self = this, clones = [];

            this.elements.forEach(function(element){
                clones.push(element.cloneNode(true));
            });

            return new DocumentTools(clones);
        }

        convert(elements)
        {
            if (elements.nodeType == 1 || elements.nodeType == 9)
                return new DocumentTools(elements);

            else if (elements.isDocTool)
                return elements;

            else return false;
        }

        merge(doc)
        {
            this.elements = this.elements.concat(doc.elements);
            return this;
        }

        clear()
        {
            this.html("");
        }

        remove()
        {
            var self = this;

            this.elements.forEach(function(element, index){
                if (element.parentNode)
                    element.parentNode.removeChild(element);

                self.elements.$remove({ index : index });
            });
        }
    }

    var proto = DocumentTools.prototype;

    var DOC = new DocumentTools(document);

    DOC.$define({
        extend : function(name, method)
        {
            proto[name] = method;
        },
        _eventList : {},
        _runEvFunc : function(id, type, e)
        {
            this._eventList[id][type](e);
        },
        parseXML : function(data)
        {
            var parse, errors = '';

            if (typeof window.DOMParser != "undefined")
            {
                parse = function(str)
                {
                    return (new window.DOMParser()).parseFromString(str, "text/xml");
                }
            }
            else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM"))
            {
                parse = function(str)
                {
                    var xml = new window.ActiveXObject("Microsoft.XMLDOM");
                        xml.async = "false";
                        xml.loadXML(str);
                    return xml;
                }
            }
            else errors += 'No XML parser found';

            if (!errors) return parse(data);
            else
            {
                log.err(errors);
                return false;
            }
        },
        create(tag, attr, css)
        {
            var doc = new DocumentTools(document.createElement(tag));

            if (typeof attr == "string")
                doc.addClass(attr);

            else if (typeof attr == "object")
                doc.attr.set(attr);

            if (css) doc.css(css);

            return doc;
        }
    });

    DOC.ready(function(){
        DOC.body = new DocumentTools(document.body);
    }); 

    window.$define({
        DOC     : DOC,
        istype  : istype,
        strconv : strconv,
        bind    : bind,
        random  : random,
        HTTP    : HTTP,
        log     : log,
        superFunction : superFunction
    });

    var Epsilon = {}

    Epsilon.$define({
        Async   : Async,
        Timer   : Timer,
        StyleSheet : StyleSheet
    });

    window.Epsilon = Epsilon;
    window.EPS = Epsilon;

})();
