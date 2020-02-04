import camelCaseToLine from '../../../core/helper/camel-case-to-line';

test('camelCaseToLine', () => {
	const word = 'helloWorldMan';
    expect(camelCaseToLine(word)).toBe('hello_world_man');
});