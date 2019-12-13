export default function compare(arr, arrComp) {
	return arr.length == arrComp.length &&
		arr.every( (item, index) => item === arrComp[index] );
}