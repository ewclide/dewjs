Object.prototype.$define = function(fields, options = {})
{
	var desc = {
		enumerable: options.enumer != undefined ? options.enumer : false,
		configurable: options.conf != undefined ? options.conf : true,
		writable: options.write != undefined ? options.write : true
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

		Object.defineProperty(this, fields, desc);

		if (options.set && options.value != undefined)
			this[fields] = options.value;
	}
	else
	{
		for (var key in fields)
		{
			desc.value = fields[key];
			Object.defineProperty(this, String(key), desc);
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