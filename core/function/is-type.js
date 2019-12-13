export default function isType(value, type) {
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