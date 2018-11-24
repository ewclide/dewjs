import {strParse, isType, printErr} from './functions';

export default class ObjectIniter
{
	constructor(object)
	{
		this._object = object;
		this.errors = [];
		this.errors.title = `DEW object init error at ${object.constructor.name} constructor`;
	}

	checkout(field, settings, value)
	{
		let result = this._validate(field, settings, value);

		if (result !== undefined)
			this._setValue(field, settings, result);
	}

	_setValue(field, settings, value)
	{
		let object = settings.root ? settings.root : this._object;

		if (settings.desc)
			Object.defineProperty(object, String(field), {
				writable     : settings.desc.write  !== undefined ? settings.desc.write  : true,
				enumerable   : settings.desc.enumer !== undefined ? settings.desc.enumer : true,
				configurable : settings.desc.config !== undefined ? settings.desc.config : true,
				value : value
			})

		else object[field] = value
	}

	_validate(field, settings, value)
	{
		if (settings.attr)
			value = this._getAttrValue(field, settings.attr, value);

		if (value === undefined)
		{
			if (settings.required)
				this.errors.push(`empty required option "${field}"`);

			else if (settings.def)
				value = settings.def;
		}
		else
		{
			if (settings.type && !isType(value, settings.type))
			{
				this.errors.push(`value of "${field}" option must be a "${settings.type}" type`);
				value = undefined;
			}

			if (settings.filter)
				value = settings.filter(value);
		}

		return value;
	}

	_getAttrValue(field, settings, value)
	{
		if (settings.element)
		{
			if (!settings.prefix) settings.prefix = "data-";

			let attr = $html.convert(settings.element).getAttr(settings.prefix + field);

			if (settings.only)
				!attr ? ( value = undefined, this.errors.push(`empty required attribute of option "${field}"`) )
				: value = strParse(attr);

			else if (value == undefined && attr)
				value = strParse(attr);
		}
		else this.errors.push(`setting "attr" of option "${field}" must have element`);

		return value;
	} 
}