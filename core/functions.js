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

window.$define({
	log     : log,
	istype  : istype,
	strconv : strconv,
	random  : random,
	superFunction : superFunction
});