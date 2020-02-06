import booleanParse from '../../../core/helper/boolean-parse';

test('booleanParse', () => {
    expect(booleanParse(' true ')).toBe(true);
    expect(booleanParse(' false ')).toBe(false);
    expect(booleanParse(' "false" ')).toBe(false);
    expect(booleanParse(' FALSE ')).toBe(false);
});