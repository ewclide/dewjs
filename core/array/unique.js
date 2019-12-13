export default function unique(arr) {
    if (window.Set) return [...new Set(arr)];

    const hash = {};
	for (let i = 0; i < arr.length; i++) {
		if (!(arr[i] in hash)) hash[arr[i]] = true
		else arr.splice(i--, 1);
	}
}