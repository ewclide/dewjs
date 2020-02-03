export default function unique(arr, mutate = false) {
	if (!mutate) {
		if (window.Set) return [...new Set(arr)];

		const values = new Set();
		return arr.filter(v => {
			if (values.has(v)) return;
			values.add(v);
			return v;
		});
	}

	// mutation
	const values = new Set();
	for (let i = 0; i < arr.length; i++) {
		if (values.has(arr[i])) {
			arr.splice(i--, 1);
			continue;
		}

		values.add(arr[i]);
	}
}