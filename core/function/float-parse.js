export default function floatParse(str) {
	return parseFloat(str.replace(/,/, '.').replace(/[^\d.,]/g, ''));
}