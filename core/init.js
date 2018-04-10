export class Init
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
			var object, desc = {}, have = 0;

			options.write  !== undefined ? ( have++, desc.write = options.write)  : desc.write = true;
			options.enumer !== undefined ? ( have++, desc.enumer = options.enumer): desc.enumer = true;
			options.conf   !== undefined ? ( have++, desc.conf  = options.conf)   : desc.conf = true;

			if (options.root) object = options.root;
			else object = this._object;

			if (!have) object[name] = value;
			else object.$define(name, desc);
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
		if (options.element)
		{
			if (!options.prefix) options.prefix = "data-";
			if (!options.name) options.name = name;

			var attr = $html.convert(options.element).attr.get(options.prefix + options.name);

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