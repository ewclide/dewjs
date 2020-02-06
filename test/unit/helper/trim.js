import trim from '../../../core/helper/trim';

test('trim', () => {
    expect(trim(' hello   world ')).toBe('hello   world');
    expect(trim(' hello   world ', true)).toBe('hello world');
});