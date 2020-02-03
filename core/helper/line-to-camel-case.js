export default function lineToCamelCase(str) {
	return str.replace(/_\w/g, s => s.toUpperCase().slice(1));
}