export default function removeValue(arr, value) {
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