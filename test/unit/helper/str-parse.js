import strParse from '../../../core/helper/str-parse';

test('strParse', () => {
    expect(strParse(' 0 ')).toBe(0);
    expect(strParse(' 125 ')).toBe(125);
    expect(strParse(' str ')).toBe('str');
    expect(strParse(' true ')).toBe(true);
    expect(strParse(' false ')).toBe(false);
    expect(strParse(' TRUE ')).toBe(true);
    expect(strParse('[a, 1, true]')).toEqual(['a', 1, true]);
    expect(strParse('{ a: text, b: true, "c": 123 }')).toEqual({ a: 'text', b: true, c: 123 });
});