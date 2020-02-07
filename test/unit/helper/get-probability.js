import getProbability from '../../../core/helper/get-probability';

test('getProbability', () => {
    let result = 0;
    for (let i = 0; i < 1500; i++) {
		if (getProbability(0.5)) {
			result++;
		}
	}

	expect(result / 1500).toBeWithin(0.47, 0.53);
});