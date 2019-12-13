export default function subtract(arr, arr2) {
	return arr.filter( item => arr2.indexOf(item) < 0 );
}