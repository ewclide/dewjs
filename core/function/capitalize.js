import trim from './trim';

export default function capitalize(str, each) {
	if (each) {
		return trim(str, true).replace().split(' ').map((w) => capitalize(w)).join(' ');
	}

	let res = trim(str);
	return res.charAt(0).toUpperCase() + res.slice(1);
}