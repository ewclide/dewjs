import getPropByPath from '../../../core/helper/get-prop-by-path';

test('getPropByPath', () => {
    const path = ['one', 'two', 'three'];
    const target = { one: { two: { three: 3 } } };

	expect(getPropByPath(target, path)).toBe(3);
	expect(getPropByPath(target, [])).toBe(undefined);
	expect(getPropByPath(target, ['two'])).toBe(undefined);
});