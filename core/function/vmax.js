export default function vmax(value) {
	const side = Math.max(window.innerWidth, window.innerHeight);
	return value / 100 * side;
}