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

function _natConv(value) {
	if (!isNaN(+value)) return value;

	const range = parseInt(value.replace(/\-\s+\.,/g, ''), 10);
	let dot = '';

	if (!isNaN(range)) {
		return +value.replace(/[^\d+]/g, (str) => {
			if (str === ',' || str === '.' || str === '-') {
				dot = dot ? '0' : '.000000000';
				return dot;
			} else {
				return '';
			}
		});
	}

	return value.replace(/\s+/g, '').toUpperCase();
}

export function contain(arr, value) {
	const index = arr.indexOf(value);
	return index == -1 ? false : { index };
}

export function subtract(arr, arr2) {
	return arr.filter( item => arr2.indexOf(item) < 0 );
}

export function difference(arr, arr2) {
	return arr.filter( item => arr2.indexOf(item) < 0 )
		.concat( arr2.filter( item => arr.indexOf(item) < 0 ) );
}

export function compare(arr, arrComp) {
	return arr.length == arrComp.length &&
		arr.every( (item, index) => item === arrComp[index] );
}

export function unique(arr) {
	const hash = {};

	for (let i = 0; i < arr.length; i++) {
		if (!(arr[i] in hash)) {
			hash[arr[i]] = true
		} else {
			arr.splice(i--, 1);
		}
	}
}

export function natSort(arr, settings = {}) {
	const { inside, reverse } = settings;

	return arr.sort((cur, next) => {
		let result = 0;

		if (inside) {
			cur = cur[inside];
			next = next[inside];
		}

		result = _natConv(next) > _natConv(cur) ? -1 : 1;

		if (reverse) result *= -1

		return result;
	});
}

export function search(arr, val, settings = {}) {
	const result = settings.inside
		? arr.filter((item) => _checkInclude(item[settings.inside], val, settings))
		: arr.filter((item) => _checkInclude(item, val, settings));

	return result.length ? result : false;
}

export function removeValue(arr, value) {
	const list = Array.isArray(value) ? value : [value];

	return list.filter((item) => {
		const index = arr.indexOf(item);

		if (index !== -1) {
			arr.splice(index, 1);
			return true;
		}

		return false;
	});
}

export function removeIndex(arr, index) {
	const values = Array.isArray(index) ? index.map( i => arr[i] ) : arr[index];
	return removeValue(arr, values);
}

export function equal(arr1, arr2) {
    if (arr1.length !== arr2.length) return;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    return true;
}