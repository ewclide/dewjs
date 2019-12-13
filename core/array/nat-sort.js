
function _natConv(value) {
	if (!isNaN(+value)) return value;

	const range = parseInt(value.replace(/\-\s+\.,/g, ''), 10);
	let dot = '';

	if (!isNaN(range)) {
		return +value.replace(/[^\d+]/g, (str) => {
            if (str !== ',' && str !== '.' && str !== '-') return '';
			dot = dot ? '0' : '.000000000';
			return dot;
		});
	}

	return value.replace(/\s+/g, '').toUpperCase();
}

export default function natSort(arr, settings = {}) {
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