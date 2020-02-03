export default function camelCaseToLine(str, up = false) {
	const res = str.replace(/[A-Z]/g, s => '_' + s.toLowerCase());
	return up ? res.toUpperCase() : res;
}