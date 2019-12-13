export function limitCalls(fn, count = 1) {
	let used = 0;
	const res = (...arg) => {
		if (used < count) {
			fn(...arg);
			used++;
		}
	}
	res.resetCalls = () => { used = 0; }
	res.getSource = () => fn;
	return res;
}