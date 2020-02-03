export default function idGetter(prefix = 0) {
	return (() => {
		let id = 0;
		return () => prefix + id++;
	})();
}