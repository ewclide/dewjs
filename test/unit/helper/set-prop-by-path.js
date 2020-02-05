import setPropByPath from '../../../core/helper/set-prop-by-path';

test('setPropByPath', () => {
    const path = ['one', 'two', 'three'];
	const target = { one: { two: { three: 3 } } };

	setPropByPath(target, ['two'], 4);
	expect(target.one.two.three).toBe(3);

	setPropByPath(target, path, 4);
	expect(target.one.two.three).toBe(4);

	setPropByPath(target, path, v => v * 2);
	expect(target.one.two.three).toBe(8);
});