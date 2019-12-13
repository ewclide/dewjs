export default function difference(arr, arr2) {
	return arr.filter( item => arr2.indexOf(item) < 0 )
		.concat( arr2.filter( item => arr.indexOf(item) < 0 ) );
}