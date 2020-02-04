export default function aggregateCalls(handler, timeInterval = 0) {
	if (handler.isAggregator) return handler;

	const inputs = [];
	let timer = null;

	const aggregator = (...args) => {
		clearTimeout(timer);
		inputs.push(args.length > 1 ? args : args[0]);

		timer = setTimeout(() => {
			handler(inputs.slice());
			inputs.length = 0;
		}, timeInterval);
	};

	aggregator.isAggregator = true;

	return aggregator;
}