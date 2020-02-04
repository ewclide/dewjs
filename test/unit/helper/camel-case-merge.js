import camelCaseMerge from '../../../core/helper/camel-case-merge';

test('camelCaseMerge', () => {
	const words = ['hello', 'world', 'man'];
    expect(camelCaseMerge(words)).toBe('helloWorldMan');
});