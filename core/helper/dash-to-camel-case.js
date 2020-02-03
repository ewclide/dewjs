export default function dashToCamelCase(str) {
	return str.replace(/-\w/g, s => s.toUpperCase().slice(1));
}