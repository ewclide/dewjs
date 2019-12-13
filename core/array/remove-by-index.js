import removeValue from './remove-value';

export default function removeByIndex(arr, index) {
	const values = Array.isArray(index) ? index.map( i => arr[i] ) : arr[index];
	return removeValue(arr, values);
}