import lineToCamelCase from '../../../core/helper/line-to-camel-case';

test('lineToCamelCase', () => {
	const word = 'hello_world_man';
    expect(lineToCamelCase(word)).toBe('helloWorldMan');
});