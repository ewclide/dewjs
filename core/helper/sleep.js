export default function sleep(time) {
	if (!time) return Promise.resolve();
	return new Promise((resolve) => setTimeout(resolve, time));
}