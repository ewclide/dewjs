function getBrowser()
{
    let agent = navigator.userAgent;

    if (agent.search(/Chrome/) > 0)  return 'Chrome';
    if (agent.search(/Firefox/) > 0) return 'Firefox';
    if (agent.search(/Opera/) > 0)   return 'Opera';
    if (agent.search(/Safari/) > 0)  return 'Safari';
    if (agent.search(/MSIE|\.NET/) > 0) return 'IE';

    return false;
}

export let browser = getBrowser();

export function printErr(data, source = true)
{
	let error = "Error: ";

	if (source) source = _getSourceLog();

	if (Array.isArray(data) && data.length)
	{
		error += data.title || "Error list";
		error += '\n';

		data.forEach( message => error += `  --> ${message}\n` );

        if (source) error += `  -----\n  Source: ${source}`;
	}
	else if (typeof data == "string")
	{
		error += data;
		if (source) error += ` (${source})`;
	}
	else return false;

	console.error(error);

	return false;
}

function _getSourceLog()
{
	let stack = (new Error()).stack;

	if (stack) stack = stack.split('\n');
	else return '';

	for (let i = 0; i < stack.length; i++)
		if (stack[i].search(/dew\.(min|dev)\.js|anonymous/g) == -1)
		{
			let src = stack[i].match(/https?:[^\)]+/g);
			if (src && src[0]) return src[0];
		}

	return '';
}

export function define(obj, fields, options = {})
{
	let desc = {
		enumerable   : options.enumer !== undefined ? options.enumer : false,
		configurable : options.config !== undefined ? options.config : true,
		writable     : options.write  !== undefined ? options.write  : true
	};

	if (typeof fields == "string")
	{
		if (options.value !== undefined)
			desc.value = options.value;
		
		else if (options.get && options.set)
		{
			desc.get = options.get;
			desc.set = options.set;
			delete desc.writable;
		}

		Object.defineProperty(obj, fields, desc);

		if (options.set && options.value !== undefined)
			obj[fields] = options.value;
	}
	else for (let key in fields)
		{
			desc.value = fields[key];
			Object.defineProperty(obj, String(key), desc);
		}
};

export function isType(value, type)
{
	if (Array.isArray(type))
		return type.some( t => isType(value, t) );

	else if (type !== undefined)
	{
		switch (type)
		{
			case 'number'   : return typeof value == 'number';
			case 'string'   : return typeof value == 'string';
			case 'boolean'  : return typeof value == 'boolean';
			case 'array'    : return Array.isArray(value);
			case 'function' : return typeof value == 'function';
			case 'DOM'      : return value instanceof Element;
			case 'HTMLTools': return value.isHTMLTools ? true : false;
			default : printErr(`the type "${type}" is unknown!`); return false;
		}
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

export function strParse(value)
{
	if (typeof value == 'string')
	{
		if (+value) return +value;
		if (value == 'true' || value == 'TRUE') return true;
		if (value == 'false' || value == 'FALSE') return false;
		if (value.search(/\[.+\]/g) != -1)
		{
			value = value.replace(/\[|\]/g, "").split(",");
			return value.map(val => strParse(val));
		}
		if (value.search(/\{.+\}/g) != -1) return jsonParse(value);

		return value.replace(/^\s+|\s+$/g, "");
	}
	else printErr('strParse function error : type of argument must be "string"')
}

export function jsonParse(str)
{
    let devs = '{}[],:',
    	quot = '', word = '', isString = false, left = false,
        reg = /^[\s*"']+|['"\s*]+$/gm,
        result = '';
 
    for (let i = 0; i < str.length; i++)
    {
    	if (isString && str[i] == quot) { isString = false; i++ }
    	if (str[i] == "'" || str[i] == '"') { isString = true; quot = str[i]; i++ }

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

export function construct(Cls, args)
{
	args = Array.from(args);
    args.unshift(0);
	return new (Function.bind.apply(Cls, args))();
}

export function publish(TheClass, fields, methods)
{
    let list = {};

    function Output()
    {
        let id = Math.random();
        list[id] = construct(TheClass, arguments);
        this.id = id;
    }

    if (fields)
    for (let i = 0; i < fields.length; i++)
    {
        let field = fields[i];

        Object.defineProperty(Output.prototype, field, {
            configurable : false,
            get : function(){
                return list[this.id][field];
            },
            set : function(value){
                list[this.id][field] = value;
            }
        });
    }

    if (methods)
    for (let i = 0; i < methods.length; i++)
    {
        let method = methods[i];
        Output.prototype[method] = function(){
            let obj = list[this.id];
            return obj[method].apply(obj, arguments);
        }
    }

    return Output;
}

export function fetchSettings(settings, defaults, attributes, element)
{
	let result = {}

    for (let i in defaults)
    {
        if (settings[i] === undefined)
        {
            let attr = 'data-' + (attributes[i] || i), num;

            attr = element ? element.getAttribute(attr) : null;
            num = +attr;

            if (attr === '' || attr === 'true')
                attr = true;

            else if (attr === 'false')
                attr = false;

            else if (attr !== null && !isNaN(num))
                attr = num;

            result[i] = attr !== null ? attr : defaults[i];
        }
        else result[i] = settings[i];
    }

    return result;
}

export function random(min = 0, max = 9999999)
{
	return Math.floor(Math.random() * (max - min)) + min;
}
export function randomKey(length = 15, types = ['all'])
{
	let lower = 'abcdefghijklmnopqrstuvwxyz',
		upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		numbers = '1234567890',
		specials = "!?@#$%^&*()*-_+=[]{}<>.,;:/'\"\\",
		chars = '';

	if (types.indexOf('all') != -1 ) 
		chars = lower + upper + numbers + specials;
	else
	{
		if (types.indexOf('lower') != -1 ) chars += lower;
		if (types.indexOf('upper') != -1 ) chars += upper;
		if (types.indexOf('numbers') != -1 ) chars += numbers;
		if (types.indexOf('specials') != -1 ) chars += specials;
	}

	let limit = chars.length - 1,
		result = '';

	for (let i = 1; i < length; i++)
	{
		let char = chars[random(0, limit)];
		if (char != result[i - 1]) result += char;
	}

	return result;
}

export function log()
{
	let args = Array.from(arguments),
		source = _getSourceLog();

    if (source) args.push(`\n-----\nSource: ${source}`);

	console.log.apply(null, args);
}

log.json = function(json, spaces = 4)
{
    log(JSON.stringify(json, null, spaces));
}

log.time = (name) => console.time(name);
log.timeEnd = (name) => console.timeEnd(name);