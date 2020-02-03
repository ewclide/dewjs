export default function intParse(str) {
	return +str.replace(/[^\d]/g, '');
}