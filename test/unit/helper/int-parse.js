import intParse from '../../../core/helper/int-parse';

test('intParse', () => {
	expect(intParse('abc12%5d')).toBe(125);
});