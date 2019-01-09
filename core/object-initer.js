import {strParse, isType} from './functions';
import html from './html';

export default class ObjectIniter
{
	constructor(object) {
		this._object = object;
		this.errors = [];
		this.errors.title = `DEW object init error at ${object.constructor.name} constructor`;
	}

	checkout(field, settings, value) {
		const result = this._validate(field, settings, value);

		if (result !== undefined) {
			this._setValue(field, settings, result);
		}
	}

	_setValue(field, settings, value) {
		const { root, desc } = settings;
		const { write, enumer, config } = desc;

		const object = root || this._object;

		if (settings.desc) {
			Object.defineProperty(object, String(field), {
				writable     : typeof write  == 'boolean' ? write  : true,
				enumerable   : typeof enumer == 'boolean' ? enumer : true,
				configurable : typeof config == 'boolean' ? config : true,
				value
			});

		} else {
			object[field] = value;
		}
	}

	_validate(field, settings, value) {
		const { required, def, type, filter, range, attr } = settings;

		let result = value;

		if (attr) {
			result = this._fetchFromAttribute(field, settings, value);
		}

		if (value === undefined) {
			if (required) {
				this.errors.push(`empty required option "${field}"`);

			} else if (def) {
				value = def;
			}

		} else {
			if (type && !isType(value, type)) {
				this.errors.push(`value of "${field}" option must be a "${type}" type`);
				value = undefined;
			}

			if (typeof filter == 'function') {
				value = filter(value);
			}
		}

		return value;
	}

	_fetchFromAttribute(field, settings, value) {
		const { element,  prefix = 'data-', attrOnly } = settings;

		if (!element) {
			this.errors.push(`field "${field}" must have element option`);
			return;
		}

		const attr = html.convert(element).getAttr(prefix + field);

		if (attrOnly && !attr) {
			this.errors.push(`empty required attribute of field "${field}"`);
			return;

		} else if (value === undefined && attr) {
			return strParse(attr);

		} else {
			return value;
		}
	}
}