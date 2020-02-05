import getProbability from '../../../core/helper/get-probability';

test('getProbability', () => {
    let result = 0;
    for (let i = 0; i < 100; i++) {
		if (getProbability(0.5)) {
			result++;
		}
	}

	expect(result / 100).toBeWithin(0.4, 0.6);
});