export function printErr(data, source = true)
{
	var error = "";

	if (source) source = _getSourceLog();

	if (Array.isArray(data) && data.length)
	{
		error += data.title || "Error list";
		if (source) error += " ( " + source + " )";
		error += ":\n";

		data.forEach( message => error += "   - " + message + "\n" );
	}
	else if (typeof data == "string")
	{
		error += data;
		if (source) error += " ( " + source + " )";
	}
	else return false;

	console.error(error);

	return false;
}

function _getSourceLog()
{
	var stack = (new Error()).stack;

	if (stack) stack = stack.split("\n");
	else return "";

	for (var i = 0; i < stack.length; i++)
		if (stack[i].search(/dew\.(min|dev)\.js|anonymous/g) == -1)
		{
			var src = stack[i].match(/https?:[^\)]+/g);
			if (src && src[0]) return src[0];
		}

	return "";
}

export function define(obj, fields, options = {})
{
	var desc = {
		enumerable   : options.enumer != undefined ? options.enumer : false,
		configurable : options.config != undefined ? options.config : true,
		writable     : options.write  != undefined ? options.write  : true
	};

	if (typeof fields == "string")
	{
		if (options.value) desc.value = options.value;
		else if (options.get && options.set)
		{
			desc.get = options.get;
			desc.set = options.set;
			delete desc.writable;
		}

		Object.defineProperty(obj, fields, desc);

		if (options.set && options.value != undefined)
			obj[fields] = options.value;
	}
	else for (var key in fields)
		 {
			desc.value = fields[key];
			Object.defineProperty(obj, String(key), desc);
		 }
	
};

export function istype(value, type)
{
	if (Array.isArray(type))
		return type.some( t => istype(value, t) ? true : false );

	else if (type !== undefined)
		switch (type)
		{
			case "number"   : return typeof value == "number" ? true : false;
			case "string"   : return typeof value == "string" ? true : false;
			case "boolean"  : return typeof value == "boolean" ? true : false;
			case "array"    : return Array.isArray(value) ? true : false;
			case "function" : return typeof value == "function" ? true : false;
			case "DOM"      : return value !== undefined && value.nodeType == 1 ? true : false;
			case "HTMLTools": return value.isHTMLTools ? true : false;
			default : printErr('the type "' + type + '" is unknown!'); return false;
		}

	else
	{
		if (typeof value == "number") return "number";
		else if (typeof value == "string") return "string";
		else if (typeof value == "boolean") return "boolean";
		else if (Array.isArray(value)) return "array";
		else if (typeof value == "function") return "function";
		else if (value.nodeType == 1) return "DOM";
		else if (value.isHTMLTools) return "HTMLTools";
		else return "object";
	}
}

export function strconv(value)
{
	if (typeof value == "string")
	{
		if (+value) return +value;
		if (value == "true" || value == "TRUE") return true;
		if (value == "false" || value == "FALSE") return false;
		if (value.search(/\[.+\]/g) != -1)
		{
			value = value.replace(/\[|\]/g, "").split(",");
			return value.map(val => strconv(val));
		}
		if (value.search(/\{.+\}/g) != -1) return jsonParse(value);

		return value.replace(/^\s+|\s+$/g, "");
	}
	else printErr('strconv function error : type of argument must be "string"')
}

export function jsonParse(str)
{
    var devs = '{}[],:',
    	quot = '', word = '', isString = false, left = false,
        reg = /^[\s*"']+|['"\s*]+$/gm,
        result = '';
 
    for (var i = 0; i < str.length; i++)
    {
    	if (isString && str[i] == quot) (isString = false, i++)
    	if (str[i] == "'" || str[i] == '"') (isString = true, quot = str[i], i++)

    	left = str[i] == ":";

        if (devs.indexOf(str[i]) != -1 && !isString)
        {
        	word = word.replace(reg, '');

            if (word)
            {
				if (word == 'true') word = true;
            	else if (word == 'false') word = false;

            	result += typeof word == 'boolean' && !left || +word && !left
            	? word : '"' + word + '"';
            }

            result += str[i];
            word = '';
        }
        else word += str[i];
    }

    return JSON.parse(result);
}

export function random(min = 0, max = 9999999)
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

	if (types.indexOf("all") != -1 ) 
		chars = lower + upper + numbers + specials;
	else
	{
		if (types.indexOf("lower") != -1 ) chars += lower;
		if (types.indexOf("upper") != -1 ) chars += upper;
		if (types.indexOf("numbers") != -1 ) chars += numbers;
		if (types.indexOf("specials") != -1 ) chars += specials;
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

var megaMethods = {
	_call : function(target, data, order)
	{
		var result = data;

		target._data = data;

		order
		? target._handlers.forEach( handler => target._data = handler(target._data) )
		: target._handlers.forEach( handler => handler(data) );

		result = target._data;
		target._data = null;

		return result;
	},
	push : function(fn, name)
	{
		if (typeof fn == "function")
		{
			if (name) this._names[name] = this.count;
			this._handlers.push(fn);
			this.count++;
		}
	},
	remove : function(id)
	{
		var index = id, handler;

		if (typeof id == "string")
		{
			index = this._names[id];
			delete this._names[id];
		}

		if (this._handlers[index])
		{
			this._handlers.splice(index, 1);
			this.count--;
		}
	},
	evoke : function(id, data)
	{
		var index = id, handler;

		if (typeof id == "string") index = this._names[id];

		if (this._handlers[index]) return this._handlers[index](data);
		else printErr('Dew megaFunction evoke error: undefined function with id "' + id + '"');
	}
}

export function megaFunction(fn, name)
{
	var mega = function(data, order)
	{
		return megaMethods._call(mega, data, order);
	}

	mega._handlers = [];
	mega._names = Object.create(null);
	mega._data;
	mega.count = 0;
	mega.push = megaMethods.push;
	mega.remove = megaMethods.remove;
	mega.evoke = megaMethods.evoke;

	if (typeof fn == "function") mega.push(fn, name);

	return mega;
}

export function log()
{
	console.log.apply(window, arguments);
}

log.time = console.time;
log.timeEnd = console.timeEnd;