import dashToCamelCase from '../../../core/helper/dash-to-camel-case';

test('dashToCamelCase', () => {
	const word = 'hello-world-man';
    expect(dashToCamelCase(word)).toBe('helloWorldMan');
});