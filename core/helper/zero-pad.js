export default function zeroPad(num, size = 0) {
	let result = num + '';

    while (result.length < size) {
        result = '0' + result;
	}

    return result;
}