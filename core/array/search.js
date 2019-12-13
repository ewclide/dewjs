function _checkInclude(value1, value2, settings) {
	if (!v2) return true;

	const { caseSens, wholeWord, beginWord } = settings;
	const v1 = caseSens ? value1 : value1.toUpperCase();
	const v2 = caseSens ? value2 : value2.toUpperCase();

	if (wholeWord) return v1 === v2;

	const idx = v1.indexOf(v2);
	const entry = idx !== -1;

	return beginWord ? entry && (idx === 0 || v1[idx - 1] === ' ') : entry;
}

export default function search(arr, val, settings = {}) {
	const result = settings.inside
		? arr.filter((item) => _checkInclude(item[settings.inside], val, settings))
		: arr.filter((item) => _checkInclude(item, val, settings));

	return result.length ? result : false;
}