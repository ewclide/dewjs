export default function vmin(value) {
	const side = Math.min(window.innerWidth, window.innerHeight);
	return value / 100 * side;
}