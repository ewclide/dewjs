function _checkInclude(first, second, settings) {
	if (!second) return true;

	if (!settings.caseSens) {
		first = first.toUpperCase();
		second = second.toUpperCase();
	}

	if (settings.whole) {
		return first == second  ? true : false;

	} else {
		let index = first.indexOf(second);

		if (settings.begin) {
			return index != -1 && ( index == 0 || first[index - 1] == ' ' ) ? true : false;
		} else {
			return index != -1 ? true : false;
		}
	}

	return;
}

function _natConv(value) {
	let dot = '', range;

	if (!isNaN(+value)) return value;

	range = parseInt(value.replace(/\-\s+\.,/g, ''), 10);

	if (!isNaN(range)) {
		return +value.replace(/[^\d+]/g, (str) => {
			if (str === ',' || str === '.' || str === '-') {
				dot = dot ? '0' : '.000000000';
				return dot;
			} else {
				return '';
			}
		});

	} else {
		return value.replace(/\s+/g, '').toUpperCase();
	}
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
	return arr.sort( (cur, next) => {
		let result = 0;

		if (settings.inside) {
			cur = cur[settings.inside];
			next = next[settings.inside];
		}

		result = _natConv(next) > _natConv(cur) ? -1 : 1;

		if (settings.reverse) result *= -1

		return result;
	});
}

export function search(arr, val, settings = {}) {
	const result = settings.inside
	? arr.filter( item => _checkInclude(item[settings.inside], val, settings) )
	: arr.filter( item => _checkInclude(item, val, settings) );

	return result.length ? result : false;
}

export function removeValue(arr, value) {
	const list = Array.isArray(value) ? value : [value];

	return list.filter( item => {
		let index = arr.indexOf(item);
		if (index != -1) {
			arr.splice(index, 1);
			return true;
		} else {
			return false;
		}
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