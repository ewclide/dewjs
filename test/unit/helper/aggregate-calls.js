import aggregateCalls from '../../../core/helper/aggregate-calls';
import { sleep } from '../../utils';

test('aggregateCalls', async () => {
	let result;
	const handler = aggregateCalls((args) => {
		result = args;
	});

	handler(1, 2);
	handler(3);
	handler(4);

	await sleep(500);

	expect(result).toEqual([[1, 2], 3, 4]);
});
