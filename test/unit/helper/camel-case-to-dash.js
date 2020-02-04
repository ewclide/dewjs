import camelCaseToDash from '../../../core/helper/camel-case-to-dash';

test('camelCaseToDash', () => {
	const word = 'helloWorldMan';
    expect(camelCaseToDash(word)).toBe('hello-world-man');
});