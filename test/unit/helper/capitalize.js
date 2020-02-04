import capitalize from '../../../core/helper/capitalize';

test('capitalize', () => {
    const str = ' hello world ';
    expect(capitalize(str)).toBe('Hello world');
    expect(capitalize(str, true)).toBe('Hello World');
});