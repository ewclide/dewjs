export default function aggregateCalls(handler, timeInterval = 0) {
	if (handler.isAggregator) return handler;

	const argsList = [];
	let timer = null;

	const aggregator = (...args) => {
		clearTimeout(timer);

		argsList.push(args.length > 1 ? args : args[0]);

		timer = setTimeout(() => {
			handler(argsList.slice());
			argsList.length = 0;
		}, timeInterval);
	};

	aggregator.isAggregator = true;

	return aggregator;
}