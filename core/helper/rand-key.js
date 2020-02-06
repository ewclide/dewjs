import randi from './rand-i';

const lower = 'abcdefghijklmnopqrstuvwxyz';
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '1234567890';
const specials = "!?@#$%^&*()*-_+=[]{}<>.,;:/'\"\\";

export default function randKey(length = 15, types = ['all']) {
	let chars = '';

	if (types.indexOf('all') != -1 ) {
		chars = lower + upper + numbers + specials;
	} else {
		if (types.indexOf('lower') != -1 ) chars += lower;
		if (types.indexOf('upper') != -1 ) chars += upper;
		if (types.indexOf('numbers') != -1 ) chars += numbers;
		if (types.indexOf('specials') != -1 ) chars += specials;
	}

	const limit = chars.length - 1;
	let result = '';

	for (let i = 1; i < length + 1; i++) {
		let char = chars[randi(0, limit)];
		if (char != result[i - 1]) result += char;
	}

	return result;
}