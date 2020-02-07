import jsonParse from './json-parse';
import log from './log';

function trimQuots(value) {
	const trimmed = /^\s*(?:'|"|`+)?(.+?)(?:'|"|`+)?\s*$/.exec(value);
	if (!trimmed) return value;
	return trimmed[1];
}

export default function strParse(input) {
	if (typeof input !== 'string') {
		log.error('strParse error - type of argument must be "string"');
		return input;
	}

	let value = input.trim();

	if (+value) return +value;
	if (value === 'true' || value === 'TRUE') return true;
	if (value === 'false' || value === 'FALSE') return false;
	if (value.search(/\[.+\]/g) != -1) {
		value = value.replace(/\[|\]/g, '').split(',');
		return value.map(val => strParse(val));
	}

	if (value.search(/\{.+\}/gm) != -1) return jsonParse(value);

	return trimQuots(value);
}