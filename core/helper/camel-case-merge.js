export default function camelCaseMerge(words) {
	return words.reduce((result, word, index) => {
		return result + (index ? word.charAt(0).toUpperCase() + word.slice(1) : word)
	}, '');
}