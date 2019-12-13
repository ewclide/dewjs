export default function zeroPad(num, size) {
	let result = num + '';

    while (result.length < size) {
        result = '0' + result;
	}

    return result;
}