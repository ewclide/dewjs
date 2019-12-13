export default function contain(arr, value) {
	const index = arr.indexOf(value);
	return index == -1 ? false : { index };
}