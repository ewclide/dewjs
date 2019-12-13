export default function randi(min = 0, max = 9) {
	return Math.floor(min + Math.random() * (max + 1 - min));
}